import {
  addPlayerGroup,
  addRandomPlayersToGroup,
  deleteCategoryGroup,
  generateRoundRobinMatches,
  removePlayerGroup,
  updateCategory,
} from '@/app/actions/tournament-actions'
import AddCategory from '@/components/dashboard/add-category'
import CreateGroupDialog from '@/components/dashboard/create-group-dialog'
import DelCategory from '@/components/dashboard/del-category'
import EditCategory from '@/components/dashboard/edit-category'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle2,
  Plus,
  Shuffle,
  Trash,
  Trophy,
  UserPlus,
  XCircle,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string | null
  prize1st: string | null
  prize2nd: string | null
  prize3rd: string | null
  teamEnrollments: {
    id: string
    status: string
    withMatch: boolean
    team: {
      id: string
      ownerName: string | null
      teammateName: string | null
      status: string | null
    }
  }[]
  groups: {
    id: string
    name: string
    teamCount: number
    teams: {
      id: string
      team: {
        id: string
        ownerName: string | null
        teammateName: string | null
        status: string | null
      }
    }[]
    matches: {
      id: string
      round: string
      scheduled: Date | null
      status: string
      court: {
        name: string
      } | null
      teams: {
        position: number
        team: {
          id: string
          ownerName: string | null
          teammateName: string | null
        }
      }[]
      result: {
        score: string
        winner: number
      } | null
    }[]
  }[]
  matches: {
    id: string
    round: string
    scheduled: Date | null
    status: string
    court: {
      name: string
    } | null
    teams: {
      position: number
      team: {
        id: string
        ownerName: string | null
        teammateName: string | null
      }
    }[]
    result: {
      score: string
      winner: number
    } | null
  }[]
}

interface TournamentCategoriesTabProps {
  categories: Category[]
  tournamentId: string
  slug: string
}

