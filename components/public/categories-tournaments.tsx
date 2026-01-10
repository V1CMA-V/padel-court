import prisma from '@/lib/prisma'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'

async function getData(tournamentId: string) {
  const categories = await prisma.category.findMany({
    where: { tournamentId },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  const totalTeams = await prisma.teamEnrollment.findMany({
    where: {
      categoryId: { in: categories.map((c) => c.id) },
    },

    select: {
      status: true,
    },
  })

  return { categories, totalTeams }
}

export default async function CategoriesTournaments({
  tournamentId,
  tournamentSlug,
  price,
  status,
  capacity,
  userId,
  userName,
}: {
  tournamentId: string
  tournamentSlug: string
  price: number
  status?: string
  capacity?: number
  userId?: string
  userName?: string
}) {
  const { categories, totalTeams } = await getData(tournamentId)

  // TODO: Implementar logica con stripe para el pago de inscripciones
  // Por lo mientras sera un boton de inscripcion manual

  async function handleEnroll(formData: FormData) {
    'use server'

    const teammateName = formData.get('teammateName') as string
    const categoryId = formData.get('categoryId') as string
    const categoryName = formData.get('categoryName') as string

    if (!userId) {
      redirect('/login')
    }

    const team = await prisma.team.create({
      data: {
        ownerId: userId as string,
        teammateName: teammateName,
        ownerName: userName || 'Sin nombre',
      },
    })

    await prisma.teamEnrollment.create({
      data: {
        teamId: team.id,
        categoryId: categoryId,
        tournamentId: tournamentId,
        status: 'PAID',
      },
    })

    redirect(`/tournament/${tournamentSlug}/${categoryName}`)
  }

  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between rounded-lg border border-border p-4"
        >
          <div className="flex-1">
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {totalTeams.length}/{capacity} equipos
              </span>
              <span className="font-semibold text-primary">
                ${price} por equipo
              </span>
            </div>
          </div>

          {status !== 'OPEN' ? (
            <>
              <Button disabled>Inscripciones Cerradas</Button>
              <Button variant="outline" disabled>
                <Link href={`/tournament/${tournamentId}/${category.id}`}>
                  Ver Detalles
                </Link>
              </Button>
            </>
          ) : !userId ? (
            <Button variant={'outline'} asChild>
              <Link href="/login">Iniciar sesión para inscribirse</Link>
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'outline'}>Inscribirse</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea tu equipo</DialogTitle>
                  <DialogDescription>
                    Para inscribirte en la categoria {category.name}, primero
                    debes crear un equipo. Debes agregar el nombre de tu equipo
                    (Despues podras agregar el perfil real de los jugadores).
                  </DialogDescription>
                </DialogHeader>

                <form action={handleEnroll} className="space-y-4">
                  <Input
                    name="teammateName"
                    placeholder="Nombre del equipo"
                    type="text"
                    required
                  />
                  <Input name="categoryId" type="hidden" value={category.id} />
                  <Input
                    name="categoryName"
                    type="hidden"
                    value={category.name}
                  />
                  <Button type="submit">Confirm</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ))}
    </>
  )
}
