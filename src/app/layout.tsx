import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: 'Verdict.AI | Legal Intelligence',
    description: 'AI-powered legal intelligence, mock trials, and case precedent analysis.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body className="bg-newsprint text-ink antialiased flex h-screen overflow-hidden font-sans">
                <AuthProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </AuthProvider>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 4000,
                        className: 'text-sm font-bold border border-ink font-mono uppercase tracking-wide',
                        style: {
                            background: '#F9F9F7',
                            color: '#111111',
                            borderRadius: '0',
                        }
                    }}
                />
            </body>
        </html>
    );
}

