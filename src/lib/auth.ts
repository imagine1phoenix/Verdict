import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, loginHistory } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email.toLowerCase()));

                if (!user) {
                    throw new Error("No account found with this email");
                }

                if (!user.password) {
                    throw new Error("This account uses Google sign-in. Please use Google to log in.");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                // Record login history
                const now = new Date();
                await db.insert(loginHistory).values({
                    userId: user.id,
                    method: "credentials",
                    timestamp: now,
                });

                await db
                    .update(users)
                    .set({
                        loginCount: user.loginCount + 1,
                        lastLoginAt: now,
                        lastSeenAt: now,
                        status: "online",
                        updatedAt: now,
                    })
                    .where(eq(users.id, user.id));

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    image: user.avatar || "",
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            // Auto-register / update Google OAuth users
            if (account?.provider === "google" && user.email) {
                try {
                    const now = new Date();
                    const [existingUser] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, user.email.toLowerCase()));

                    if (existingUser) {
                        // Update existing user with login history
                        await db.insert(loginHistory).values({
                            userId: existingUser.id,
                            method: "google",
                            timestamp: now,
                        });

                        await db
                            .update(users)
                            .set({
                                loginCount: existingUser.loginCount + 1,
                                lastLoginAt: now,
                                lastSeenAt: now,
                                status: "online",
                                name: user.name || existingUser.name,
                                avatar: user.image || existingUser.avatar,
                                updatedAt: now,
                            })
                            .where(eq(users.id, existingUser.id));
                    } else {
                        // Auto-register new Google user
                        const [newUser] = await db
                            .insert(users)
                            .values({
                                name: user.name || "Google User",
                                email: user.email.toLowerCase(),
                                provider: "google",
                                avatar: user.image || "",
                                role: "member",
                                isActive: true,
                                loginCount: 1,
                                lastLoginAt: now,
                                lastSeenAt: now,
                                status: "online",
                            })
                            .returning();

                        await db.insert(loginHistory).values({
                            userId: newUser.id,
                            method: "google",
                            timestamp: now,
                        });
                    }
                } catch (error) {
                    console.error("Error persisting Google user:", error);
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
