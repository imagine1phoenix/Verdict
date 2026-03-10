"use client";

import { useState } from "react";
import { Scale, Lock, Mail, User, ArrowRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

        if (password !== confirmPassword) {
            toast.error("PASSWORDS DO NOT MATCH");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("PASSWORD MUST BE AT LEAST 6 CHARACTERS");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error?.toUpperCase() || "REGISTRATION FAILED");
                setIsLoading(false);
                return;
            }

            toast.success("ACCOUNT CREATED SUCCESSFULLY");

            // Auto-sign in after registration
            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInResult?.ok) {
                router.push("/");
            } else {
                router.push("/login");
            }
        } catch {
            toast.error("SOMETHING WENT WRONG");
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        setIsGoogleLoading(true);
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="flex-1 w-full h-full bg-newsprint flex flex-col justify-center items-center p-6 font-sans relative">

            {/* Decorative horizontal rules */}
            <div className="absolute top-8 left-8 right-8 border-t-[4px] border-ink" />
            <div className="absolute top-10 left-8 right-8 border-t border-ink" />

            {/* Register Card */}
            <div className="w-full max-w-md border border-ink bg-newsprint relative z-10">

                {/* Inverted Header */}
                <div className="bg-ink text-newsprint py-8 px-8 text-center border-b border-ink">
                    <Scale className="w-6 h-6 mx-auto mb-3 text-newsprint" strokeWidth={1.5} />
                    <h1 className="font-serif text-3xl font-bold tracking-[0.15em]">VERDICT.AI</h1>
                    <p className="text-[10px] font-mono text-neutral mt-2 uppercase tracking-widest">New Registration</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <div className="mb-6 text-center">
                        <h2 className="font-serif text-xl font-bold text-ink mb-1">Create Account</h2>
                        <p className="text-[10px] font-sans font-semibold text-neutral uppercase tracking-wider">Register to access the portal</p>
                    </div>

                    {/* Google Sign-Up Button */}
                    <button
                        onClick={handleGoogleRegister}
                        disabled={isGoogleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-ink bg-newsprint text-ink hover:bg-ink hover:text-newsprint transition-all font-sans text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isGoogleLoading ? (
                            "Redirecting..."
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.09z"
                                        className="fill-[#4285F4] group-hover:fill-newsprint transition-colors"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        className="fill-[#34A853] group-hover:fill-newsprint transition-colors"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        className="fill-[#FBBC05] group-hover:fill-newsprint transition-colors"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        className="fill-[#EA4335] group-hover:fill-newsprint transition-colors"
                                    />
                                </svg>
                                <span>Sign up with Google</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-ink/20" />
                        <span className="px-4 text-[9px] font-mono text-neutral uppercase tracking-widest">or</span>
                        <div className="flex-1 border-t border-ink/20" />
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-3 flex items-center uppercase tracking-wider">
                                <User className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="ENTER FULL NAME..."
                                className="input-newsprint text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-3 flex items-center uppercase tracking-wider">
                                <Mail className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Identity Identifier
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="FIRM EMAIL..."
                                className="input-newsprint text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-3 flex items-center uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Access Protocol
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="MIN 6 CHARACTERS..."
                                className="input-newsprint text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-3 flex items-center uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Confirm Protocol
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                placeholder="REPEAT PASSPHRASE..."
                                className="input-newsprint text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 flex justify-center items-center py-3.5 bg-ink text-newsprint font-sans text-xs font-bold hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                        >
                            {isLoading ? "Creating Account..." : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-3" strokeWidth={1.5} />
                                    <span>Register</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-sans text-neutral uppercase tracking-wider">
                            Already registered?{" "}
                            <Link
                                href="/login"
                                className="text-ink font-bold underline underline-offset-4 hover:text-ink/70 transition-colors"
                            >
                                Sign In Here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-ink p-3 text-center">
                    <p className="text-[9px] font-mono text-neutral tracking-widest uppercase">
                        Secure Connection 256-Bit
                    </p>
                </div>
            </div>

            {/* Bottom decorative rules */}
            <div className="absolute bottom-10 left-8 right-8 border-t border-ink" />
            <div className="absolute bottom-8 left-8 right-8 border-t-[4px] border-ink" />
        </div>
    );
}
