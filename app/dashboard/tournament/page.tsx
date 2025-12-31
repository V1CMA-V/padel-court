import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Edit, Plus, Search, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardTorneosPage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  if (!data?.claims?.sub) {
    redirect('/plans')
  }

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

  const TorneoCard = ({ torneo }: { torneo: any }) => (
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
          <Link href="/dashboard/tournament/crear">
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
          <div className="grid gap-4 md:grid-cols-2">
            {torneosActivos.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="borradores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {torneosBorrador.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pasados" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {torneosPasados.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
