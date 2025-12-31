'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { SaveChangesButton } from './submits-buttons'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Textarea } from './ui/textarea'

type TournamentStatus = 'DRAFT' | 'OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED'

type InformationFormProps = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  status: TournamentStatus
  capacity: number | null
  description: string | null
  format: string | null
  prize1st: string | null
  prize2nd: string | null
  prize3rd: string | null
  registrationFee: number
  rules: string | null
}

export default function InformationForm({
  information,
  slug,
  updateTournament,
}: {
  information: InformationFormProps | null
  slug: string
  updateTournament: (formData: FormData) => Promise<void>
}) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    information?.startDate ? new Date(information.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    information?.endDate ? new Date(information.endDate) : undefined
  )

  if (!information) {
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Agregar las fechas al FormData
    if (startDate) {
      formData.set('startDate', startDate.toISOString())
    }
    if (endDate) {
      formData.set('endDate', endDate.toISOString())
    }

    await updateTournament(formData)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={information.id} />
        <input type="hidden" name="slug" value={slug} />
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Información del Torneo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Titulo</Label>
              <Input
                className="text-lg "
                name="name"
                defaultValue={information.name || 'N/A'}
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <Label htmlFor="formato" className="text-muted-foreground">
                  Formato de Juego
                </Label>
                <Select name="format" defaultValue={information.format || ''}>
                  <SelectTrigger id="formato" className="w-full">
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
              <div className="space-y-1">
                <Label htmlFor="status" className="text-muted-foreground">
                  Estado del Torneo
                </Label>
                <Select name="status" defaultValue={information.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Borrador</SelectItem>
                    <SelectItem value="OPEN">Abierto</SelectItem>
                    <SelectItem value="ONGOING">En Progreso</SelectItem>
                    <SelectItem value="FINISHED">Finalizado</SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'PPP', { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'PPP', { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Descripción</Label>
              <Textarea
                className="text-lg"
                name="description"
                defaultValue={information.description || 'N/A'}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Capacidad</Label>
              <Input
                className="text-lg"
                name="capacity"
                type="number"
                defaultValue={information.capacity || '0'}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">
                Precio de Inscripción
              </Label>
              <Input
                className="text-lg"
                name="registrationFee"
                type="number"
                step="0.01"
                defaultValue={information.registrationFee}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Reglas</Label>
              <Input
                className="text-lg"
                name="rules"
                defaultValue={information.rules || 'N/A'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Premios</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="text-muted-foreground">1er Lugar</Label>
                <Input
                  className="text-lg"
                  name="prize1st"
                  defaultValue={information.prize1st || 'N/A'}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">2do Lugar</Label>
                <Input
                  className="text-lg"
                  name="prize2nd"
                  defaultValue={information.prize2nd || 'N/A'}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">3er Lugar</Label>
                <Input
                  className="text-lg"
                  name="prize3rd"
                  defaultValue={information.prize3rd || 'N/A'}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SaveChangesButton />
        </CardFooter>
      </form>
    </Card>
  )
}
