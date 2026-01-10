import CategoriesTournaments from '@/components/public/categories-tournaments'
import ClasificationTournaments from '@/components/public/clasification-tournaments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import Footer from '@/sections/Footer'
import Navbar from '@/sections/navbar'
import {
  Calendar,
  Clock,
  DollarSign,
  Info,
  Map,
  MapPin,
  Trophy,
  Users,
} from 'lucide-react'
import Link from 'next/link'

type ScheduleItem = {
  id: string
  date: string
  event: string
  time: string
}

async function getData(slug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      club: {
        select: {
          name: true,
          id: true,
          email: true,
          phoneNumber: true,
        },
      },
      name: true,
      description: true,
      startDate: true,
      endDate: true,
      status: true,
      capacity: true,
      registrationFee: true,
      format: true,
      rules: true,
      prize1st: true,
      prize2nd: true,
      prize3rd: true,
    },
  })

  const location = await prisma.location.findFirst({
    where: {
      clubId: tournament?.club?.id,
    },
    select: {
      address: true,
      state: true,
      country: true,
      googleMapsUrl: true,
    },
  })

  const teamsInscribed = await prisma.teamEnrollment.count({
    where: {
      tournamentId: tournament?.id,
    },
  })

  const schedule = await prisma.scheduled.findMany({
    where: {
      tournamentId: tournament?.id,
    },

    select: {
      id: true,
      date: true,
      event: true,
      time: true,
    },
  })

  return { tournament, location, teamsInscribed, schedule }
}

