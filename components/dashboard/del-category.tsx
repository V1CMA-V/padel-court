import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'

export default async function DelCategory({
  categoryId,
}: {
  categoryId: string
}) {
  async function handleDelete(formData: FormData) {
    'use server'
    const categoryId = formData.get('categoryId') as string

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })
    revalidatePath(`/dashboard/tournament/${categoryId}`)
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="categoryId" value={categoryId} />
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar Categoría
      </Button>
    </form>
  )
}
