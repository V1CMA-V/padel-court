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
