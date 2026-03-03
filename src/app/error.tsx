"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-newsprint p-6 font-sans text-center">
            <div className="border border-ink p-8 max-w-lg">

                {/* Inverted error strip */}
                <div className="bg-accent text-newsprint px-4 py-2 mb-6 inline-block">
                    <h2 className="text-xl font-serif font-bold tracking-wider uppercase">
                        Runtime Error
                    </h2>
                </div>

                <p className="text-ink font-sans text-sm mb-8 leading-relaxed">
                    {error.message || "An unexpected fragmentation occurred in the render lifecycle."}
                </p>

                <button
                    onClick={() => reset()}
                    className="bg-ink text-newsprint font-sans text-xs font-bold px-6 py-3 hover:bg-ink/90 transition-colors uppercase tracking-widest"
                >
                    Attempt System Recovery
                </button>
            </div>
        </div>
    );
}
