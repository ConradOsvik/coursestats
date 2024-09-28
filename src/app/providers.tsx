'use client'

import { Provider } from 'jotai'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider>
            <ThemeProvider
                attribute='class'
                // defaultTheme="system"
                defaultTheme='light'
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </Provider>
    )
}
