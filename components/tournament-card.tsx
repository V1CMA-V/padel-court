import { Calendar, Edit, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

type TournamentStatus = 'DRAFT' | 'OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED'

type Tournament = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: TournamentStatus
  capacity: number | null
}

export default function TorneoCard({
  torneo,
  inscriptions = 0,
  matches = 0,
}: {
  torneo: Tournament
  inscriptions?: number
  matches?: number
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{torneo.name}</CardTitle>
              <Badge variant="outline">Padel</Badge>
            </div>
            <CardDescription>
              {new Date(torneo.startDate).toLocaleDateString('es-ES')} -{' '}
              {new Date(torneo.endDate).toLocaleDateString('es-ES')}
            </CardDescription>
          </div>
          <Badge
            variant={
              torneo.status === 'OPEN' || torneo.status === 'ONGOING'
                ? 'default'
                : torneo.status === 'DRAFT'
                ? 'secondary'
                : 'outline'
            }
          >
            {torneo.status === 'OPEN'
              ? 'Abierto'
              : torneo.status === 'ONGOING'
              ? 'En Curso'
              : torneo.status === 'DRAFT'
              ? 'Borrador'
              : torneo.status === 'FINISHED'
              ? 'Finalizado'
              : 'Cancelado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {inscriptions ? `${inscriptions}/${torneo.capacity}` : '0 '}
            inscritos
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {matches ? `${matches}` : '0 '}
            partidos
          </span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" asChild>
            <Link href={`/dashboard/tournament/${torneo.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Gestionar
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
