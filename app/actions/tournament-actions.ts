'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteTournament(formData: FormData) {
  const tournamentId = formData.get('tournamentId') as string

  await prisma.tournament.delete({
    where: {
      id: tournamentId,
    },
  })

  revalidatePath('/dashboard/tournament')
}

export async function updateTournament(formData: FormData) {
  const tournamentId = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const capacity = formData.get('capacity')
    ? parseInt(formData.get('capacity') as string)
    : null
  const registrationFee = parseFloat(formData.get('registrationFee') as string)
  const format = (formData.get('format') as string) || null
  const rules = (formData.get('rules') as string) || null
  const prize1st = (formData.get('prize1st') as string) || null
  const prize2nd = (formData.get('prize2nd') as string) || null
  const prize3rd = (formData.get('prize3rd') as string) || null
  const status = formData.get('status') as
    | 'DRAFT'
    | 'OPEN'
    | 'ONGOING'
    | 'FINISHED'
    | 'CANCELED'
  const startDate = new Date(formData.get('startDate') as string)
  const endDate = new Date(formData.get('endDate') as string)

  const slug = formData.get('slug') as string

  await prisma.tournament.update({
    where: {
      id: tournamentId,
    },
    data: {
      name,
      description,
      capacity,
      registrationFee,
      format,
      rules,
      prize1st,
      prize2nd,
      prize3rd,
      status,
      startDate,
      endDate,
    },
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}
