'use client'

import { Badge } from '@/components/ui/badge'
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

export default function CrearTorneoPage() {
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()
  const [categorias, setCategorias] = useState<
    Array<{
      name: string
      description: string
      maxTeams: number
      price: number
    }>
  >([
    {
      name: 'Individual Masculino',
      description: 'Categoría individual para hombres',
      maxTeams: 32,
      price: 45,
    },
  ])
  const [nuevaCategoria, setNuevaCategoria] = useState({
    name: '',
    description: '',
    maxTeams: 16,
    price: 45,
  })
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false)

  const agregarCategoria = () => {
    if (nuevaCategoria.name.trim()) {
      setCategorias([...categorias, { ...nuevaCategoria }])
      setNuevaCategoria({ name: '', description: '', maxTeams: 16, price: 45 })
      setMostrarFormCategoria(false)
    }
  }

  const eliminarCategoria = (index: number) => {
    setCategorias(categorias.filter((_, i) => i !== index))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Nuevo Torneo</h1>
        <p className="text-muted-foreground">
          Completa la información para configurar tu torneo
        </p>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos principales del torneo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Torneo *</Label>
                <Input id="nombre" placeholder="Copa de Primavera 2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deporte">Deporte *</Label>
                <Select>
                  <SelectTrigger id="deporte">
                    <SelectValue placeholder="Selecciona un deporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenis">Tenis</SelectItem>
                    <SelectItem value="padel">Pádel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu torneo, incluye reglas, premios y cualquier información relevante..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input id="ubicacion" placeholder="Club Deportivo Central" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input id="ciudad" placeholder="Madrid" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Calle Principal 123" />
              </div>
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
                <Label>Fecha de Inicio *</Label>
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
                <Label>Fecha de Fin *</Label>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="capacidad">Capacidad Total *</Label>
                <Input id="capacidad" type="number" placeholder="64" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio de Inscripción *</Label>
                <Input id="precio" type="number" placeholder="45" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moneda">Moneda</Label>
                <Select defaultValue="eur">
                  <SelectTrigger id="moneda">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{categoria.name}</p>
                      <Badge variant="outline">
                        {categoria.maxTeams} equipos
                      </Badge>
                      <Badge variant="secondary">{categoria.price}€</Badge>
                    </div>
                    {categoria.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {categoria.description}
                      </p>
                    )}
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
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Máximo de Equipos *</Label>
                    <Input
                      type="number"
                      value={nuevaCategoria.maxTeams}
                      onChange={(e) =>
                        setNuevaCategoria({
                          ...nuevaCategoria,
                          maxTeams: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio de Inscripción (€) *</Label>
                    <Input
                      type="number"
                      value={nuevaCategoria.price}
                      onChange={(e) =>
                        setNuevaCategoria({
                          ...nuevaCategoria,
                          price: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
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
            <CardDescription>Especifica los premios del torneo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="premio1">1er Lugar</Label>
                <Input id="premio1" placeholder="Trofeo + 500€" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio2">2do Lugar</Label>
                <Input id="premio2" placeholder="Medalla + 250€" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premio3">3er Lugar</Label>
                <Input id="premio3" placeholder="Medalla + 100€" />
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
              <Select>
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
                placeholder="Define las reglas del torneo: formato de sets, tie-breaks, tiempo entre partidos, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Guardar como Borrador
          </Button>
          <Button type="submit" className="flex-1">
            Publicar Torneo
          </Button>
        </div>
      </form>
    </div>
  )
}
