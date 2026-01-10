import prisma from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { revalidatePath } from 'next/cache'

export default async function AddCategory({
  tournamentId,
  slug,
}: {
  tournamentId: string
  slug: string
}) {
  async function handleSumbit(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const prize1st = formData.get('prize1st') as string
    const prize2nd = formData.get('prize2nd') as string
    const prize3rd = formData.get('prize3rd') as string

    console.log({
      name,
      description,
      prize1st,
      prize2nd,
      prize3rd,
    })

    await prisma.category.create({
      data: {
        name,
        description,
        prize1st,
        prize2nd,
        prize3rd,
        tournamentId: tournamentId,
      },
    })

    revalidatePath(`/dashboard/tournament/${tournamentId}`)
  }

  return (
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
            Añade una nueva categoría al torneo
          </DialogDescription>
        </DialogHeader>
        <form action={handleSumbit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Nombre de la Categoría{' '}
              <span className="font-bold text-primary">*</span>
            </Label>
            <Input name="name" placeholder="ej. Individual Masculino" />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              name="description"
              placeholder="Breve descripción de la categoría"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Premio 1er Lugar</Label>
              <Input name="prize1st" placeholder="ej. Trofeo + $500" />
            </div>
            <div className="space-y-2">
              <Label>Premio 2do Lugar</Label>
              <Input name="prize2nd" placeholder="ej. Medalla + $300" />
            </div>
            <div className="space-y-2">
              <Label>Premio 3er Lugar</Label>
              <Input name="prize3rd" placeholder="ej. Medalla + $150" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Crear Categoría</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
