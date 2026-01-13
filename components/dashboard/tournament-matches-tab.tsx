import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Match {
  id: string
  scheduled: Date | null
  round: string | null
  status: string | null
  category: {
    name: string
  } | null
  court: {
    name: string
  } | null
}

interface TournamentMatchesTabProps {
  matches: Match[]
}

const getRoundLabel = (round: string | null) => {
  if (!round) return '-'
  const labels: Record<string, string> = {
    Group: 'Grupos',
    QF: 'Cuartos',
    SF: 'Semifinal',
    FINAL: 'Final',
  }
  return labels[round] || round
}

const getStatusLabel = (status: string | null) => {
  if (!status) return 'Programado'
  const labels: Record<string, string> = {
    SCHEDULED: 'Programado',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    IN_PROGRESS: 'En Progreso',
  }
  return labels[status] || status
}

export default function TournamentMatchesTab({
  matches,
}: TournamentMatchesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendario de Partidos</CardTitle>
            <CardDescription>
              Listado de todos los partidos del torneo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {matches.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Cancha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ronda</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    {match.scheduled ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(match.scheduled).toLocaleDateString(
                            'es-ES'
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(match.scheduled).toLocaleTimeString(
                            'es-ES',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Por definir
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {match.court?.name || 'Sin asignar'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {match.category?.name || 'Sin categoría'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getRoundLabel(match.round)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        match.status === 'COMPLETED' ? 'default' : 'secondary'
                      }
                    >
                      {getStatusLabel(match.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay partidos programados aún
          </div>
        )}
      </CardContent>
    </Card>
  )
}