export default function TournamentCategoriesTab({
  categories,
  tournamentId,
  slug,
}: TournamentCategoriesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestionar Categorías</CardTitle>
            <CardDescription>
              Configura las categorías del torneo y gestiona inscripciones
            </CardDescription>
          </div>
          <AddCategory tournamentId={tournamentId} slug={slug} />
        </div>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => {
              const activeTeams = category.teamEnrollments.filter(
                (enrollment) => enrollment.team.status === 'ACTIVE'
              ).length

              const teamsWithMatches = category.teamEnrollments.filter(
                (enrollment) => enrollment.withMatch
              ).length

              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-semibold">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {category.teamEnrollments.length} equipos inscritos
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex gap-2">
                        <EditCategory
                          category={category}
                          slug={slug}
                          updateCategory={updateCategory}
                        />
                        <DelCategory categoryId={category.id} />
                      </div>
                      {/* Información de premios si existen */}
                      {(category.prize1st ||
                        category.prize2nd ||
                        category.prize3rd) && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Premios</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-1">
                            {category.prize1st && (
                              <div>🥇 1er lugar: {category.prize1st}</div>
                            )}
                            {category.prize2nd && (
                              <div>🥈 2do lugar: {category.prize2nd}</div>
                            )}
                            {category.prize3rd && (
                              <div>🥉 3er lugar: {category.prize3rd}</div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Lista de equipos inscritos */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center justify-between">
                          <span>Equipos Inscritos</span>
                          <div className="text-sm text-muted-foreground font-normal flex gap-4">
                            <span>{activeTeams} activos</span>
                            <span>{teamsWithMatches} con partidos</span>
                          </div>
                        </h4>
                        {category.teamEnrollments.length > 0 ? (
                          <div className="grid gap-3 md:grid-cols-2">
                            {category.teamEnrollments.map((enrollment) => {
                              const teamName =
                                enrollment.team.ownerName &&
                                enrollment.team.teammateName
                                  ? `${enrollment.team.ownerName} & ${enrollment.team.teammateName}`
                                  : enrollment.team.ownerName ||
                                    enrollment.team.teammateName ||
                                    'Equipo sin nombre'

                              const hasActiveMatch = enrollment.withMatch
                              const isTeamActive =
                                enrollment.team.status === 'ACTIVE'

                              return (
                                <Card
                                  key={enrollment.id}
                                  className={
                                    !isTeamActive ? 'opacity-60' : undefined
                                  }
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {teamName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Estado:{' '}
                                          {enrollment.status === 'PAID'
                                            ? 'Pagado'
                                            : enrollment.status === 'PENDING'
                                            ? 'Pendiente'
                                            : 'Cancelado'}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        {/* Ícono de match activo */}
                                        <div
                                          className="flex flex-col items-center"
                                          title={
                                            hasActiveMatch
                                              ? 'Con partidos asignados'
                                              : 'Sin partidos'
                                          }
                                        >
                                          {hasActiveMatch ? (
                                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                          ) : (
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          )}
                                        </div>
                                        {/* Ícono de estado en el torneo */}
                                        <div
                                          className="flex flex-col items-center"
                                          title={
                                            isTeamActive
                                              ? 'Activo en el torneo'
                                              : 'Eliminado del torneo'
                                          }
                                        >
                                          {isTeamActive ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                          ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground border rounded-lg">
                            No hay equipos inscritos en esta categoría
                          </div>
                        )}
                      </div>

                      {/* Sección de Fases */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Fases del Torneo</h4>

                        {/* Fase de Grupos */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-muted-foreground">
                              Fase de Grupos
                            </h5>
                            <CreateGroupDialog
                              categoryId={category.id}
                              teamsCount={
                                category.teamEnrollments.filter(
                                  (e) => e.status === 'PAID'
                                ).length
                              }
                              existingGroupsCount={category.groups.length}
                            />
                          </div>
                          {category.groups.length > 0 && (
                            <div className="grid gap-4 md:grid-cols-2">
                              {category.groups.map((group) => {
                                const getTeamName = (team: {
                                  ownerName: string | null
                                  teammateName: string | null
                                }) => {
                                  if (team.ownerName && team.teammateName) {
                                    return `${team.ownerName} & ${team.teammateName}`
                                  }
                                  return (
                                    team.ownerName ||
                                    team.teammateName ||
                                    'Sin nombre'
                                  )
                                }

                                // Calcular clasificación del grupo
                                const standings = group.teams.map(
                                  (groupTeam) => {
                                    const teamId = groupTeam.team.id
                                    let played = 0
                                    let won = 0
                                    let points = 0

                                    group.matches.forEach((match) => {
                                      const teamInMatch = match.teams.find(
                                        (t) => t.team.id === teamId
                                      )
                                      if (teamInMatch && match.result) {
                                        played++
                                        if (
                                          match.result.winner ===
                                          teamInMatch.position
                                        ) {
                                          won++
                                          points += 3
                                        }
                                      }
                                    })

                                    return {
                                      teamId,
                                      groupTeamId: groupTeam.id,
                                      teamName: getTeamName(groupTeam.team),
                                      played,
                                      won,
                                      points,
                                    }
                                  }
                                )

                                standings.sort((a, b) => b.points - a.points)

                                return (
                                  <Card key={group.id}>
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">
                                          Grupo {group.name}
                                        </CardTitle>
                                        <Badge variant="outline">
                                          {group.teams.length} /{' '}
                                          {group.teamCount} equipos
                                        </Badge>
                                      </div>
                                      <CardDescription>
                                        {group.matches.length} partidos
                                      </CardDescription>
                                      <div className="flex gap-2 mt-3">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="flex-1"
                                            >
                                              <Shuffle className="h-4 w-4 mr-2" />
                                              Aleatorio
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Agregar Equipos Aleatorios
                                              </DialogTitle>
                                              <DialogDescription>
                                                Selecciona cuántos equipos
                                                agregar aleatoriamente al grupo
                                              </DialogDescription>
                                            </DialogHeader>
                                            <form
                                              action={addRandomPlayersToGroup}
                                              className="space-y-4 py-4"
                                            >
                                              <input
                                                type="hidden"
                                                name="groupId"
                                                value={group.id}
                                              />
                                              <input
                                                type="hidden"
                                                name="categoryId"
                                                value={category.id}
                                              />
                                              <input
                                                type="hidden"
                                                name="slug"
                                                value={slug}
                                              />
                                              <div className="space-y-2">
                                                <Label>
                                                  Cantidad de equipos *
                                                </Label>
                                                <Input
                                                  name="count"
                                                  type="number"
                                                  min="1"
                                                  defaultValue="1"
                                                  required
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                  Equipos disponibles:{' '}
                                                  {
                                                    category.teamEnrollments.filter(
                                                      (e) =>
                                                        e.status === 'PAID' &&
                                                        e.team.status ===
                                                          'ACTIVE' &&
                                                        !category.groups.some(
                                                          (g) =>
                                                            g.teams.some(
                                                              (gt) =>
                                                                gt.team.id ===
                                                                e.team.id
                                                            )
                                                        )
                                                    ).length
                                                  }
                                                </p>
                                              </div>
                                              <div className="flex justify-end gap-2">
                                                <DialogClose asChild>
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                  >
                                                    Cancelar
                                                  </Button>
                                                </DialogClose>
                                                <Button type="submit">
                                                  Agregar
                                                </Button>
                                              </div>
                                            </form>
                                          </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="flex-1"
                                            >
                                              <UserPlus className="h-4 w-4 mr-2" />
                                              Específico
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Agregar Equipo Específico
                                              </DialogTitle>
                                              <DialogDescription>
                                                Selecciona el equipo que deseas
                                                agregar al grupo
                                              </DialogDescription>
                                            </DialogHeader>
                                            <form
                                              action={addPlayerGroup}
                                              className="space-y-4 py-4"
                                            >
                                              <input
                                                type="hidden"
                                                name="groupId"
                                                value={group.id}
                                              />
                                              <input
                                                type="hidden"
                                                name="slug"
                                                value={slug}
                                              />
                                              <div className="space-y-2">
                                                <Label>Equipo *</Label>
                                                <Select name="teamId" required>
                                                  <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona un equipo" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {category.teamEnrollments
                                                      .filter(
                                                        (e) =>
                                                          e.status === 'PAID' &&
                                                          e.team.status ===
                                                            'ACTIVE' &&
                                                          !category.groups.some(
                                                            (g) =>
                                                              g.teams.some(
                                                                (gt) =>
                                                                  gt.team.id ===
                                                                  e.team.id
                                                              )
                                                          )
                                                      )
                                                      .map((enrollment) => {
                                                        const teamName =
                                                          enrollment.team
                                                            .ownerName &&
                                                          enrollment.team
                                                            .teammateName
                                                            ? `${enrollment.team.ownerName} & ${enrollment.team.teammateName}`
                                                            : enrollment.team
                                                                .ownerName ||
                                                              enrollment.team
                                                                .teammateName ||
                                                              'Sin nombre'
                                                        return (
                                                          <SelectItem
                                                            key={
                                                              enrollment.team.id
                                                            }
                                                            value={
                                                              enrollment.team.id
                                                            }
                                                          >
                                                            {teamName}
                                                          </SelectItem>
                                                        )
                                                      })}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="flex justify-end gap-2">
                                                <DialogClose asChild>
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                  >
                                                    Cancelar
                                                  </Button>
                                                </DialogClose>
                                                <Button type="submit">
                                                  Agregar
                                                </Button>
                                              </div>
                                            </form>
                                          </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="flex-1"
                                            >
                                              <Trash className="h-4 w-4 mr-2" />
                                              Eliminar
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Eliminar Grupo
                                              </DialogTitle>
                                              <DialogDescription>
                                                ¿Estás seguro de eliminar el
                                                Grupo {group.name}? Esta acción
                                                no se puede deshacer.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <form
                                              action={deleteCategoryGroup}
                                              className="space-y-4 py-4"
                                            >
                                              <input
                                                type="hidden"
                                                name="groupCategoryId"
                                                value={group.id}
                                              />
                                              <input
                                                type="hidden"
                                                name="slug"
                                                value={slug}
                                              />
                                              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                                                <p className="font-semibold mb-1">
                                                  Advertencia:
                                                </p>
                                                <ul className="list-disc list-inside space-y-1">
                                                  <li>
                                                    Se eliminarán{' '}
                                                    {group.matches.length}{' '}
                                                    partidos
                                                  </li>
                                                  <li>
                                                    Se quitarán{' '}
                                                    {group.teams.length} equipos
                                                    del grupo
                                                  </li>
                                                  <li>
                                                    Los equipos volverán a estar
                                                    disponibles
                                                  </li>
                                                </ul>
                                              </div>
                                              <div className="flex justify-end gap-2">
                                                <DialogClose asChild>
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                  >
                                                    Cancelar
                                                  </Button>
                                                </DialogClose>
                                                <Button
                                                  type="submit"
                                                  variant="destructive"
                                                >
                                                  Eliminar Grupo
                                                </Button>
                                              </div>
                                            </form>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {/* Tabla de clasificación */}
                                      <div>
                                        <h6 className="text-sm font-semibold mb-2">
                                          Clasificación
                                        </h6>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="w-8">
                                                #
                                              </TableHead>
                                              <TableHead>Equipo</TableHead>
                                              <TableHead className="text-center">
                                                PJ
                                              </TableHead>
                                              <TableHead className="text-center">
                                                PG
                                              </TableHead>
                                              <TableHead className="text-center">
                                                Pts
                                              </TableHead>
                                              <TableHead className="w-12"></TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {standings.map((team, idx) => (
                                              <TableRow key={team.teamId}>
                                                <TableCell className="font-medium">
                                                  {idx + 1}
                                                </TableCell>
                                                <TableCell>
                                                  {team.teamName}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  {team.played}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  {team.won}
                                                </TableCell>
                                                <TableCell className="text-center font-bold">
                                                  {team.points}
                                                </TableCell>
                                                <TableCell>
                                                  <form
                                                    action={removePlayerGroup}
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="groupTeamId"
                                                      value={team.groupTeamId}
                                                    />
                                                    <input
                                                      type="hidden"
                                                      name="slug"
                                                      value={slug}
                                                    />
                                                    <Button
                                                      type="submit"
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-8 w-8 p-0"
                                                    >
                                                      <XCircle className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                  </form>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>

                                      {/* Partidos del grupo */}
                                      <div className="flex items-center justify-between flex-col mb-2">
                                        <div className="flex items-center justify-between w-full mb-2">
                                          <h6 className="text-sm font-semibold">
                                            Partidos
                                          </h6>
                                          <div className="flex gap-2">
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                >
                                                  <Shuffle className="h-4 w-4 mr-2" />
                                                  Round Robin
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Generar Partidos Round Robin
                                                  </DialogTitle>
                                                  <DialogDescription>
                                                    Genera automáticamente todos
                                                    los partidos del grupo. Cada
                                                    equipo jugará contra todos.
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <form
                                                  action={
                                                    generateRoundRobinMatches
                                                  }
                                                  className="space-y-4 py-4"
                                                >
                                                  <input
                                                    type="hidden"
                                                    name="groupId"
                                                    value={group.id}
                                                  />
                                                  <input
                                                    type="hidden"
                                                    name="categoryId"
                                                    value={category.id}
                                                  />
                                                  <input
                                                    type="hidden"
                                                    name="slug"
                                                    value={slug}
                                                  />
                                                  <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                      <Label>
                                                        Fecha de Inicio *
                                                      </Label>
                                                      <Input
                                                        name="startDate"
                                                        type="date"
                                                        required
                                                      />
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label>
                                                        Hora de Inicio *
                                                      </Label>
                                                      <Input
                                                        name="startTime"
                                                        type="time"
                                                        required
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                                    <p className="font-semibold mb-1">
                                                      Información:
                                                    </p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                      <li>
                                                        Se generarán{' '}
                                                        {Math.floor(
                                                          (group.teams.length *
                                                            (group.teams
                                                              .length -
                                                              1)) /
                                                            2
                                                        )}{' '}
                                                        partidos
                                                      </li>
                                                      <li>
                                                        Cada partido tendrá 1:30
                                                        horas de diferencia
                                                      </li>
                                                      <li>
                                                        Todos los equipos
                                                        jugarán entre sí
                                                      </li>
                                                    </ul>
                                                  </div>
                                                  <div className="flex justify-end gap-2">
                                                    <DialogClose asChild>
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                      >
                                                        Cancelar
                                                      </Button>
                                                    </DialogClose>
                                                    <Button type="submit">
                                                      Generar Partidos
                                                    </Button>
                                                  </div>
                                                </form>
                                              </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                >
                                                  <Plus className="h-4 w-4" />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Crear Partido - Grupo{' '}
                                                    {group.name}
                                                  </DialogTitle>
                                                  <DialogDescription>
                                                    Programa un partido entre
                                                    equipos del grupo
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <form className="space-y-4 py-4">
                                                  <input
                                                    type="hidden"
                                                    name="groupId"
                                                    value={group.id}
                                                  />
                                                  <input
                                                    type="hidden"
                                                    name="categoryId"
                                                    value={category.id}
                                                  />
                                                  <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                      <Label>Equipo 1 *</Label>
                                                      <Select name="team1Id">
                                                        <SelectTrigger>
                                                          <SelectValue placeholder="Selecciona" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {group.teams.map(
                                                            (gt) => {
                                                              const teamName =
                                                                gt.team
                                                                  .ownerName &&
                                                                gt.team
                                                                  .teammateName
                                                                  ? `${gt.team.ownerName} & ${gt.team.teammateName}`
                                                                  : gt.team
                                                                      .ownerName ||
                                                                    gt.team
                                                                      .teammateName ||
                                                                    'Sin nombre'
                                                              return (
                                                                <SelectItem
                                                                  key={
                                                                    gt.team.id
                                                                  }
                                                                  value={
                                                                    gt.team.id
                                                                  }
                                                                >
                                                                  {teamName}
                                                                </SelectItem>
                                                              )
                                                            }
                                                          )}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label>Equipo 2 *</Label>
                                                      <Select name="team2Id">
                                                        <SelectTrigger>
                                                          <SelectValue placeholder="Selecciona" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          {group.teams.map(
                                                            (gt) => {
                                                              const teamName =
                                                                gt.team
                                                                  .ownerName &&
                                                                gt.team
                                                                  .teammateName
                                                                  ? `${gt.team.ownerName} & ${gt.team.teammateName}`
                                                                  : gt.team
                                                                      .ownerName ||
                                                                    gt.team
                                                                      .teammateName ||
                                                                    'Sin nombre'
                                                              return (
                                                                <SelectItem
                                                                  key={
                                                                    gt.team.id
                                                                  }
                                                                  value={
                                                                    gt.team.id
                                                                  }
                                                                >
                                                                  {teamName}
                                                                </SelectItem>
                                                              )
                                                            }
                                                          )}
                                                        </SelectContent>
                                                      </Select>
                                                    </div>
                                                  </div>
                                                  <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                      <Label>Fecha *</Label>
                                                      <Input
                                                        name="date"
                                                        type="date"
                                                        required
                                                      />
                                                    </div>
                                                    <div className="space-y-2">
                                                      <Label>Hora *</Label>
                                                      <Input
                                                        name="time"
                                                        type="time"
                                                        required
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="flex justify-end gap-2">
                                                    <DialogClose asChild>
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                      >
                                                        Cancelar
                                                      </Button>
                                                    </DialogClose>
                                                    <Button type="submit">
                                                      Crear Partido
                                                    </Button>
                                                  </div>
                                                </form>
                                              </DialogContent>
                                            </Dialog>
                                          </div>
                                        </div>
                                        {group.matches.length > 0 ? (
                                          <div className="space-y-2">
                                            {group.matches.map((match) => {
                                              const team1 = match.teams.find(
                                                (t) => t.position === 1
                                              )
                                              const team2 = match.teams.find(
                                                (t) => t.position === 2
                                              )

                                              // TODO: Falta hacer que pueda modificar informacion del partido y colocar resultados para que la clasificacion se modifique automaticamente ademas que falta agregar partidos en fase eliminatoria
                                              return (
                                                <div
                                                  key={match.id}
                                                  className="flex items-center justify-between p-3 rounded-lg border w-full"
                                                >
                                                  <div className="flex-1">
                                                    <div className="text-sm font-medium">
                                                      {team1
                                                        ? getTeamName(
                                                            team1.team
                                                          )
                                                        : 'TBD'}{' '}
                                                      vs{' '}
                                                      {team2
                                                        ? getTeamName(
                                                            team2.team
                                                          )
                                                        : 'TBD'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                      {match.scheduled
                                                        ? new Date(
                                                            match.scheduled
                                                          ).toLocaleDateString(
                                                            'es-ES'
                                                          )
                                                        : 'Sin fecha'}{' '}
                                                      •{' '}
                                                      {match.court?.name ||
                                                        'Sin cancha'}
                                                    </div>
                                                  </div>
                                                  <div>
                                                    {match.result ? (
                                                      <Badge variant="outline">
                                                        {match.result.score}
                                                      </Badge>
                                                    ) : (
                                                      <Badge variant="secondary">
                                                        {match.status ===
                                                        'COMPLETED'
                                                          ? 'Completado'
                                                          : match.status ===
                                                            'ONGOING'
                                                          ? 'En curso'
                                                          : 'Programado'}
                                                      </Badge>
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        ) : (
                                          <div className="text-center py-4 text-sm text-muted-foreground border rounded-lg">
                                            No hay partidos en este grupo
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
                            </div>
                          )}
                        </div>

                        {/* Fases Eliminatorias */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-muted-foreground">
                              Fases Eliminatorias
                            </h5>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Crear Partido
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Crear Nuevo Partido</DialogTitle>
                                  <DialogDescription>
                                    Programa un partido para las fases
                                    eliminatorias
                                  </DialogDescription>
                                </DialogHeader>
                                <form className="space-y-4 py-4">
                                  <input
                                    type="hidden"
                                    name="categoryId"
                                    value={category.id}
                                  />
                                  <div className="space-y-2">
                                    <Label>Fase del Torneo *</Label>
                                    <Select name="round">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona fase" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="QF">
                                          Cuartos de Final
                                        </SelectItem>
                                        <SelectItem value="SF">
                                          Semifinal
                                        </SelectItem>
                                        <SelectItem value="FINAL">
                                          Final
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Equipo 1 *</Label>
                                      <Select name="team1Id">
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona equipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {category.teamEnrollments
                                            .filter(
                                              (e) =>
                                                e.status === 'PAID' &&
                                                e.team.status === 'ACTIVE'
                                            )
                                            .map((enrollment) => {
                                              const teamName =
                                                enrollment.team.ownerName &&
                                                enrollment.team.teammateName
                                                  ? `${enrollment.team.ownerName} & ${enrollment.team.teammateName}`
                                                  : enrollment.team.ownerName ||
                                                    enrollment.team
                                                      .teammateName ||
                                                    'Equipo sin nombre'
                                              return (
                                                <SelectItem
                                                  key={enrollment.team.id}
                                                  value={enrollment.team.id}
                                                >
                                                  {teamName}
                                                </SelectItem>
                                              )
                                            })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Equipo 2 *</Label>
                                      <Select name="team2Id">
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona equipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {category.teamEnrollments
                                            .filter(
                                              (e) =>
                                                e.status === 'PAID' &&
                                                e.team.status === 'ACTIVE'
                                            )
                                            .map((enrollment) => {
                                              const teamName =
                                                enrollment.team.ownerName &&
                                                enrollment.team.teammateName
                                                  ? `${enrollment.team.ownerName} & ${enrollment.team.teammateName}`
                                                  : enrollment.team.ownerName ||
                                                    enrollment.team
                                                      .teammateName ||
                                                    'Equipo sin nombre'
                                              return (
                                                <SelectItem
                                                  key={enrollment.team.id}
                                                  value={enrollment.team.id}
                                                >
                                                  {teamName}
                                                </SelectItem>
                                              )
                                            })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Fecha *</Label>
                                      <Input name="date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Hora *</Label>
                                      <Input name="time" type="time" required />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                      <Button type="button" variant="outline">
                                        Cancelar
                                      </Button>
                                    </DialogClose>
                                    <Button type="submit">Crear Partido</Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                          {category.matches.length > 0 && (
                            <div className="space-y-4">
                              {category.matches.some(
                                (m) => m.round === 'QF'
                              ) && (
                                <div>
                                  <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                    Cuartos de Final
                                  </h5>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {category.matches
                                      .filter((m) => m.round === 'QF')
                                      .map((match) => {
                                        const team1 = match.teams.find(
                                          (t) => t.position === 1
                                        )
                                        const team2 = match.teams.find(
                                          (t) => t.position === 2
                                        )
                                        const getTeamName = (team: {
                                          ownerName: string | null
                                          teammateName: string | null
                                        }) => {
                                          if (
                                            team.ownerName &&
                                            team.teammateName
                                          ) {
                                            return `${team.ownerName} & ${team.teammateName}`
                                          }
                                          return (
                                            team.ownerName ||
                                            team.teammateName ||
                                            'TBD'
                                          )
                                        }

                                        return (
                                          <Card key={match.id}>
                                            <CardContent className="p-4">
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                  <div className="font-medium">
                                                    {team1
                                                      ? getTeamName(team1.team)
                                                      : 'TBD'}
                                                  </div>
                                                  {match.result &&
                                                    match.result.winner ===
                                                      1 && (
                                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div className="text-center text-xs text-muted-foreground">
                                                  VS
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <div className="font-medium">
                                                    {team2
                                                      ? getTeamName(team2.team)
                                                      : 'TBD'}
                                                  </div>
                                                  {match.result &&
                                                    match.result.winner ===
                                                      2 && (
                                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                                  {match.scheduled
                                                    ? new Date(
                                                        match.scheduled
                                                      ).toLocaleDateString(
                                                        'es-ES'
                                                      )
                                                    : 'Sin fecha'}{' '}
                                                  •{' '}
                                                  {match.court?.name ||
                                                    'Sin cancha'}
                                                </div>
                                                {match.result && (
                                                  <Badge
                                                    variant="outline"
                                                    className="w-full justify-center"
                                                  >
                                                    {match.result.score}
                                                  </Badge>
                                                )}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        )
                                      })}
                                  </div>
                                </div>
                              )}

                              {/* Semifinales */}
                              {category.matches.some(
                                (m) => m.round === 'SF'
                              ) && (
                                <div>
                                  <h5 className="text-sm font-medium text-muted-foreground mb-3">
                                    Semifinales
                                  </h5>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {category.matches
                                      .filter((m) => m.round === 'SF')
                                      .map((match) => {
                                        const team1 = match.teams.find(
                                          (t) => t.position === 1
                                        )
                                        const team2 = match.teams.find(
                                          (t) => t.position === 2
                                        )
                                        const getTeamName = (team: {
                                          ownerName: string | null
                                          teammateName: string | null
                                        }) => {
                                          if (
                                            team.ownerName &&
                                            team.teammateName
                                          ) {
                                            return `${team.ownerName} & ${team.teammateName}`
                                          }
                                          return (
                                            team.ownerName ||
                                            team.teammateName ||
                                            'TBD'
                                          )
                                        }

                                        return (
                                          <Card key={match.id}>
                                            <CardContent className="p-4">
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                  <div className="font-medium">
                                                    {team1
                                                      ? getTeamName(team1.team)
                                                      : 'TBD'}
                                                  </div>
                                                  {match.result &&
                                                    match.result.winner ===
                                                      1 && (
                                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div className="text-center text-xs text-muted-foreground">
                                                  VS
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <div className="font-medium">
                                                    {team2
                                                      ? getTeamName(team2.team)
                                                      : 'TBD'}
                                                  </div>
                                                  {match.result &&
                                                    match.result.winner ===
                                                      2 && (
                                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                                  {match.scheduled
                                                    ? new Date(
                                                        match.scheduled
                                                      ).toLocaleDateString(
                                                        'es-ES'
                                                      )
                                                    : 'Sin fecha'}{' '}
                                                  •{' '}
                                                  {match.court?.name ||
                                                    'Sin cancha'}
                                                </div>
                                                {match.result && (
                                                  <Badge
                                                    variant="outline"
                                                    className="w-full justify-center"
                                                  >
                                                    {match.result.score}
                                                  </Badge>
                                                )}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        )
                                      })}
                                  </div>
                                </div>
                              )}

                              {/* Final */}
                              {category.matches.some(
                                (m) => m.round === 'FINAL'
                              ) && (
                                <div>
                                  <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-600" />
                                    Final
                                  </h5>
                                  {category.matches
                                    .filter((m) => m.round === 'FINAL')
                                    .map((match) => {
                                      const team1 = match.teams.find(
                                        (t) => t.position === 1
                                      )
                                      const team2 = match.teams.find(
                                        (t) => t.position === 2
                                      )
                                      const getTeamName = (team: {
                                        ownerName: string | null
                                        teammateName: string | null
                                      }) => {
                                        if (
                                          team.ownerName &&
                                          team.teammateName
                                        ) {
                                          return `${team.ownerName} & ${team.teammateName}`
                                        }
                                        return (
                                          team.ownerName ||
                                          team.teammateName ||
                                          'TBD'
                                        )
                                      }

                                      return (
                                        <Card
                                          key={match.id}
                                          className="border-yellow-200 bg-yellow-50"
                                        >
                                          <CardContent className="p-6">
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between">
                                                <div className="text-lg font-bold">
                                                  {team1
                                                    ? getTeamName(team1.team)
                                                    : 'TBD'}
                                                </div>
                                                {match.result &&
                                                  match.result.winner === 1 && (
                                                    <Trophy className="h-6 w-6 text-yellow-600" />
                                                  )}
                                              </div>
                                              <div className="text-center font-semibold">
                                                VS
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <div className="text-lg font-bold">
                                                  {team2
                                                    ? getTeamName(team2.team)
                                                    : 'TBD'}
                                                </div>
                                                {match.result &&
                                                  match.result.winner === 2 && (
                                                    <Trophy className="h-6 w-6 text-yellow-600" />
                                                  )}
                                              </div>
                                              <div className="pt-3 border-t text-sm text-muted-foreground text-center">
                                                {match.scheduled
                                                  ? new Date(
                                                      match.scheduled
                                                    ).toLocaleDateString(
                                                      'es-ES'
                                                    )
                                                  : 'Sin fecha'}{' '}
                                                •{' '}
                                                {match.court?.name ||
                                                  'Sin cancha'}
                                              </div>
                                              {match.result && (
                                                <Badge
                                                  variant="default"
                                                  className="w-full justify-center py-2"
                                                >
                                                  {match.result.score}
                                                </Badge>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )
                                    })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Mensaje si no hay fases */}
                        {category.groups.length === 0 &&
                          category.matches.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg">
                              No hay fases o partidos programados aún
                            </div>
                          )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay categorías creadas. Crea una para comenzar.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
