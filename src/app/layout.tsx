import '~/styles/globals.css'

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import Header from '~/components/layout/header'
import Footer from '~/components/layout/footer'
import ReactQueryProvider from '~/components/react-query-provider'

export const metadata: Metadata = {
  title: 'CourseStats',
  description: 'coursestatistics for norwegian universities'
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col items-center justify-start ${inter.variable} font-inter antialiased`}
      >
        <ReactQueryProvider>
          <div className="verticle-borders flex min-h-screen w-full max-w-4xl flex-col">
            <Header />
            <main className="flex flex-grow flex-col">{children}</main>
            <Footer />
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
