import TournamentsList from '@/components/tournaments-list'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getData(userId: string) {
  const data = await prisma.tournament.findMany({
    where: {
      clubId: userId,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      capacity: true,
      slug: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}

export default async function DashboardTorneosPage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims?.sub) {
    redirect('/plans')
  }

  const userId = data?.claims.sub as string

  const tournaments = await getData(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Torneos</h1>
          <p className="text-muted-foreground">
            Administra todos tus torneos en un solo lugar
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tournament/new">
            <Plus className="mr-2 h-4 w-4" />
            Crear Torneo
          </Link>
        </Button>
      </div>

      <TournamentsList tournaments={tournaments} />
    </div>
  )
}
