import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import UserNav from '@/components/user-nav'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Navbar() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  const id = data?.claims?.sub as string

  console.log('Navbar user id:', id)

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
            <li>
              <Link href="/tournaments">Torneos</Link>
            </li>
            <li>
              <Link href="/clubs">Clubes</Link>
            </li>
            <li>
              <Link href="/about">Sobre Nosotros</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <div className="flex gap-2">
          <ModeToggle />

          {data?.claims ? (
            <UserNav id={id} />
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
