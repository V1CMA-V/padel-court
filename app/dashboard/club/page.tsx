import CourtsForm from '@/components/courts-form'
import { SubmitButton } from '@/components/submits-buttons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Upload } from 'lucide-react'
import { revalidatePath } from 'next/cache'

async function getData(userId: string) {
  const data = await prisma.club.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      plan: true,
      colorSchema: true,

      phoneNumber: true,
      description: true,
      logoUrl: true,
      sitioWeb: true,
      aditionalServices: true,
    },
  })

  const locationData = await prisma.location.findFirst({
    where: {
      clubId: userId,
    },
    select: {
      address: true,
      country: true,
      state: true,
      zipCode: true,
      googleMapsUrl: true,
    },
  })

  return { clubData: data, location: locationData }
}

export default async function PerfilClubPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  const clubId = data?.claims.sub

  const { clubData, location } = await getData(clubId as string)

  const planNames: { [key: string]: string } = {
    free: 'Plan Gratis',
    pro: 'Plan Profesional',
    Club: 'Plan Empresarial',
  }

  async function handleSubmit(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const sitioWeb = formData.get('sitioWeb') as string
    const color = formData.get('color') as string
    const description = formData.get('description') as string
    const aditionalServices = formData.get('aditionalServices') as string

    // Datos de ubicación
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const country = formData.get('country') as string
    const zipCode = formData.get('zipCode') as string
    const googleMapsUrl = formData.get('googleMapsUrl') as string

    // Actualizar información del club
    await prisma.club.update({
      where: {
        id: clubId as string,
      },
      data: {
        name,
        phoneNumber,
        sitioWeb,
        colorSchema: color,
        description,
        aditionalServices,
      },
    })

    // Upsert de la ubicación (crea si no existe, actualiza si existe)
    await prisma.location.upsert({
      where: {
        clubId: clubId as string,
      },
      update: {
        address,
        state: city,
        country,
        zipCode,
        googleMapsUrl,
      },
      create: {
        clubId: clubId as string,
        address,
        state: city,
        country,
        zipCode,
        googleMapsUrl,
      },
    })

    revalidatePath('/', 'layout')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Perfil del Club</h1>
          <p className="text-muted-foreground">
            Administra la información de tu club
          </p>
        </div>
        <Badge variant="default">{planNames[clubData?.plan || 'free']}</Badge>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Imagen del Club</CardTitle>
            <CardDescription>
              Esta imagen aparecerá en tus torneos y perfil público
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {clubData?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Cambiar Imagen
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG o GIF. Máximo 2MB.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos principales de tu club deportivo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Club <span className="text-primary">*</span>
                </Label>
                <Input id="name" name="name" defaultValue={clubData?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email de Contacto <span className="text-primary">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={clubData?.email}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color de tema</Label>
              <Select
                name="color"
                defaultValue={clubData?.colorSchema as string}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar color" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Color</SelectLabel>
                    <SelectItem value="theme-green">Verde</SelectItem>
                    <SelectItem value="theme-blue">Azul</SelectItem>
                    <SelectItem value="theme-red">Rojo</SelectItem>
                    <SelectItem value="theme-yellow">Amarillo</SelectItem>
                    <SelectItem value="theme-violet">Morado</SelectItem>
                    <SelectItem value="theme-orange">Naranja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={clubData?.description as string}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aditionalServices">Servicios Adicionales</Label>
              <Textarea
                id="aditionalServices"
                name="aditionalServices"
                placeholder="Vestuarios, cafetería, tienda, estacionamiento..."
                defaultValue={clubData?.aditionalServices as string}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Datos de contacto del club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Teléfono</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  defaultValue={clubData?.phoneNumber as string}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <Input
                  id="sitioWeb"
                  name="sitioWeb"
                  type="url"
                  defaultValue={clubData?.sitioWeb as string}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Ubicación (Google Maps URL)</Label>
              <Input
                id="googleMapsUrl"
                name="googleMapsUrl"
                type="url"
                defaultValue={location?.googleMapsUrl as string}
              />
              <p className="text-xs text-muted-foreground">
                Pega aquí el enlace de Google Maps de tu club
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
            <CardDescription>Dirección física del club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">
                Dirección Completa <span className="text-primary">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                defaultValue={(location?.address as string) || ''}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Ciudad <span className="text-primary">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={(location?.state as string) || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">
                  País <span className="text-primary">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={(location?.country as string) || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  defaultValue={(location?.zipCode as string) || ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <SubmitButton />
        </div>
      </form>

      {/* Facilities */}
      <CourtsForm clubId={clubId as string} />
    </div>
  )
}
