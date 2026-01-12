'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'
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

interface EditCategoryProps {
  category: {
    id: string
    name: string
    description: string | null
    prize1st: string | null
    prize2nd: string | null
    prize3rd: string | null
  }
  slug: string
  updateCategory: (formData: FormData) => Promise<void>
}

export default function EditCategory({
  category,
  slug,
  updateCategory,
}: EditCategoryProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    await updateCategory(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>
            Modifica la información de la categoría
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="slug" value={slug} />
          <div className="space-y-2">
            <Label>
              Nombre de la Categoría{' '}
              <span className="font-bold text-primary">*</span>
            </Label>
            <Input
              name="name"
              placeholder="ej. Individual Masculino"
              defaultValue={category.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              name="description"
              placeholder="Breve descripción de la categoría"
              defaultValue={category.description || ''}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Premio 1er Lugar</Label>
              <Input
                name="prize1st"
                placeholder="ej. Trofeo + $500"
                defaultValue={category.prize1st || ''}
              />
            </div>
            <div className="space-y-2">
              <Label>Premio 2do Lugar</Label>
              <Input
                name="prize2nd"
                placeholder="ej. Medalla + $300"
                defaultValue={category.prize2nd || ''}
              />
            </div>
            <div className="space-y-2">
              <Label>Premio 3er Lugar</Label>
              <Input
                name="prize3rd"
                placeholder="ej. Medalla + $150"
                defaultValue={category.prize3rd || ''}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