export default async function TournamentDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  console.log('Slug del torneo:', slug)

  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  const { tournament, location, teamsInscribed, schedule } = await getData(slug)

  console.log('Torneo:', data)
  console.log('Ubicación:', location)
  console.log('Equipos Inscritos:', teamsInscribed)

  // Mock data - en producción vendría de una base de datos
  const torneo = {
    id: '1',
    name: 'Copa de Primavera 2025',
    sport: 'Tenis',
    startDate: '2025-04-15',
    endDate: '2025-04-20',
    clubId: 'club-1',
    clubName: 'Club Deportivo Central',
    clubLocation: 'Calle del Deporte 123, Madrid, España',
    image: '/tennis-court-professional-tournament.jpg',
    status: 'active',
    description:
      'El torneo más esperado de la primavera vuelve en su décima edición. Compite con los mejores jugadores de la región en canchas de superficie dura de primera calidad.',
  }

  // Categorías del torneo (tabla Category)
  const categories = [
    {
      id: 'cat-1',
      name: 'Individual Masculino',
      description: 'Categoria individual para hombres',
      teams: 20,
      maxTeams: 32,
      price: 45,
    },
    {
      id: 'cat-2',
      name: 'Individual Femenino',
      description: 'Categoria individual para mujeres',
      teams: 12,
      maxTeams: 32,
      price: 45,
    },
    {
      id: 'cat-3',
      name: 'Dobles Masculino',
      description: 'Parejas masculinas',
      teams: 8,
      maxTeams: 16,
      price: 60,
    },
    {
      id: 'cat-4',
      name: 'Dobles Femenino',
      description: 'Parejas femeninas',
      teams: 6,
      maxTeams: 16,
      price: 60,
    },
  ]

  // Premios por categoría (CategoryResult)
  const prizes = [
    { position: 1, prize: '1.500€ + Trofeo' },
    { position: 2, prize: '800€ + Medalla' },
    { position: 3, prize: '400€ + Medalla' },
  ]

  // Cronograma del torneo
  const schedule2 = [
    { date: 'Abril 15', event: 'Ceremonia de Apertura', time: '09:00' },
    {
      date: 'Abril 15-16',
      event: 'Primera Ronda (Round of 32)',
      time: '10:00 - 20:00',
    },
    {
      date: 'Abril 17-18',
      event: 'Cuartos de Final (QF)',
      time: '10:00 - 18:00',
    },
    { date: 'Abril 19', event: 'Semifinales (SF)', time: '10:00 - 16:00' },
    { date: 'Abril 20', event: 'Final', time: '16:00' },
  ]

  const rules = [
    'Todos los partidos se juegan al mejor de 3 sets',
    'Tie-break a 7 puntos en todos los sets',
    'Los equipos deben llegar 15 minutos antes de su partido',
    'Vestimenta deportiva apropiada obligatoria',
  ]

  // Clasificación por equipos (teams con CategoryResult)
  const clasificacion = [
    {
      position: 1,
      teamName: 'Carlos Martínez',
      categoryName: 'Individual M',
      points: 125,
      matchesWon: 5,
      matchesLost: 0,
    },
    {
      position: 2,
      teamName: 'Ana García',
      categoryName: 'Individual F',
      points: 118,
      matchesWon: 5,
      matchesLost: 0,
    },
    {
      position: 3,
      teamName: 'Pedro S. / Luis G.',
      categoryName: 'Dobles M',
      points: 112,
      matchesWon: 4,
      matchesLost: 1,
    },
    {
      position: 4,
      teamName: 'Laura F. / Carmen L.',
      categoryName: 'Dobles F',
      points: 105,
      matchesWon: 4,
      matchesLost: 1,
    },
    {
      position: 5,
      teamName: 'Miguel Torres',
      categoryName: 'Individual M',
      points: 98,
      matchesWon: 4,
      matchesLost: 1,
    },
  ]

  // Próximos partidos (tabla Match con MatchPlayer y Court)
  const proximosPartidos = [
    {
      id: 'match-1',
      scheduled: '2025-04-16T10:00:00',
      round: 'QF',
      courtName: 'Pista 1 Central',
      categoryName: 'Individual M',
      team1: 'Carlos Martínez',
      team2: 'Pedro Sánchez',
      courtIsIndoor: false,
    },
    {
      id: 'match-2',
      scheduled: '2025-04-16T11:30:00',
      round: 'QF',
      courtName: 'Pista 2',
      categoryName: 'Individual F',
      team1: 'Ana García',
      team2: 'Laura Fernández',
      courtIsIndoor: true,
    },
    {
      id: 'match-3',
      scheduled: '2025-04-16T13:00:00',
      round: 'SF',
      courtName: 'Pista 1 Central',
      categoryName: 'Dobles M',
      team1: 'Miguel T. / Juan R.',
      team2: 'Carlos M. / Luis G.',
      courtIsIndoor: false,
    },
  ]

  const getRoundLabel = (round: string) => {
    const labels: Record<string, string> = {
      Group: 'Fase de Grupos',
      QF: 'Cuartos de Final',
      SF: 'Semifinal',
      FINAL: 'Final',
    }
    return labels[round] || round
  }

  const dictionaryStatus: Record<string, string> = {
    OPEN: 'Inscripciones Abiertas',
    ONGOING: 'En Curso',
    FINISHED: 'Finalizado',
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden md:h-96">
        <img
          src={torneo.image || '/placeholder.svg'}
          alt={torneo.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Badge className="mb-2">
              {
                dictionaryStatus[
                  tournament?.status as keyof typeof dictionaryStatus
                ]
              }
            </Badge>
            <h1 className="text-balance text-3xl font-bold text-white md:text-5xl">
              {tournament?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList
                className={`grid w-full ${
                  tournament?.status === 'FINISHED'
                    ? 'grid-cols-4'
                    : 'grid-cols-3'
                }`}
              >
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="calendar">Calendario</TabsTrigger>
                {tournament?.status === 'FINISHED' && (
                  <TabsTrigger value="classification">
                    Clasificación
                  </TabsTrigger>
                )}
                <TabsTrigger value="prizes">Premios</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre el Torneo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {tournament?.description ||
                        'Descripción no disponible para este torneo.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categorías Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tournament?.id && (
                      <CategoriesTournaments
                        tournamentId={tournament.id}
                        price={tournament.registrationFee}
                        status={tournament.status}
                        capacity={tournament.capacity || 0}
                        userId={data?.claims.sub || ''}
                        userName={data?.claims.user_metadata?.userName || ''}
                        tournamentSlug={slug}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reglas del Torneo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tournament?.rules ? (
                        <li className="flex items-start">
                          <Info className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {tournament?.rules}
                          </span>
                        </li>
                      ) : (
                        <li className="text-sm text-muted-foreground">
                          No hay reglas específicas para este torneo.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cronograma del Torneo</CardTitle>
                    <CardDescription>
                      Fechas y horarios de cada fase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schedule.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 rounded-lg border border-border p-4"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.event}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="mt-1 flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Partidos</CardTitle>
                    <CardDescription>
                      Programación de partidos próximos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {proximosPartidos.map((partido) => (
                        <div
                          key={partido.id}
                          className="rounded-lg border border-border p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {partido.courtName}
                              </Badge>
                              {partido.courtIsIndoor && (
                                <Badge variant="secondary" className="text-xs">
                                  Indoor
                                </Badge>
                              )}
                            </div>
                            <Badge>{getRoundLabel(partido.round)}</Badge>
                          </div>
                          <div className="mb-2 text-sm text-muted-foreground">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {new Date(partido.scheduled).toLocaleString(
                              'es-ES',
                              {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{partido.team1}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-medium">{partido.team2}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {partido.categoryName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classification" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clasificación Actual</CardTitle>
                    <CardDescription>Top equipos por categoría</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <ClasificationTournaments />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prizes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Premios y Reconocimientos</CardTitle>
                    <CardDescription>
                      Distribución de premios por posición en cada categoría
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Trophy className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">1º Puesto</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {tournament?.prize1st}
                        </p>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Trophy className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">2º Puesto</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {tournament?.prize2nd}
                        </p>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Trophy className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">3º Puesto</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {tournament?.prize3rd}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Torneo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fecha
                  </div>
                  <p className="font-medium">
                    {tournament?.startDate && tournament?.endDate
                      ? `${new Date(tournament.startDate).toLocaleDateString(
                          'es-ES'
                        )} - ${new Date(tournament.endDate).toLocaleDateString(
                          'es-ES'
                        )}`
                      : 'Fechas no disponibles'}
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    Ubicación
                  </div>
                  <Link href={location?.googleMapsUrl || '#'} target="_blank">
                    <p className="font-medium flex items-center gap-3">
                      {tournament?.club?.name}{' '}
                      <Map className="inline-block h-4 w-4" />
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {location
                      ? `${location.address}, ${location.state}, ${location.country}`
                      : 'Ubicación no disponible'}
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Equipos Inscritos
                  </div>
                  <p className="font-medium">
                    {teamsInscribed} equipos totales
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Costo de Inscripción
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Desde ${tournament?.registrationFee} por equipo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle>Inscríbete con tu Equipo</CardTitle>
                <CardDescription>
                  Regístrate en una categoría disponible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  Crear Equipo e Inscribirse
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Pago seguro procesado con Stripe
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto del Organizador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Club:</span>{' '}
                  {tournament?.club?.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  <a
                    href={`mailto:${tournament?.club?.email}`}
                    className="text-primary hover:underline"
                  >
                    {tournament?.club?.email}
                  </a>
                </p>

                {tournament?.club?.phoneNumber && (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Teléfono:</span>{' '}
                      <a
                        href={`tel:${tournament?.club?.phoneNumber}`}
                        className="text-primary hover:underline"
                      >
                        {tournament?.club?.phoneNumber}
                      </a>
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full bg-transparent"
                    >
                      Enviar Mensaje
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
