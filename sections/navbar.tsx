import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import UserNav from '@/components/user-nav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const links = [
  { href: '/tournaments', label: 'Torneos' },
  { href: '/clubs', label: 'Clubes' },
  { href: '/about', label: 'Sobre Nosotros' },
  { href: '/plans', label: 'Planes' },
]

export default async function Navbar() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  const id = data?.claims?.sub as string
  const role = data?.claims?.user_metadata?.role as
    | 'PLAYER'
    | 'CLUB'
    | undefined

  return (
    <header className="max-w-350 mx-auto flex justify-between items-center min-h-[10Vh] px-4 fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50">
      <Link href="/">
        <h2 className="text-2xl font-bold">
          Cham<span className="text-primary">Pádel</span>
        </h2>
      </Link>

      <div className="flex items-center gap-4">
        <nav>
          <ul className="flex gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <div className="flex gap-2">
          <ModeToggle />

          {data?.claims ? (
            <UserNav id={id} role={role} />
          ) : (
            <>
              <Button asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/sign-up">Registrate</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
