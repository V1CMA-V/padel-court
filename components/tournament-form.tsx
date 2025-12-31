'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Plus, X } from 'lucide-react'
import { useState } from 'react'

interface Category {
  name: string
  description: string
  prize1st?: string
  prize2nd?: string
  prize3rd?: string
}

interface CrearTorneoPageProps {
  postNewTournament: (formData: FormData) => Promise<void>
}

export default function CrearTorneoPage({
  postNewTournament,
}: CrearTorneoPageProps) {
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()
  const [categorias, setCategorias] = useState<Category[]>([])
  const [nuevaCategoria, setNuevaCategoria] = useState<Category>({
    name: '',
    description: '',
    prize1st: '',
    prize2nd: '',
    prize3rd: '',
  })
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false)

  const agregarCategoria = () => {
    if (nuevaCategoria.name.trim()) {
      setCategorias([...categorias, { ...nuevaCategoria }])
      setNuevaCategoria({
        name: '',
        description: '',
        prize1st: '',
        prize2nd: '',
        prize3rd: '',
      })
      setMostrarFormCategoria(false)
    }
  }

  const eliminarCategoria = (index: number) => {
    setCategorias(categorias.filter((_, i) => i !== index))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    isDraft: boolean
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Agregar las fechas al FormData
    if (fechaInicio) {
      formData.set('startDate', fechaInicio.toISOString())
    }
    if (fechaFin) {
      formData.set('endDate', fechaFin.toISOString())
    }

    // Agregar el estado (DRAFT o PUBLISHED)
    formData.set('status', isDraft ? 'DRAFT' : 'PUBLISHED')

    // Agregar las categorías como JSON
    formData.set('categories', JSON.stringify(categorias))

    await postNewTournament(formData)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Nuevo Torneo</h1>
        <p className="text-muted-foreground">
          Completa la información para configurar tu torneo
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos principales del torneo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre del Torneo <span className="text-primary">*</span>
              </Label>
              <Input
                id="nombre"
                name="name"
                placeholder="Copa de Primavera 2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="description"
                placeholder="Describe tu torneo, incluye reglas, premios y cualquier información relevante..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas del Torneo</CardTitle>
            <CardDescription>
              Define cuándo se llevará a cabo el torneo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Fecha de Inicio <span className="text-primary">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !fechaInicio && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio
                        ? format(fechaInicio, 'PPP', { locale: es })
                        : 'Selecciona una fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>
                  Fecha de Fin <span className="text-primary">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !fechaFin && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin
                        ? format(fechaFin, 'PPP', { locale: es })
                        : 'Selecciona una fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Inscripciones</CardTitle>
            <CardDescription>
              Define capacidad y costos del torneo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacidad">Capacidad Total</Label>
                <Input
                  id="capacidad"
                  name="capacity"
                  type="number"
                  placeholder="64"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">
                  Precio de Inscripción (MXN){' '}
                  <span className="text-primary">*</span>
                </Label>
                <Input
                  id="precio"
                  name="registrationFee"
                  type="number"
                  placeholder="45"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías del Torneo</CardTitle>
            <CardDescription>
              Define las categorías con sus límites de equipos y precios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {categorias.map((categoria, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{categoria.name}</p>
                    {categoria.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {categoria.description}
                      </p>
                    )}

                    <div className="flex mt-2 space-x-4">
                      {categoria.prize1st && (
                        <p className="text-sm">
                          <span className="font-semibold">1er Lugar:</span>{' '}
                          <span className="text-muted-foreground">
                            {categoria.prize1st}
                          </span>
                        </p>
                      )}
                      {categoria.prize2nd && (
                        <p className="text-sm">
                          <span className="font-semibold">2do Lugar:</span>{' '}
                          <span className="text-muted-foreground">
                            {categoria.prize2nd}
                          </span>
                        </p>
                      )}
                      {categoria.prize3rd && (
                        <p className="text-sm">
                          <span className="font-semibold">3er Lugar:</span>{' '}
                          <span className="text-muted-foreground">
                            {categoria.prize3rd}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarCategoria(index)}
                    className="ml-4 rounded-full p-1 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {!mostrarFormCategoria ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarFormCategoria(true)}
                className="w-full bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Categoría
              </Button>
            ) : (
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="space-y-2">
                  <Label>Nombre de la Categoría *</Label>
                  <Input
                    placeholder="Ej: Dobles Masculino, Sub-16, Mixto"
                    value={nuevaCategoria.name}
                    onChange={(e) =>
                      setNuevaCategoria({
                        ...nuevaCategoria,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input
                    placeholder="Descripción de la categoría"
                    value={nuevaCategoria.description}
                    onChange={(e) =>
                      setNuevaCategoria({
                        ...nuevaCategoria,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Premios por categoria</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="premio1">1er Lugar</Label>
                      <Input
                        id="premio1"
                        placeholder="Trofeo + $500"
                        onChange={(e) =>
                          setNuevaCategoria({
                            ...nuevaCategoria,
                            prize1st: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premio2">2do Lugar</Label>
                      <Input
                        id="premio2"
                        placeholder="Medalla + $250"
                        onChange={(e) =>
                          setNuevaCategoria({
                            ...nuevaCategoria,
                            prize2nd: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premio3">3er Lugar</Label>
                      <Input
                        id="premio3"
                        placeholder="Medalla + $100"
                        onChange={(e) =>
                          setNuevaCategoria({
                            ...nuevaCategoria,
                            prize3rd: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarFormCategoria(false)}
                    className="flex-1 bg-transparent"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={agregarCategoria}
                    className="flex-1"
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prizes */}
        <Card>
          <CardHeader>
            <CardTitle>Premios</CardTitle>
            <CardDescription>
              Especifica los premios del torneo en general
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="premio1">1er Lugar</Label>
                <Input
                  id="premio1"
                  name="prize1st"
                  placeholder="Trofeo + 500€"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2">2do Lugar</Label>
                <Input
                  id="premio2"
                  name="prize2nd"
                  placeholder="Medalla + 250€"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3">3er Lugar</Label>
                <Input
                  id="premio3"
                  name="prize3rd"
                  placeholder="Medalla + 100€"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Formato del Torneo</CardTitle>
            <CardDescription>
              Establece el formato de juego y reglas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="formato">Formato de Juego *</Label>
              <Select name="format" required>
                <SelectTrigger id="formato">
                  <SelectValue placeholder="Selecciona el formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eliminacion">
                    Eliminación Directa
                  </SelectItem>
                  <SelectItem value="grupos">
                    Fase de Grupos + Eliminación
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reglas">Reglas Específicas</Label>
              <Textarea
                id="reglas"
                name="rules"
                placeholder="Define las reglas del torneo: formato de sets, tie-breaks, tiempo entre partidos, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Publicar Torneo
          </Button>
        </div>
      </form>
    </div>
  )
}
