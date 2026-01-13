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

export async function updateCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const name = formData.get('name') as string
  const description = (formData.get('description') as string) || null
  const prize1st = (formData.get('prize1st') as string) || null
  const prize2nd = (formData.get('prize2nd') as string) || null
  const prize3rd = (formData.get('prize3rd') as string) || null
  const slug = formData.get('slug') as string

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
      description,
      prize1st,
      prize2nd,
      prize3rd,
    },
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}

export async function addPlayerGroup(formData: FormData) {
  const groupId = formData.get('groupId') as string
  const teamId = formData.get('teamId') as string
  const slug = formData.get('slug') as string

  await prisma.groupTeam.create({
    data: {
      groupId,
      teamId,
    },
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}

export async function addRandomPlayersToGroup(formData: FormData) {
  const groupId = formData.get('groupId') as string
  const categoryId = formData.get('categoryId') as string
  const count = parseInt(formData.get('count') as string)
  const slug = formData.get('slug') as string

  // Obtener todos los equipos ya asignados a grupos en esta categoría
  const teamsInGroups = await prisma.groupTeam.findMany({
    where: {
      group: {
        categoryId,
      },
    },
    select: {
      teamId: true,
    },
  })

  const teamIdsInGroups = teamsInGroups.map((gt) => gt.teamId)

  // Obtener equipos disponibles (pagados, activos, sin grupo)
  const availableTeams = await prisma.teamEnrollment.findMany({
    where: {
      categoryId,
      status: 'PAID',
      team: {
        status: 'ACTIVE',
        id: {
          notIn: teamIdsInGroups,
        },
      },
    },
    select: {
      teamId: true,
    },
  })

  // Seleccionar aleatoriamente la cantidad solicitada
  const shuffled = availableTeams.sort(() => 0.5 - Math.random())
  const selectedTeams = shuffled.slice(0, Math.min(count, shuffled.length))

  // Crear los registros en GroupTeam
  await prisma.groupTeam.createMany({
    data: selectedTeams.map((team) => ({
      groupId,
      teamId: team.teamId,
    })),
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}

export async function removePlayerGroup(formData: FormData) {
  const groupTeamId = formData.get('groupTeamId') as string
  const slug = formData.get('slug') as string

  await prisma.groupTeam.delete({
    where: {
      id: groupTeamId,
    },
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}

export async function deleteCategoryGroup(formData: FormData) {
  const groupCategoryId = formData.get('groupCategoryId') as string
  const slug = formData.get('slug') as string

  await prisma.categoryGroup.delete({
    where: {
      id: groupCategoryId,
    },
  })

  revalidatePath(`/dashboard/tournament/${slug}`)
}

export async function generateRoundRobinMatches(formData: FormData) {
  const groupId = formData.get('groupId') as string
  const categoryId = formData.get('categoryId') as string
  const startDate = formData.get('startDate') as string
  const startTime = formData.get('startTime') as string
  const slug = formData.get('slug') as string

  // Obtener el tournamentId desde la categoría
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { tournamentId: true },
  })

  if (!category) {
    throw new Error('Categoría no encontrada')
  }

  // Obtener los equipos del grupo
  const groupTeams = await prisma.groupTeam.findMany({
    where: {
      groupId,
    },
    select: {
      teamId: true,
    },
  })

  const teamIds = groupTeams.map((gt) => gt.teamId)

  // Crear fecha/hora inicial
  const startDateTime = new Date(`${startDate}T${startTime}`)
  let currentDateTime = new Date(startDateTime)

  // Generar todos los partidos round robin
  const matches = []
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matches.push({
        tournamentId: category.tournamentId,
        categoryId,
        groupId,
        scheduled: new Date(currentDateTime),
        status: 'SCHEDULED' as const,
        round: 'GROUP' as const,
      })
      // Incrementar 1:30 horas (90 minutos)
      currentDateTime = new Date(currentDateTime.getTime() + 90 * 60000)
    }
  }

  // Crear los partidos
  for (let k = 0; k < matches.length; k++) {
    const match = matches[k]

    // Ajustar índices para round robin
    let t1 = 0
    let t2 = 1
    let matchCounter = 0
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        if (matchCounter === k) {
          t1 = i
          t2 = j
          break
        }
        matchCounter++
      }
      if (matchCounter === k) break
    }

    const createdMatch = await prisma.match.create({
      data: match,
    })

    // Crear las relaciones de equipos
    await prisma.matchTeam.createMany({
      data: [
        {
          matchId: createdMatch.id,
          teamId: teamIds[t1],
          position: 1,
        },
        {
          matchId: createdMatch.id,
          teamId: teamIds[t2],
          position: 2,
        },
      ],
    })
  }

  revalidatePath(`/dashboard/tournament/${slug}`)
}
