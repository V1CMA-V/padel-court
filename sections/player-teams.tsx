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

export default function PlayersTeams({ userId }: { userId?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Equipos</CardTitle>
        <CardDescription>
          Aqui podras ver y administrar tus equipos para jugar e inscribir a
          torneos.{' '}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Numero de equipos: 1</p>
        <Card className="w-full max-w-150">
          <CardHeader>
            <CardTitle>Equipo Padel Masters</CardTitle>
            <CardDescription>Creado el: 01/03/2024</CardDescription>
          </CardHeader>

          <CardContent className="flex gap-4 items-center justify-between">
            <div className="flex flex-col border p-2 rounded-md gap-2 h-full">
              <h3 className="text-lg ">Miembros:</h3>
              <ul className="list-disc list-inside">
                <li>Juan Perez</li>
                <li>Maria Gomez</li>
              </ul>
            </div>

            <div className="flex flex-col border p-2 rounded-md gap-2 h-full">
              <h3 className="text-lg ">Torneos inscritos:</h3>
              <ul className="list-disc list-inside">
                <li>
                  <Link href="#">Torneo Primavera 2024</Link>
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between w-full">
            <Button>Administrar Equipo</Button>
            <Button variant="destructive">Eliminar Equipo</Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}
