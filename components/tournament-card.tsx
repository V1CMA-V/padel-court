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

export default function TorneoCard({ torneo }: { torneo: any }) {

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{torneo.name}</CardTitle>
              <Badge variant="outline">{torneo.sport}</Badge>
            </div>
            <CardDescription>
              {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')} -{' '}
              {new Date(torneo.fechaFin).toLocaleDateString('es-ES')}
            </CardDescription>
          </div>
          <Badge
            variant={
              torneo.estado === 'activo'
                ? 'default'
                : torneo.estado === 'borrador'
                ? 'secondary'
                : 'outline'
            }
          >
            {torneo.estado === 'activo'
              ? 'En Curso'
              : torneo.estado === 'borrador'
              ? 'Borrador'
              : 'Finalizado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {torneo.inscripciones}/{torneo.capacidad} inscritos
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {torneo.partidos} partidos
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
