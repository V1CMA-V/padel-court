import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { AddInscription } from './add-inscription'

export default function TournamentInscriptionTab({
  teamsInscribed,
  categories,
  tournament,
}: {
  teamsInscribed: {
    id: string
    team: { ownerName: string | null; teammateName: string | null }
    category: { name: string }
    createdAt: Date
    status: string
  }[]
  categories: { id: string; name: string }[]
  tournament: {
    id: string
    slug: string
  } | null
}) {
  const dictionaryStatus: { [key: string]: string } = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    APPROVED: 'Aprobado',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipos Inscritos</CardTitle>
        <CardDescription>
          Gestiona las inscripciones de equipos al torneo
        </CardDescription>

        {tournament && (
          <CardAction>
            <AddInscription categories={categories} tournament={tournament} />
            <Button size={'sm'}>Exportar CSV</Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha Inscripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamsInscribed.map((teamEnrollment) => (
              <TableRow key={teamEnrollment.id}>
                <TableCell className="font-medium">
                  {teamEnrollment.team.ownerName || 'Sin nombre'} /{' '}
                  {teamEnrollment.team.teammateName || 'Sin nombre'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {teamEnrollment.category.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(teamEnrollment.createdAt).toLocaleDateString(
                    'es-ES'
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      teamEnrollment.status === 'PENDING'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {dictionaryStatus[teamEnrollment.status] ||
                      teamEnrollment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
