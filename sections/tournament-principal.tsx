import { ArrowRight, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import prisma from '@/lib/prisma'

async function getTournaments() {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: 'OPEN',
    },
    take: 3,
    select: {
      slug: true,
      name: true,
      startDate: true,
      club: {
        select: {
          name: true,
        },
      },
      capacity: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return tournaments
}

export default async function TournamentPrincipalSection() {
  const tournaments = await getTournaments()

  console.log('TOURNAMENTS PRINCIPAL:', tournaments)

  return (
    <section id="torneos" className="max-w-350 mx-auto w-full py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Torneos Destacados</h2>
            <p className="mt-2 text-muted-foreground">
              Explora los torneos activos y próximos
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/tournament">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.length === 0 && (
            <Card className="">
              <CardHeader>
                <CardTitle className="text-xl">
                  No hay torneos destacados disponibles
                </CardTitle>
                <CardDescription>
                  <p>
                    Actualmente no hay torneos destacados abiertos para mostrar.
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Si deseas crear un torneo visita nuestros planes que tenemos
                  para ti y comienza hoy mismo.
                </p>
                <p className="text-muted-foreground">
                  Si quieres que tu torneo se muestre en la pagina principal
                  debes asegurarte de que esté abierto y cumpla con nuestros
                  criterios de selección.
                </p>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href="/plans">Ver Planes</Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {tournaments &&
            tournaments.map((tournament, i) => (
              <Card
                key={i}
                className="group overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* <img
                  src={tournament. || '/placeholder.svg'}
                  alt={tournament.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                /> */}
                  <div className="absolute right-4 top-4">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      {tournament.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">Padel</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {tournament.capacity}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-2 flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      {tournament.startDate.toLocaleDateString('es-ES')}
                    </div>
                    <div className="mt-1 text-sm">{tournament.club.name}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/tournament/${tournament.slug}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
