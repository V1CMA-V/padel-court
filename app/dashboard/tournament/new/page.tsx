import CrearTorneoPage from '@/components/tournament-form'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardNewTournamentPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims?.sub) {
    redirect('/plans')
  }

  const userId = data?.claims.sub as string

  async function postNewTournament(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const capacity = parseInt(formData.get('capacity') as string)
    const registrationFee = parseFloat(
      formData.get('registrationFee') as string
    )
    const format = formData.get('format') as string
    const rules = formData.get('rules') as string
    const prize1st = formData.get('prize1st') as string
    const prize2nd = formData.get('prize2nd') as string
    const prize3rd = formData.get('prize3rd') as string
    const status = (formData.get('status') as 'DRAFT' | 'OPEN') || 'DRAFT'

    const slugLink = name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    // Obtener las categorías del FormData (vienen como JSON string)
    const categoriesJson = formData.get('categories') as string
    const categories: Array<{
      name: string
      description?: string
      prize1st?: string
      prize2nd?: string
      prize3rd?: string
    }> = categoriesJson ? JSON.parse(categoriesJson) : []

    // Crear el torneo primero
    const tournament = await prisma.tournament.create({
      data: {
        clubId: userId,
        slug: slugLink,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        capacity,
        registrationFee,
        format,
        rules,
        prize1st,
        prize2nd,
        prize3rd,
      },
    })

    // Crear todas las categorías asociadas al torneo
    if (categories.length > 0) {
      await prisma.category.createMany({
        data: categories.map((cat) => ({
          name: cat.name,
          description: cat.description || '',
          prize1st: cat.prize1st || '',
          prize2nd: cat.prize2nd || '',
          prize3rd: cat.prize3rd || '',
          tournamentId: tournament.id,
        })),
      })
    }

    redirect(`/dashboard/tournament/${tournament.slug}`)
  }

  return (
    <section>
      <CrearTorneoPage postNewTournament={postNewTournament} />
    </section>
  )
}
