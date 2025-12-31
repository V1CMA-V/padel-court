import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CourtDialogs } from './court-dialogs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

async function getData(ClubId: string) {
  const data = await prisma.court.findMany({
    where: {
      clubId: ClubId,
    },
    select: {
      id: true,
      name: true,
      isIndoor: true,
      isAvailable: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return data
}

export default async function CourtsForm({ clubId }: { clubId: string }) {
  const courts = await getData(clubId)

  async function handleAddCourt(formData: FormData) {
    'use server'

    const courtName = formData.get('courtName') as string
    const isIndoor = formData.get('isIndoor') === 'true'
    const isAvailable = formData.get('isAvailable') === 'on'

    await prisma.court.create({
      data: {
        name: courtName,
        isIndoor: isIndoor,
        isAvailable: isAvailable,
        clubId: clubId,
      },
    })

    revalidatePath('/dashboard/club')
  }

  async function handleEditCourt(formData: FormData) {
    'use server'
    const courtId = formData.get('courtId') as string
    const courtName = formData.get('courtName') as string
    const isIndoor = formData.get('isIndoor') === 'true'
    const isAvailable = formData.get('isAvailable') === 'on'

    await prisma.court.update({
      where: {
        id: courtId,
      },
      data: {
        name: courtName,
        isIndoor: isIndoor,
        isAvailable: isAvailable,
      },
    })

    revalidatePath('/dashboard/club')
  }

  async function handleDeleteCourt(courtId: string) {
    'use server'

    await prisma.court.delete({
      where: {
        id: courtId,
      },
    })

    revalidatePath('/dashboard/club')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instalaciones</CardTitle>
        <CardDescription>
          Administra las canchas disponibles en tu club
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CourtDialogs
          courts={courts}
          handleAddCourt={handleAddCourt}
          handleEditCourt={handleEditCourt}
          handleDeleteCourt={handleDeleteCourt}
        />
      </CardContent>
    </Card>
  )
}
