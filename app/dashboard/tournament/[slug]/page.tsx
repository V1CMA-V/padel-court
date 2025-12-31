import { updateTournament } from '@/app/actions/tournament-actions'
import InformationForm from '@/components/information-form'
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
import prisma from '@/lib/prisma'
import { CalendarIcon, Edit, Plus, Trash2, Trophy, Users } from 'lucide-react'

async function getData(tournamentSlug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      id: true,
      name: true,
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
      createdAt: true,

      category: {
        select: {
          name: true,
        },
      },

      teamId: true,
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
      name: true,
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

  console.log('Tournament: ', tournament)
  console.log('Teams Inscribed: ', teamsInscribed)
  console.log('Matches: ', matches)
  console.log('Categories: ', categories)

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
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
          <TabsTrigger value="inscritos">Inscritos</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

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
          <Card>
            <CardHeader>
              <CardTitle>Equipos Inscritos</CardTitle>
              <CardDescription>
                Gestiona las inscripciones de equipos al torneo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Jugadores</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha Inscripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equiposInscritos.map((equipo) => (
                    <TableRow key={equipo.id}>
                      <TableCell className="font-medium">
                        {equipo.teamName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {equipo.players.map((player, idx) => (
                            <div key={idx}>{player.name}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{equipo.categoryName}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(equipo.inscriptionDate).toLocaleDateString(
                          'es-ES'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            equipo.inscriptionStatus === 'paid'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {equipo.inscriptionStatus === 'paid'
                            ? 'Pagado'
                            : 'Pendiente'}
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
