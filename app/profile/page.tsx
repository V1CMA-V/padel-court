import UpdateProfileForm from '@/components/update-profile-form'
import { createClient } from '@/lib/supabase/server'
import Footer from '@/sections/Footer'
import Navbar from '@/sections/navbar'
import PlayersTeams from '@/sections/player-teams'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  const userId = data?.claims.sub as string
  const role = data?.claims.user_metadata?.role as 'PLAYER' | 'CLUB' | undefined

  if (!data?.claims.sub) {
    redirect('/login')
  }
  if (role !== 'PLAYER') {
    redirect('/dashboard')
  }

  return (
    <>
      <Navbar />
      <main className="grid items-start gap-8 max-w-350 m-auto py-10 mt-20">
        <section className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl">Perfil</h1>
            <p className="text-lg text-muted-foreground">
              Configuración de tu perfil
            </p>
          </div>
        </section>

        <UpdateProfileForm userId={userId} />

        <PlayersTeams userId={userId} />
      </main>
      <Footer />
    </>
  )
}
