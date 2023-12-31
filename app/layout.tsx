import AuthProvider from '@/components/providers/auth-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import SocketProvider from '@/components/providers/socket-provider'
import QueryProvider from '@/components/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dicord Clone',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang='en'>
        <body className={font.className} suppressHydrationWarning>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            storageKey='discord-clone-theme'
          >
            <SocketProvider>
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
