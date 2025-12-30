import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function TournamentPrincipalSection() {
  return (
    <section className="max-w-300 mx-auto px-4 py-16 flex flex-col">
      <h2 className="text-3xl font-semibold mb-4 text-center">
        Torneos Próximos
      </h2>
      <p className="text-lg leading-7 text-muted-foreground text-center">
        Estos son los próximos torneos disponibles para que te inscribas y
        participes.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Torneo de Primavera 2024</CardTitle>
            <CardDescription>Fecha: 15 de Marzo de 2024</CardDescription>
          </CardHeader>

          <CardContent>
            Únete a nuestro emocionante Torneo de Primavera 2024 y demuestra tus
            habilidades en la cancha. ¡Inscríbete ahora y compite por increíbles
            premios!
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <Button>
              <Link href="/tournaments/primavera-2024">Inscribirse</Link>
            </Button>

            <Button asChild variant="outline" className="ml-4">
              <Link href="/tournaments/primavera-2024/details">
                Más Detalles
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Torneo de Primavera 2024</CardTitle>
            <CardDescription>Fecha: 15 de Marzo de 2024</CardDescription>
          </CardHeader>

          <CardContent>
            Únete a nuestro emocionante Torneo de Primavera 2024 y demuestra tus
            habilidades en la cancha. ¡Inscríbete ahora y compite por increíbles
            premios!
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <Button>
              <Link href="/tournaments/primavera-2024">Inscribirse</Link>
            </Button>

            <Button asChild variant="outline" className="ml-4">
              <Link href="/tournaments/primavera-2024/details">
                Más Detalles
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Torneo de Primavera 2024</CardTitle>
            <CardDescription>
              <p>Fecha: 15 de Marzo de 2024</p>
              <p>Club: Pro Master</p>
            </CardDescription>
          </CardHeader>

          <CardContent>
            Únete a nuestro emocionante Torneo de Primavera 2024 y demuestra tus
            habilidades en la cancha. ¡Inscríbete ahora y compite por increíbles
            premios!
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <Button>
              <Link href="/tournaments/primavera-2024">Inscribirse</Link>
            </Button>

            <Button asChild variant="outline" className="ml-4">
              <Link href="/tournaments/primavera-2024/details">
                Más Detalles
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-row justify-end items-end mt-6 gap-4">
        <Button className="" asChild variant={'outline'}>
          <Link href="/dashboard/new/tournament">Crea un Torneo</Link>
        </Button>

        <Button className="" asChild>
          <Link href="/tournaments">Ver Todos los Torneos</Link>
        </Button>
      </div>
    </section>
  )
}
