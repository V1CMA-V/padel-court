import { updateTournament } from '@/app/actions/tournament-actions'
import TournamentInscriptionTab from '@/components/dashboard/tournament-inscrition-tab'
import InformationForm from '@/components/information-form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import prisma from '@/lib/prisma'
import {
  CalendarIcon,
  Edit,
  Grid3x3,
  Plus,
  Target,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react'

async function getData(tournamentSlug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      startDate: true,
      endDate: true,
      status: true,
      capacity: true,
      description: true,
      format: true,
      prize1st: true,
      prize2nd: true,
      prize3rd: true,
      registrationFee: true,
      rules: true,
    },
  })

  const teamsInscribed = await prisma.teamEnrollment.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      createdAt: true,

      category: {
        select: {
          name: true,
        },
      },

      team: {
        select: {
          ownerName: true,
          teammateName: true,
        },
      },
      status: true,
    },
  })

  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      category: {
        select: {
          name: true,
        },
      },

      court: {
        select: {
          name: true,
        },
      },

      round: true,
      scheduled: true,
      status: true,
    },
  })

  const categories = await prisma.category.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      prize1st: true,
      prize2nd: true,
      prize3rd: true,
    },
  })

  return { tournament, teamsInscribed, matches, categories }
}

export default async function GestionarTorneoPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const { tournament, teamsInscribed, matches, categories } = await getData(
    slug
  )

  // TODO: Replace with real data from DB

  const equiposInscritos = [
    {
      id: 'team-1',
      teamName: 'Carlos Rodríguez',
      players: [{ name: 'Carlos Rodríguez', email: 'carlos@email.com' }],
      categoryName: 'Individual Masculino',
      inscriptionStatus: 'paid',
      inscriptionDate: '2025-03-10',
      stripePaymentId: 'pi_123456',
    },
    {
      id: 'team-2',
      teamName: 'Ana Martínez',
      players: [{ name: 'Ana Martínez', email: 'ana@email.com' }],
      categoryName: 'Individual Femenino',
      inscriptionStatus: 'paid',
      inscriptionDate: '2025-03-12',
      stripePaymentId: 'pi_123457',
    },
    {
      id: 'team-3',
      teamName: 'Juan Pérez & Luis García',
      players: [
        { name: 'Juan Pérez', email: 'juan@email.com' },
        { name: 'Luis García', email: 'luis@email.com' },
      ],
      categoryName: 'Dobles Masculino',
      inscriptionStatus: 'pending',
      inscriptionDate: '2025-03-14',
      stripePaymentId: null,
    },
  ]

  const partidos = [
    {
      id: 'match-1',
      scheduled: '2025-04-15T10:00:00',
      round: 'QF',
      courtId: 'court-1',
      courtName: 'Pista 1 Central',
      categoryName: 'Individual Masculino',
      team1Id: 'team-1',
      team1Name: 'Carlos Rodríguez',
      team2Id: 'team-4',
      team2Name: 'Pedro Sánchez',
      result: null,
      status: 'scheduled',
    },
    {
      id: 'match-2',
      scheduled: '2025-04-15T12:00:00',
      round: 'QF',
      courtId: 'court-2',
      courtName: 'Pista 2',
      categoryName: 'Dobles Masculino',
      team1Id: 'team-3',
      team1Name: 'Juan Pérez & Luis García',
      team2Id: 'team-5',
      team2Name: 'Mario L. & Pedro S.',
      result: { score: '6-4, 6-3', winner: 1 },
      status: 'completed',
    },
  ]

  const canchasDisponibles = [
    { id: 'court-1', name: 'Pista 1 Central', isIndoor: false },
    { id: 'court-2', name: 'Pista 2', isIndoor: true },
    { id: 'court-3', name: 'Pista 3', isIndoor: true },
    { id: 'court-4', name: 'Pista 4', isIndoor: false },
  ]

  const getRoundLabel = (round: string) => {
    const labels: Record<string, string> = {
      Group: 'Grupos',
      QF: 'Cuartos',
      SF: 'Semifinal',
      FINAL: 'Final',
    }
    return labels[round] || round
  }

  const dictionary = {
    DRAFT: 'Borrador',
    OPEN: 'Abierto',
    ONGOING: 'En Curso',
    FINISHED: 'Finalizado',
    CANCELED: 'Cancelado',
  }

  const startDate = tournament?.startDate
    ? new Date(tournament.startDate).toLocaleDateString()
    : ''

  const endDate = tournament?.endDate
    ? new Date(tournament.endDate).toLocaleDateString()
    : ''

  const teamsPorcentage = tournament?.capacity
    ? ((teamsInscribed.length / tournament.capacity) * 100).toFixed(0) + '%'
    : '0%'

  const teamsInscribedPaid = teamsInscribed.filter(
    (e) => e.status === 'PAID'
  ).length

  const matchesCompleted = matches.filter(
    (m) => m.status === 'COMPLETED'
  ).length
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{tournament?.name}</h1>
            <Badge>{dictionary[tournament?.status || 'DRAFT']}</Badge>
          </div>
          <p className="text-muted-foreground">
            Padel • {startDate} - {endDate} •{' '}
            {tournament?.format?.toUpperCase() || 'N/A'}
          </p>
        </div>
        {/* <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button> */}
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
              {teamsInscribed.length}/{tournament?.capacity}
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
            <div className="text-2xl font-bold">{matches.length}</div>
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
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.map((cat) => cat.name).join(', ')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${teamsInscribedPaid * (tournament?.registrationFee || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {teamsInscribedPaid} × ${tournament?.registrationFee || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="partidos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
          <TabsTrigger value="inscritos">Inscritos</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

        {/* Categorías Tab */}
        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Gestión de Categorías y Fases del Torneo
                  </CardTitle>
                  <CardDescription>
                    Crea categorías, organiza grupos y programa las fases
                    eliminatorias
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Categoría</DialogTitle>
                      <DialogDescription>
                        Define los detalles de la categoría y configuración de
                        inscripciones
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input placeholder="Ej: Individual Masculino" />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea placeholder="Describe la categoría..." />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Precio de Inscripción (€) *</Label>
                          <Input type="number" placeholder="45" />
                        </div>
                        <div className="space-y-2">
                          <Label>Límite de Inscripciones *</Label>
                          <Input type="number" placeholder="32" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>¿Incluye Fase de Grupos?</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Sí</SelectItem>
                            <SelectItem value="no">
                              No (Eliminación directa)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancelar</Button>
                      <Button>Crear Categoría</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {categories.map((categoria) => {
                  return (
                    <AccordionItem key={categoria.id} value={categoria.id}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <Trophy className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <div className="font-semibold">
                                {categoria.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {categoria.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                              3 equipos inscritos
                            </Badge>
                            <Badge variant="outline">
                              <Grid3x3 className="mr-1 h-3 w-3" />0 grupos
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-4">
                          {/* Información básica */}
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm">
                                  Inscripciones
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  current inscripciones
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm">
                                  Equipos activos
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge>12 equipos</Badge>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Equipos inscritos */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Equipos Inscritos
                            </h4>
                            {false ? (
                              <div className="grid gap-2 md:grid-cols-2">
                                {/* {equiposCategoria.map((equipo) => (
                                  <Card key={equipo.id}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium">
                                            {equipo.teamName}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {equipo.players
                                              .map((p) => p.name)
                                              .join(', ')}
                                          </div>
                                        </div>
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))} */}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                No hay equipos inscritos en esta categoría
                              </div>
                            )}
                          </div>

                          {/* Fase de Grupos */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Fase de Grupos</h4>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Grupo
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Crear Grupo</DialogTitle>
                                    <DialogDescription>
                                      Crea un grupo y asigna equipos de la
                                      categoría
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Nombre del Grupo *</Label>
                                      <Input placeholder="A, B, C..." />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Cantidad de Equipos *</Label>
                                      <Input type="number" placeholder="4" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Asignar Equipos</Label>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Selecciona los equipos que participarán
                                        en este grupo
                                      </p>
                                      {/* {equiposCategoria.map((equipo) => (
                                          <div
                                            key={equipo.id}
                                            className="flex items-center space-x-2"
                                          >
                                            <input
                                              type="checkbox"
                                              id={equipo.id}
                                            />
                                            <label
                                              htmlFor={equipo.id}
                                              className="text-sm"
                                            >
                                              {equipo.teamName}
                                            </label>
                                          </div>
                                        ))} */}
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancelar</Button>
                                    <Button>Crear Grupo</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            {true ? (
                              <div className="grid gap-4 md:grid-cols-2">
                                {
                                  <Card key={'grupo-1'}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle>
                                          Grupo (Nombre del grupo)
                                        </CardTitle>
                                        <div className="flex gap-2">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                <Plus className="h-4 w-4" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Crear Partido - Grupo Nombre
                                                  del grupo
                                                </DialogTitle>
                                                <DialogDescription>
                                                  Programa un partido entre
                                                  equipos del grupo
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="space-y-4 py-4">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                  <div className="space-y-2">
                                                    <Label>Equipo 1 *</Label>
                                                    <Select>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {/* {equiposGrupo.map(
                                                              (eg) => (
                                                                <SelectItem
                                                                  key={
                                                                    eg.teamId
                                                                  }
                                                                  value={
                                                                    eg.teamId
                                                                  }
                                                                >
                                                                  {eg.teamName}
                                                                </SelectItem>
                                                              )
                                                            )} */}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label>Equipo 2 *</Label>
                                                    <Select>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {/* {equiposGrupo.map(
                                                              (eg) => (
                                                                <SelectItem
                                                                  key={
                                                                    eg.teamId
                                                                  }
                                                                  value={
                                                                    eg.teamId
                                                                  }
                                                                >
                                                                  {eg.teamName}
                                                                </SelectItem>
                                                              )
                                                            )} */}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                  <div className="space-y-2">
                                                    <Label>Fecha *</Label>
                                                    <Input type="date" />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label>Hora *</Label>
                                                    <Input type="time" />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label>Cancha *</Label>
                                                    <Select>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {/* {canchasDisponibles
                                                              .filter(
                                                                (c) =>
                                                                  c.isAvailable
                                                              )
                                                              .map((cancha) => (
                                                                <SelectItem
                                                                  key={
                                                                    cancha.id
                                                                  }
                                                                  value={
                                                                    cancha.id
                                                                  }
                                                                >
                                                                  {cancha.name}
                                                                </SelectItem>
                                                              ))} */}
                                                      </SelectContent>
                                                    </Select>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex justify-end gap-2">
                                                <Button variant="outline">
                                                  Cancelar
                                                </Button>
                                                <Button>Crear Partido</Button>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                          <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                        </div>
                                      </div>
                                      <CardDescription>
                                        1 equipos • 0 partidos
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {/*Tabla de posiciones */}
                                      <div>
                                        <h5 className="text-sm font-semibold mb-2">
                                          Clasificación
                                        </h5>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="w-8">
                                                #
                                              </TableHead>
                                              <TableHead>Equipo</TableHead>
                                              <TableHead className="text-center">
                                                PJ
                                              </TableHead>
                                              <TableHead className="text-center">
                                                PG
                                              </TableHead>
                                              <TableHead className="text-center">
                                                Pts
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {/* {tablaGrupo.map(
                                                    (team, idx) => (
                                                      <TableRow
                                                        key={team.teamId}
                                                      >
                                                        <TableCell className="font-medium">
                                                          {idx + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                          {team.teamName}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {team.played}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                          {team.won}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold">
                                                          {team.points}
                                                        </TableCell>
                                                      </TableRow>
                                                    )
                                                  )} */}
                                          </TableBody>
                                        </Table>
                                      </div>

                                      {/* Partidos del grupo */}
                                      <div>
                                        <h5 className="text-sm font-semibold mb-2">
                                          Partidos
                                        </h5>
                                        <div className="space-y-2">
                                          {/* {partidosGrupo.map(
                                                  (partido) => (
                                                    <div
                                                      key={partido.id}
                                                      className="flex items-center justify-between p-2 rounded-lg border"
                                                    >
                                                      <div className="text-sm">
                                                        <div className="font-medium">
                                                          {
                                                            partido.teams[0]
                                                              .teamName
                                                          }{' '}
                                                          vs{' '}
                                                          {
                                                            partido.teams[1]
                                                              .teamName
                                                          }
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                          {new Date(
                                                            partido.scheduled
                                                          ).toLocaleDateString(
                                                            'es-ES'
                                                          )}{' '}
                                                          • {partido.courtName}
                                                        </div>
                                                      </div>
                                                      {partido.result ? (
                                                        <Badge variant="outline">
                                                          {partido.result.score}
                                                        </Badge>
                                                      ) : (
                                                        <Badge variant="secondary">
                                                          Programado
                                                        </Badge>
                                                      )}
                                                    </div>
                                                  )
                                                )} */}
                                        </div>
                                      </div>

                                      {/* Botón para generar partidos automáticamente */}

                                      <Button
                                        variant="outline"
                                        className="w-full bg-transparent"
                                        size="sm"
                                      >
                                        <Target className="mr-2 h-4 w-4" />
                                        Generar Partidos Round-Robin
                                      </Button>
                                    </CardContent>
                                  </Card>
                                }
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                No hay grupos creados. Crea grupos para
                                organizar la fase inicial del torneo.
                              </div>
                            )}
                          </div>

                          {/* Fases Eliminatorias */}
                          <div className="space-y-4">
                            <h4 className="font-semibold">
                              Fases Eliminatorias
                            </h4>

                            {/* Cuartos de Final */}
                            {/* {getPartidosPorCategoria(categoria.id, 'QF')
                              .length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Trophy className="h-4 w-4" />
                                  Cuartos de Final
                                </h5>
                                <div className="grid gap-3 md:grid-cols-2">
                                  {getPartidosPorCategoria(
                                    categoria.id,
                                    'QF'
                                  ).map((partido) => (
                                    <Card key={partido.id}>
                                      <CardContent className="p-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">
                                              {partido.teams[0].teamName}
                                            </div>
                                            {partido.result &&
                                              partido.result.winnerId ===
                                                partido.teams[0].teamId && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                              )}
                                          </div>
                                          <div className="text-center text-xs text-muted-foreground">
                                            VS
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">
                                              {partido.teams[1].teamName}
                                            </div>
                                            {partido.result &&
                                              partido.result.winnerId ===
                                                partido.teams[1].teamId && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                              )}
                                          </div>
                                          <div className="pt-2 border-t text-sm text-muted-foreground">
                                            {new Date(
                                              partido.scheduled
                                            ).toLocaleDateString('es-ES')}{' '}
                                            • {partido.courtName}
                                          </div>
                                          {partido.result && (
                                            <Badge
                                              variant="outline"
                                              className="w-full justify-center"
                                            >
                                              {partido.result.score}
                                            </Badge>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )} */}

                            {/* Semifinales */}
                            {/* {getPartidosPorCategoria(categoria.id, 'SF')
                              .length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Trophy className="h-4 w-4" />
                                  Semifinales
                                </h5>
                                <div className="grid gap-3 md:grid-cols-2">
                                  {getPartidosPorCategoria(
                                    categoria.id,
                                    'SF'
                                  ).map((partido) => (
                                    <Card key={partido.id}>
                                      <CardContent className="p-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">
                                              {partido.teams[0].teamName}
                                            </div>
                                            {partido.result &&
                                              partido.result.winnerId ===
                                                partido.teams[0].teamId && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                              )}
                                          </div>
                                          <div className="text-center text-xs text-muted-foreground">
                                            VS
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">
                                              {partido.teams[1].teamName}
                                            </div>
                                            {partido.result &&
                                              partido.result.winnerId ===
                                                partido.teams[1].teamId && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                              )}
                                          </div>
                                          <div className="pt-2 border-t text-sm text-muted-foreground">
                                            {new Date(
                                              partido.scheduled
                                            ).toLocaleDateString('es-ES')}{' '}
                                            • {partido.courtName}
                                          </div>
                                          {partido.result && (
                                            <Badge
                                              variant="outline"
                                              className="w-full justify-center"
                                            >
                                              {partido.result.score}
                                            </Badge>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )} */}

                            {/* Final */}
                            {/* {getPartidosPorCategoria(categoria.id, 'FINAL')
                              .length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Trophy className="h-4 w-4 text-yellow-600" />
                                  Final
                                </h5>
                                {getPartidosPorCategoria(
                                  categoria.id,
                                  'FINAL'
                                ).map((partido) => (
                                  <Card
                                    key={partido.id}
                                    className="border-yellow-200 bg-yellow-50"
                                  >
                                    <CardContent className="p-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="text-lg font-bold">
                                            {partido.teams[0].teamName}
                                          </div>
                                          {partido.result &&
                                            partido.result.winnerId ===
                                              partido.teams[0].teamId && (
                                              <Trophy className="h-6 w-6 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="text-center font-semibold">
                                          VS
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="text-lg font-bold">
                                            {partido.teams[1].teamName}
                                          </div>
                                          {partido.result &&
                                            partido.result.winnerId ===
                                              partido.teams[1].teamId && (
                                              <Trophy className="h-6 w-6 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="pt-3 border-t text-sm text-muted-foreground text-center">
                                          {new Date(
                                            partido.scheduled
                                          ).toLocaleDateString('es-ES')}{' '}
                                          • {partido.courtName}
                                        </div>
                                        {partido.result && (
                                          <Badge
                                            variant="default"
                                            className="w-full justify-center py-2"
                                          >
                                            {partido.result.score}
                                          </Badge>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )} */}

                            {/* Botón para crear partidos eliminatorios */}
                            {/* {categoria.hasGroups &&
                              gruposCategoria.length > 0 && (
                                <Button
                                  variant="outline"
                                  className="w-full bg-transparent"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Crear Partidos Eliminatorios
                                </Button>
                              )} */}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partidos Tab */}
        <TabsContent value="partidos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de Partidos</CardTitle>
                  <CardDescription>
                    Programa partidos entre equipos inscritos
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Partido
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Partido</DialogTitle>
                      <DialogDescription>
                        Programa un partido entre equipos inscritos
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Categoría *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cat-1">
                              Individual Masculino
                            </SelectItem>
                            <SelectItem value="cat-2">
                              Individual Femenino
                            </SelectItem>
                            <SelectItem value="cat-3">
                              Dobles Masculino
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Equipo 1 *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona equipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {equiposInscritos
                                .filter((e) => e.inscriptionStatus === 'paid')
                                .map((equipo) => (
                                  <SelectItem key={equipo.id} value={equipo.id}>
                                    {equipo.teamName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Equipo 2 *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona equipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {equiposInscritos
                                .filter((e) => e.inscriptionStatus === 'paid')
                                .map((equipo) => (
                                  <SelectItem key={equipo.id} value={equipo.id}>
                                    {equipo.teamName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Fecha *</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Hora *</Label>
                          <Input type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label>Cancha *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              {canchasDisponibles.map((cancha) => (
                                <SelectItem key={cancha.id} value={cancha.id}>
                                  {cancha.name}{' '}
                                  {cancha.isIndoor ? '(Indoor)' : '(Outdoor)'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Fase del Torneo *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona fase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Group">
                              Fase de Grupos
                            </SelectItem>
                            <SelectItem value="QF">Cuartos de Final</SelectItem>
                            <SelectItem value="SF">Semifinal</SelectItem>
                            <SelectItem value="FINAL">Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button>Crear Partido</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Ronda</TableHead>
                    <TableHead>Equipos</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partidos.map((partido) => (
                    <TableRow key={partido.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(partido.scheduled).toLocaleDateString(
                              'es-ES'
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(partido.scheduled).toLocaleTimeString(
                              'es-ES',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{partido.courtName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getRoundLabel(partido.round)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{partido.team1Name}</div>
                          <div className="text-muted-foreground">vs</div>
                          <div>{partido.team2Name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {partido.result ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {partido.result.score}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Ganador: Equipo {partido.result.winner}
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            partido.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {partido.status === 'completed'
                            ? 'Completado'
                            : 'Programado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inscritos Tab */}
        <TabsContent value="inscritos" className="space-y-4">
          <TournamentInscriptionTab
            categories={categories}
            teamsInscribed={teamsInscribed}
            tournament={
              tournament ? { id: tournament.id, slug: tournament.slug } : null
            }
          />
        </TabsContent>

        {/* Clasificación Tab */}
        <TabsContent value="clasificacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clasificación Actual</CardTitle>
              <CardDescription>
                Rankings y posiciones de los participantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                La clasificación se actualizará automáticamente conforme se
                completen los partidos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <InformationForm
            information={tournament}
            slug={slug}
            updateTournament={updateTournament}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
