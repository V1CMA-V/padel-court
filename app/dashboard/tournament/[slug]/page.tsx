import { updateTournament } from '@/app/actions/tournament-actions'
import TournamentCategoriesTab from '@/components/dashboard/tournament-categories-tab'
import TournamentClassificationTab from '@/components/dashboard/tournament-classification-tab'
import TournamentHeader from '@/components/dashboard/tournament-header'
import TournamentInscriptionTab from '@/components/dashboard/tournament-inscrition-tab'
import TournamentMatchesTab from '@/components/dashboard/tournament-matches-tab'
import InformationForm from '@/components/information-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import prisma from '@/lib/prisma'

async function getData(tournamentSlug: string) {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug: tournamentSlug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      startDate: true,
      endDate: true,
      status: true,
      capacity: true,
      description: true,
      format: true,
      prize1st: true,
      prize2nd: true,
      prize3rd: true,
      registrationFee: true,
      rules: true,
    },
  })

  const teamsInscribed = await prisma.teamEnrollment.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      createdAt: true,

      category: {
        select: {
          name: true,
        },
      },

      team: {
        select: {
          ownerName: true,
          teammateName: true,
        },
      },
      status: true,
    },
  })

  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      category: {
        select: {
          name: true,
        },
      },

      court: {
        select: {
          name: true,
        },
      },

      round: true,
      scheduled: true,
      status: true,
    },
  })

  const categories = await prisma.category.findMany({
    where: {
      tournamentId: tournament?.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      prize1st: true,
      prize2nd: true,
      prize3rd: true,
      teamEnrollments: {
        select: {
          id: true,
          status: true,
          withMatch: true,
          team: {
            select: {
              id: true,
              ownerName: true,
              teammateName: true,
              status: true,
            },
          },
        },
      },
      groups: {
        select: {
          id: true,
          name: true,
          teamCount: true,
          teams: {
            select: {
              id: true,
              team: {
                select: {
                  id: true,
                  ownerName: true,
                  teammateName: true,
                  status: true,
                },
              },
            },
          },
          matches: {
            select: {
              id: true,
              round: true,
              scheduled: true,
              status: true,
              court: {
                select: {
                  name: true,
                },
              },
              teams: {
                select: {
                  position: true,
                  team: {
                    select: {
                      id: true,
                      ownerName: true,
                      teammateName: true,
                    },
                  },
                },
              },
              result: {
                select: {
                  score: true,
                  winner: true,
                },
              },
            },
          },
        },
      },
      matches: {
        where: {
          round: {
            not: 'GROUP',
          },
        },
        select: {
          id: true,
          round: true,
          scheduled: true,
          status: true,
          court: {
            select: {
              name: true,
            },
          },
          teams: {
            select: {
              position: true,
              team: {
                select: {
                  id: true,
                  ownerName: true,
                  teammateName: true,
                },
              },
            },
          },
          result: {
            select: {
              score: true,
              winner: true,
            },
          },
        },
      },
    },
  })

  return { tournament, teamsInscribed, matches, categories }
}

export default async function GestionarTorneoPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const { tournament, teamsInscribed, matches, categories: rawCategories } = await getData(
    slug
  )

  const categories = rawCategories.map(category => ({
    ...category,
    groups: category.groups.map(group => ({
      ...group,
      teamCount: group.teamCount ?? 0
    }))
  }))

  if (!tournament) {
    return <div>Torneo no encontrado</div>
  }

  const teamsInscribedPaid = teamsInscribed.filter(
    (e) => e.status === 'PAID'
  ).length

  const matchesCompleted = matches.filter(
    (m) => m.status === 'COMPLETED'
  ).length

  return (
    <div className="space-y-6">
      <TournamentHeader
        tournament={tournament}
        teamsInscribed={teamsInscribed.length}
        teamsInscribedPaid={teamsInscribedPaid}
        matchesTotal={matches.length}
        matchesCompleted={matchesCompleted}
        categoriesTotal={categories.length}
        categoriesNames={categories.map((cat) => cat.name).join(', ')}
      />

      {/* Tabs */}
      <Tabs defaultValue="categorias" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
          <TabsTrigger value="inscritos">Inscritos</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

        {/* Categorías Tab */}
        <TabsContent value="categorias" className="space-y-4">
          <TournamentCategoriesTab
            categories={categories}
            tournamentId={tournament.id}
            slug={slug}
          />
        </TabsContent>

        {/* Partidos Tab */}
        <TabsContent value="partidos" className="space-y-4">
          <TournamentMatchesTab matches={matches} />
        </TabsContent>

        {/* Inscritos Tab */}
        <TabsContent value="inscritos" className="space-y-4">
          <TournamentInscriptionTab
            categories={categories}
            teamsInscribed={teamsInscribed}
            tournament={{ id: tournament.id, slug: tournament.slug }}
          />
        </TabsContent>

        {/* Clasificación Tab */}
        <TabsContent value="clasificacion" className="space-y-4">
          <TournamentClassificationTab />
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <InformationForm
            information={tournament}
            slug={slug}
            updateTournament={updateTournament}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
