'use client'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarIcon,
  Edit,
  Plus,
  Settings,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react'
import { useState } from 'react'

export default function GestionarTorneoPage({
  params,
}: {
  params: { id: string }
}) {
  const [dialogoPartidoAbierto, setDialogoPartidoAbierto] = useState(false)

  const inscritos = [
    {
      id: 1,
      nombre: 'Carlos Rodríguez',
      categoria: 'Individual',
      estado: 'confirmado',
    },
    {
      id: 2,
      nombre: 'Ana Martínez',
      categoria: 'Individual',
      estado: 'confirmado',
    },
    {
      id: 3,
      nombre: 'Juan Pérez & Luis García',
      categoria: 'Dobles',
      estado: 'pendiente',
    },
    {
      id: 4,
      nombre: 'María López',
      categoria: 'Individual',
      estado: 'confirmado',
    },
  ]

  const partidos = [
    {
      id: 1,
      fecha: '2025-04-15',
      hora: '10:00',
      cancha: 'Pista 1',
      jugador1: 'Carlos Rodríguez',
      jugador2: 'Ana Martínez',
      resultado: '',
      estado: 'programado',
    },
    {
      id: 2,
      fecha: '2025-04-15',
      hora: '12:00',
      cancha: 'Pista 2',
      jugador1: 'Juan Pérez & Luis García',
      jugador2: 'María López & Pedro Sánchez',
      resultado: '6-4, 6-3',
      estado: 'completado',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Copa de Primavera 2025</h1>
            <Badge>En Curso</Badge>
          </div>
          <p className="text-muted-foreground">
            Tenis • 15-20 Abril 2025 • Club Deportivo Central
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32/64</div>
            <p className="text-xs text-muted-foreground">50% capacidad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">8 completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Individual, Dobles, Mixto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,440€</div>
            <p className="text-xs text-muted-foreground">32 × 45€</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="partidos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
          <TabsTrigger value="inscritos">Inscritos</TabsTrigger>
          <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

        {/* Partidos Tab */}
        <TabsContent value="partidos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de Partidos</CardTitle>
                  <CardDescription>
                    Programa y gestiona todos los partidos del torneo
                  </CardDescription>
                </div>
                <Dialog
                  open={dialogoPartidoAbierto}
                  onOpenChange={setDialogoPartidoAbierto}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Partido
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Partido</DialogTitle>
                      <DialogDescription>
                        Programa un partido entre los participantes inscritos
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Jugador/Pareja 1</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona jugador" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                Carlos Rodríguez
                              </SelectItem>
                              <SelectItem value="2">Ana Martínez</SelectItem>
                              <SelectItem value="3">
                                Juan Pérez & Luis García
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Jugador/Pareja 2</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona jugador" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">Ana Martínez</SelectItem>
                              <SelectItem value="4">María López</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Fecha</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Hora</Label>
                          <Input type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label>Cancha</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Pista 1</SelectItem>
                              <SelectItem value="2">Pista 2</SelectItem>
                              <SelectItem value="3">Pista 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Fase del Torneo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona fase" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="32avos">
                              32avos de Final
                            </SelectItem>
                            <SelectItem value="16avos">
                              16avos de Final
                            </SelectItem>
                            <SelectItem value="octavos">
                              Octavos de Final
                            </SelectItem>
                            <SelectItem value="cuartos">
                              Cuartos de Final
                            </SelectItem>
                            <SelectItem value="semifinal">Semifinal</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDialogoPartidoAbierto(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => setDialogoPartidoAbierto(false)}>
                        Crear Partido
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Jugadores</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partidos.map((partido) => (
                    <TableRow key={partido.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(partido.fecha).toLocaleDateString(
                              'es-ES'
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {partido.hora}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{partido.cancha}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{partido.jugador1}</div>
                          <div className="text-muted-foreground">vs</div>
                          <div>{partido.jugador2}</div>
                        </div>
                      </TableCell>
                      <TableCell>{partido.resultado || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            partido.estado === 'completado'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {partido.estado === 'completado'
                            ? 'Completado'
                            : 'Programado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inscritos Tab */}
        <TabsContent value="inscritos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participantes Inscritos</CardTitle>
              <CardDescription>
                Gestiona las inscripciones y confirmaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inscritos.map((inscrito) => (
                    <TableRow key={inscrito.id}>
                      <TableCell className="font-medium">
                        {inscrito.nombre}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inscrito.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inscrito.estado === 'confirmado'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {inscrito.estado === 'confirmado'
                            ? 'Confirmado'
                            : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            Ver Detalles
                          </Button>
                          {inscrito.estado === 'pendiente' && (
                            <Button size="sm">Aprobar</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clasificación Tab */}
        <TabsContent value="clasificacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clasificación Actual</CardTitle>
              <CardDescription>
                Rankings y posiciones de los participantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                La clasificación se actualizará automáticamente conforme se
                completen los partidos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información del Torneo</CardTitle>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Deporte</Label>
                  <p className="text-lg">Tenis</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Formato</Label>
                  <p className="text-lg">Eliminación Directa</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ubicación</Label>
                  <p className="text-lg">Club Deportivo Central, Madrid</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Precio de Inscripción
                  </Label>
                  <p className="text-lg">45€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
