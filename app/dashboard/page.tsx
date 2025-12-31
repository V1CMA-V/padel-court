import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Edit, Plus, TrendingUp, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const torneos = [
    {
      id: 1,
      name: 'Copa de Primavera 2025',
      status: 'activo',
      inscripciones: 32,
      partidos: 16,
      fechaInicio: '2025-04-15',
    },
    {
      id: 2,
      name: 'Torneo Verano 2025',
      status: 'próximo',
      inscripciones: 8,
      partidos: 0,
      fechaInicio: '2025-07-10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, Club Deportivo Central
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tournament/new">
            <Plus className="mr-2 h-4 w-4" />
            Crear Torneo
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Torneos Activos
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jugadores Inscritos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              En todos los torneos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Partidos Programados
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,840€</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Tournaments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Torneos Activos</CardTitle>
              <CardDescription>
                Gestiona tus torneos en curso y próximos
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/tournament">Ver Todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {torneos.map((torneo) => (
              <div
                key={torneo.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{torneo.name}</h3>
                    <Badge
                      variant={
                        torneo.status === 'activo' ? 'default' : 'secondary'
                      }
                    >
                      {torneo.status === 'activo' ? 'En Curso' : 'Próximamente'}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {torneo.inscripciones} inscritos
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {torneo.partidos} partidos
                    </span>
                    <span>
                      Inicia:{' '}
                      {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/tournament/${torneo.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Gestionar
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <Trophy className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Crear Torneo</CardTitle>
            <CardDescription>
              Configura un nuevo torneo con todas sus categorías
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <Calendar className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Programar Partidos</CardTitle>
            <CardDescription>
              Genera calendarios y horarios automáticamente
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <Users className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Gestionar Inscripciones</CardTitle>
            <CardDescription>
              Revisa y aprueba nuevas inscripciones
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
