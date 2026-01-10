'use client'

import { File, Search } from 'lucide-react'
import { useState } from 'react'
import TorneoCard from './tournament-card'
import { Input } from '../ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

type Tournament = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: 'DRAFT' | 'OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED'
  capacity: number | null
  slug: string
}

interface TournamentsListProps {
  tournaments: Tournament[]
}

export default function TournamentsList({ tournaments }: TournamentsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar torneos por búsqueda
  const filteredTournaments = tournaments.filter((torneo) =>
    torneo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Separar torneos por estado
  const torneosDraft = filteredTournaments.filter(
    (torneo) => torneo.status === 'DRAFT'
  )
  const torneosOpen = filteredTournaments.filter(
    (torneo) => torneo.status === 'OPEN'
  )
  const torneosOngoing = filteredTournaments.filter(
    (torneo) => torneo.status === 'ONGOING'
  )
  const torneosFinished = filteredTournaments.filter(
    (torneo) => torneo.status === 'FINISHED'
  )
  const torneosCancelled = filteredTournaments.filter(
    (torneo) => torneo.status === 'CANCELED'
  )

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar torneos..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activos">
            Activos ({torneosOpen.length + torneosOngoing.length})
          </TabsTrigger>
          <TabsTrigger value="borradores">
            Borradores ({torneosDraft.length})
          </TabsTrigger>
          <TabsTrigger value="pasados">
            Pasados ({torneosFinished.length + torneosCancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="space-y-4">
          {torneosOpen.length === 0 && torneosOngoing.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {searchQuery
                  ? 'No se encontraron torneos'
                  : 'No tienes torneos activos'}
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? 'No hay torneos activos que coincidan con tu búsqueda.'
                  : 'Actualmente no tienes torneos activos. Por favor, crea algunos para que puedas verlos aquí.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosOpen.concat(torneosOngoing).map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="borradores" className="space-y-4">
          {torneosDraft.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {searchQuery
                  ? 'No se encontraron torneos'
                  : 'No tienes borradores de torneos'}
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? 'No hay borradores que coincidan con tu búsqueda.'
                  : 'Los torneos guardados como borrador aparecerán aquí. Crea un torneo y guárdalo como borrador para verlo en esta sección.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosDraft.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pasados" className="space-y-4">
          {torneosFinished.length === 0 && torneosCancelled.length === 0 ? (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <File className="w-10 h-10 text-primary" />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {searchQuery
                  ? 'No se encontraron torneos'
                  : 'No tienes torneos pasados'}
              </h2>
              <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? 'No hay torneos finalizados o cancelados que coincidan con tu búsqueda.'
                  : 'Los torneos finalizados o cancelados aparecerán aquí.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {torneosFinished.concat(torneosCancelled).map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
