import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

import Providers from './providers'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
})

export const metadata: Metadata = {
    title: 'coursestats',
    description: 'Statistics for courses at NTNU'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={`bg-background font-sans ${inter.variable} flex h-screen flex-col items-center justify-start`}
            >
                <Providers>
                    <Toaster />
                    <Header />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
