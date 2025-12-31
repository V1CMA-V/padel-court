import UpdateProfileForm from '@/components/update-profile-form'
import { createClient } from '@/lib/supabase/server'
import PlayersTeams from '@/sections/player-teams'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <section className="grid items-start gap-8 max-w-350 m-auto py-10 mt-20">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Perfil</h1>
          <p className="text-lg text-muted-foreground">
            Configuración de tu perfil
          </p>
        </div>
      </div>

      <UpdateProfileForm userId={user?.id as string} />

      <PlayersTeams userId={user?.id as string} />
    </section>
  )
}
