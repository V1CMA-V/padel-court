import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Trophy, Users } from 'lucide-react'

interface TournamentHeaderProps {
  tournament: {
    name: string
    status: 'DRAFT' | 'OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED'
    startDate: Date
    endDate: Date
    format: string | null
    capacity: number | null
    registrationFee: number | null
  }
  teamsInscribed: number
  teamsInscribedPaid: number
  matchesTotal: number
  matchesCompleted: number
  categoriesTotal: number
  categoriesNames: string
}

export default function TournamentHeader({
  tournament,
  teamsInscribed,
  teamsInscribedPaid,
  matchesTotal,
  matchesCompleted,
  categoriesTotal,
  categoriesNames,
}: TournamentHeaderProps) {
  const dictionary = {
    DRAFT: 'Borrador',
    OPEN: 'Abierto',
    ONGOING: 'En Curso',
    FINISHED: 'Finalizado',
    CANCELED: 'Cancelado',
  }

  const startDate = new Date(tournament.startDate).toLocaleDateString()
  const endDate = new Date(tournament.endDate).toLocaleDateString()

  const teamsPorcentage = tournament.capacity
    ? ((teamsInscribed / tournament.capacity) * 100).toFixed(0) + '%'
    : '0%'

  const totalIncome = teamsInscribedPaid * (tournament.registrationFee || 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <Badge>{dictionary[tournament.status]}</Badge>
          </div>
          <p className="text-muted-foreground">
            Padel • {startDate} - {endDate} •{' '}
            {tournament.format?.toUpperCase() || 'N/A'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamsInscribed}/{tournament.capacity}
            </div>
            <p className="text-xs text-muted-foreground">{teamsPorcentage}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchesTotal}</div>
            <p className="text-xs text-muted-foreground">
              {matchesCompleted} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesTotal}</div>
            <p className="text-xs text-muted-foreground">{categoriesNames}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome}</div>
            <p className="text-xs text-muted-foreground">
              {teamsInscribedPaid} × ${tournament.registrationFee || 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
