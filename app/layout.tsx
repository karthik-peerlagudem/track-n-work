import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { QueryProviders } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Track N Work',
    description: 'Get your work done with Track N Work',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <QueryProviders>
                        <SheetProvider />
                        <Toaster />
                        {children}
                    </QueryProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
