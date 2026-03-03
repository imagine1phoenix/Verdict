"use client";

import { useState } from "react";
import { Scale, Lock, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            document.cookie = "verdict_auth=true; path=/; max-age=86400";
            setIsLoading(false);
            toast.success("AUTH SUCCESSFUL");
            router.push("/");
        }, 1500);
    };

    return (
        <div className="flex-1 w-full h-full bg-newsprint flex flex-col justify-center items-center p-6 font-sans relative">

            {/* Decorative horizontal rules */}
            <div className="absolute top-8 left-8 right-8 border-t-[4px] border-ink" />
            <div className="absolute top-10 left-8 right-8 border-t border-ink" />

            {/* Login Card */}
            <div className="w-full max-w-md border border-ink bg-newsprint relative z-10">

                {/* Inverted Header */}
                <div className="bg-ink text-newsprint py-8 px-8 text-center border-b border-ink">
                    <Scale className="w-6 h-6 mx-auto mb-3 text-newsprint" strokeWidth={1.5} />
                    <h1 className="font-serif text-3xl font-bold tracking-[0.15em]">VERDICT.AI</h1>
                    <p className="text-[10px] font-mono text-neutral mt-2 uppercase tracking-widest">Secure Portal</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h2 className="font-serif text-xl font-bold text-ink mb-1">Restricted Access</h2>
                        <p className="text-[10px] font-sans font-semibold text-neutral uppercase tracking-wider">Enter credentials to proceed</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-sans font-bold text-neutral mb-3 flex items-center uppercase tracking-wider">
                                <Mail className="w-3.5 h-3.5 mr-2" strokeWidth={1.5} /> Identity Identifier
                            </label>
                            <input
                                type="email"
                                required
                                defaultValue="prit@verdictlaw.in"
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
                                required
                                defaultValue="password123"
                                placeholder="PASSPHRASE..."
                                className="input-newsprint text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-8 flex justify-center items-center py-3.5 bg-ink text-newsprint font-sans text-xs font-bold hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                        >
                            {isLoading ? "Authenticating..." : (
                                <>
                                    <span>Initialize</span>
                                    <ArrowRight className="w-4 h-4 ml-3" strokeWidth={1.5} />
                                </>
                            )}
                        </button>
                    </form>
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
