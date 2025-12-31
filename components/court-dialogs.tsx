'use client'

import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Switch } from './ui/switch'

interface Court {
  id: string
  name: string
  isIndoor: boolean
  isAvailable: boolean
}

interface CourtDialogsProps {
  courts: Court[]
  handleAddCourt: (formData: FormData) => Promise<void>
  handleEditCourt: (formData: FormData) => Promise<void>
  handleDeleteCourt: (courtId: string) => Promise<void>
}

export function CourtDialogs({
  courts,
  handleAddCourt,
  handleEditCourt,
  handleDeleteCourt,
}: CourtDialogsProps) {
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)

  const totalCourts = courts.length
  const indoorCourts = courts.filter((court) => court.isIndoor).length
  const outdoorCourts = totalCourts - indoorCourts

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Canchas del Club</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona las pistas disponibles para torneos
          </p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Cancha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              action={async (formData) => {
                await handleAddCourt(formData)
                setOpenAdd(false)
              }}
            >
              <DialogHeader>
                <DialogTitle>Agregar Nueva Cancha</DialogTitle>
                <DialogDescription>
                  Completa la información de la nueva cancha
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="courtName">Nombre de la Cancha *</Label>
                  <Input
                    id="courtName"
                    name="courtName"
                    placeholder="Ej: Pista Central, Cancha 1..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isIndoor">Tipo de Cancha *</Label>
                  <Select name="isIndoor" defaultValue="true" required>
                    <SelectTrigger id="isIndoor">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Indoor (Techada)</SelectItem>
                      <SelectItem value="false">
                        Outdoor (Descubierta)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5 pr-2">
                    <Label htmlFor="isAvailable">Disponible para Torneos</Label>
                    <p className="text-sm text-muted-foreground">
                      Indica si esta cancha está habilitada para ser usada en
                      torneos
                    </p>
                  </div>
                  <Switch id="isAvailable" name="isAvailable" defaultChecked />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">Agregar Cancha</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {courts.map((court) => (
          <div
            key={court.id}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="font-medium">{court.name}</div>
              <Badge variant={court.isIndoor ? 'default' : 'secondary'}>
                {court.isIndoor ? 'Indoor' : 'Outdoor'}
              </Badge>
              {!court.isAvailable && (
                <Badge variant="outline" className="text-destructive">
                  No disponible
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog
                open={openEdit && selectedCourt?.id === court.id}
                onOpenChange={(open) => {
                  setOpenEdit(open)
                  if (!open) setSelectedCourt(null)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCourt(court)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form
                    action={async (formData) => {
                      await handleEditCourt(formData)
                      setOpenEdit(false)
                      setSelectedCourt(null)
                    }}
                  >
                    <input type="hidden" name="courtId" value={court.id} />
                    <DialogHeader>
                      <DialogTitle>Editar Cancha</DialogTitle>
                      <DialogDescription>
                        Modifica los datos de la cancha existente
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor={`courtName-${court.id}`}>
                          Nombre de la Cancha *
                        </Label>
                        <Input
                          id={`courtName-${court.id}`}
                          name="courtName"
                          defaultValue={court.name}
                          placeholder="Ej: Pista Central, Cancha 1..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`isIndoor-${court.id}`}>
                          Tipo de Cancha *
                        </Label>
                        <Select
                          name="isIndoor"
                          defaultValue={court.isIndoor ? 'true' : 'false'}
                          required
                        >
                          <SelectTrigger id={`isIndoor-${court.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              Indoor (Techada)
                            </SelectItem>
                            <SelectItem value="false">
                              Outdoor (Descubierta)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="space-y-0.5 pr-2">
                          <Label htmlFor={`isAvailable-${court.id}`}>
                            Disponible para Torneos
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Indica si esta cancha está habilitada para ser usada
                            en torneos
                          </p>
                        </div>
                        <Switch
                          id={`isAvailable-${court.id}`}
                          name="isAvailable"
                          defaultChecked={court.isAvailable}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit">Guardar Cambios</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Eliminar Cancha</DialogTitle>
                    <DialogDescription>
                      {`¿Estás seguro de que deseas eliminar la cancha
                      "${court.name}"? Esta acción no se puede deshacer.`}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await handleDeleteCourt(court.id)
                      }}
                    >
                      Eliminar Cancha
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Canchas</p>
          <p className="text-2xl font-bold">{totalCourts}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Indoor</p>
          <p className="text-2xl font-bold">{indoorCourts}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Outdoor</p>
          <p className="text-2xl font-bold">{outdoorCourts}</p>
        </div>
      </div>
    </>
  )
}
