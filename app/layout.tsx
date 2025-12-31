import { ThemeProvider } from '@/components/theme-provider'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Padel Court',
  description: 'Inscripcion de torneo de padel',
}

async function getPlayerColorScheme(userId: string) {
  if (!userId) return null

  const data = await prisma.player.findUnique({
    where: {
      id: userId,
    },
    select: {
      colorSchema: true,
    },
  })

  return data
}
async function getClubColorScheme(userId: string) {
  if (!userId) return null

  const data = await prisma.club.findUnique({
    where: {
      id: userId,
    },
    select: {
      colorSchema: true,
    },
  })

  return data
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  const userID = data?.claims.sub as string
  const role = data?.claims?.user_metadata?.role as
    | 'PLAYER'
    | 'CLUB'
    | undefined

  // Fetch user color scheme preference

  const colorScheme =
    role === 'CLUB'
      ? await getClubColorScheme(userID)
      : await getPlayerColorScheme(userID)

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${roboto.className} ${
          colorScheme?.colorSchema ?? 'theme-orange'
        } antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
