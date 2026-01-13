import { Button } from '@/components/ui/button'
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
import prisma from '@/lib/prisma'
import { Plus, Trophy } from 'lucide-react'
import { revalidatePath } from 'next/cache'

interface CreateGroupDialogProps {
  categoryId: string
  teamsCount: number
  existingGroupsCount: number
}

interface Recommendation {
  groups: number
  teamsPerGroup: number
  remainder: number
  description: string
}

export default async function CreateGroupDialog({
  categoryId,
  teamsCount,
  existingGroupsCount,
}: CreateGroupDialogProps) {
  // Calcular recomendaciones
  const recommendations: Recommendation[] = []
  for (
    let groupCount = 2;
    groupCount <= Math.min(4, teamsCount);
    groupCount++
  ) {
    const teamsPerGroup = Math.floor(teamsCount / groupCount)
    const remainder = teamsCount % groupCount

    if (teamsPerGroup >= 3) {
      recommendations.push({
        groups: groupCount,
        teamsPerGroup,
        remainder,
        description:
          remainder === 0
            ? `${groupCount} grupos de ${teamsPerGroup} equipos`
            : `${groupCount} grupos: ${
                groupCount - remainder
              } de ${teamsPerGroup} equipos y ${remainder} de ${
                teamsPerGroup + 1
              } equipos`,
      })
    }
  }

  // Generar nombre de grupo automático (A, B, C, etc.)
  const getNextGroupName = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return letters[existingGroupsCount] || `Grupo ${existingGroupsCount + 1}`
  }

  const applyRecommendation = (rec: Recommendation) => {
    // Calcular equipos para este grupo específico
    const nextGroupIndex = existingGroupsCount
    let teamsForThisGroup = rec.teamsPerGroup

    // Si hay remainder, los primeros grupos tienen un equipo extra
    if (nextGroupIndex < rec.remainder) {
      teamsForThisGroup = rec.teamsPerGroup + 1
    }

    // setGroupName(getNextGroupName())
    // setTeamCount(teamsForThisGroup.toString())
  }

  async function handleSubmit(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const teamCount = parseInt(formData.get('teamCount') as string)
    const categoryId = formData.get('categoryId') as string

    await prisma.categoryGroup.create({
      data: {
        name,
        categoryId,
        teamCount,
      },
    })

    revalidatePath('/dashboard/tournament')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Grupo</DialogTitle>
          <DialogDescription>
            Crea un grupo para la fase de grupos de esta categoría
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <input type="hidden" name="categoryId" value={categoryId} />

          {/* Recomendaciones */}
          {teamsCount === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                No hay equipos inscritos para crear grupos
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">
                  Equipos inscritos: {teamsCount}
                </p>
              </div>
              {recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-blue-800">
                    Recomendaciones:
                  </p>
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white rounded-lg p-2 border border-blue-200"
                    >
                      <div className="text-xs text-blue-700">
                        • {rec.description}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      >
                        Aplicar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-blue-600">
                Los equipos se distribuirán automáticamente de forma equitativa
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Nombre del Grupo *</Label>
            <Input name="name" placeholder="A, B, C..." required />
          </div>

          <div className="space-y-2">
            <Label>Cantidad de equipos en este grupo *</Label>
            <Input
              name="teamCount"
              type="number"
              min="3"
              max={teamsCount}
              placeholder="Ej: 4"
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 3 equipos por grupo
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Crear Grupo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
