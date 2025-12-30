import { ThemeProvider } from '@/components/theme-provider'
import Footer from '@/sections/Footer'
import Navbar from '@/sections/navbar'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Padel Court',
  description: 'Inscripcion de torneo de padel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-[80dvh]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
