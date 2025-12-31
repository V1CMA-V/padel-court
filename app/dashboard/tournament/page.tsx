import TorneoCard from '@/components/tournament-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { File, Plus, Search } from 'lucide-react'
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

  const tournaments = await getData(data.claims.sub)

  console.log('Torneos: ', tournaments)

  const torneosActivos = [
    {
      id: 1,
      name: 'Copa de Primavera 2025',
      sport: 'Tenis',
      fechaInicio: '2025-04-15',
      fechaFin: '2025-04-20',
      inscripciones: 32,
      capacidad: 64,
      partidos: 16,
      estado: 'activo',
    },
    {
      id: 3,
      name: 'Masters de Pádel',
      sport: 'Pádel',
      fechaInicio: '2025-05-01',
      fechaFin: '2025-05-05',
      inscripciones: 24,
      capacidad: 32,
      partidos: 12,
      estado: 'activo',
    },
  ]

  const torneosPasados = [
    {
      id: 5,
      name: 'Torneo de Invierno 2024',
      sport: 'Tenis',
      fechaInicio: '2024-12-10',
      fechaFin: '2024-12-15',
      inscripciones: 48,
      capacidad: 48,
      partidos: 47,
      estado: 'finalizado',
    },
  ]

  const torneosBorrador = [
    {
      id: 7,
      name: 'Copa de Verano 2025',
      sport: 'Tenis',
      fechaInicio: '2025-07-10',
      fechaFin: '2025-07-15',
      inscripciones: 0,
      capacidad: 64,
      partidos: 0,
      estado: 'borrador',
    },
  ]

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar torneos..." className="pl-9" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activos">
            Activos ({torneosActivos.length})
          </TabsTrigger>
          <TabsTrigger value="borradores">
            Borradores ({torneosBorrador.length})
          </TabsTrigger>
          <TabsTrigger value="pasados">
            Pasados ({torneosPasados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                No tienes torneos activos
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                Actualmente no tienes torneos activos. Por favor, crea algunos
                para que puedas verlos aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosActivos.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="borradores" className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                No tienes torneos activos
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                Actualmente no tienes torneos activos. Por favor, crea algunos
                para que puedas verlos aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosBorrador.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pasados" className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                No tienes torneos activos
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                Actualmente no tienes torneos activos. Por favor, crea algunos
                para que puedas verlos aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosPasados.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
