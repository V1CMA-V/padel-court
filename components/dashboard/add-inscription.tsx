import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import prisma from '@/lib/prisma'
import { SelectValue } from '@radix-ui/react-select'
import { revalidatePath } from 'next/cache'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '../ui/select'

export function AddInscription({
  categories,
  tournament,
}: {
  categories: { id: string; name: string }[]
  tournament: {
    id: string
    slug: string
  }
}) {
  console.log('Categoria: ', categories)

  async function handleSubmit(formData: FormData) {
    'use server'
    const ownerName = formData.get('ownerName') as string
    const teammateName = formData.get('teammateName') as string
    const categoryId = formData.get('categoryId') as string

    console.log({ ownerName, teammateName, categoryId })

    const team = await prisma.team.create({
      data: {
        ownerName,
        teammateName,
      },
    })

    await prisma.teamEnrollment.create({
      data: {
        teamId: team.id,
        categoryId,
        status: 'APPROVED',
        tournamentId: tournament.id,
      },
    })

    revalidatePath(`/dashboard/tournament/${tournament.slug}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className="mr-4">
          Agregar Inscripción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Inscripción</DialogTitle>
          <DialogDescription>
            Agrega a un equipo al torneo manualmante (Si se inscribio en el club
            o tiene alguna preferencia especial)
          </DialogDescription>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="flex flex-col items-center gap-3"
        >
          <div className="space-y-2 w-full">
            <Label htmlFor="ownerName" className="sr-only">
              Nombre del lider del equipo
            </Label>
            <Input
              id="ownerName"
              name="ownerName"
              placeholder="Nombre Apellido"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="teammateName" className="sr-only">
              Nombre del compañero
            </Label>
            <Input
              id="teammateName"
              name="teammateName"
              placeholder="Nombre Apellido"
            />
          </div>

          <Select name="categoryId">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorías Disponibles</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full mt-4">
            Agregar Inscripción
          </Button>
        </form>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
