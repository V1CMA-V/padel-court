import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { SubmitButton } from './submits-buttons'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

async function getUserProfile(userId: string) {
  const data = await prisma.player.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      preferredHand: true,
      preferredSide: true,
      colorSchema: true,
    },
  })

  return data
}

export default async function UpdateProfileForm({
  userId,
}: {
  userId: string
}) {
  const player = await getUserProfile(userId)

  async function updateProfile(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const preferredHand = formData.get('preferredHand') as string
    const preferredSide = formData.get('preferredSide') as string
    const colorSchema = formData.get('color') as string

    await prisma.player.update({
      where: { id: userId },
      data: {
        name: name ?? undefined,
        preferredHand: preferredHand ?? undefined,
        preferredSide: preferredSide ?? undefined,
        colorSchema: colorSchema ?? undefined,
      },
    })

    revalidatePath('/', 'layout')
  }
  return (
    <Card className="w-full">
      <form action={updateProfile} className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle>Datos Generales</CardTitle>
          <CardDescription>
            Por favor proporciona información general sobre ti. Por favor no
            olvides mantenerla actualizada.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 flex flex-col gap-3">
            <div className="space-y-1">
              <Label>Your Name</Label>
              <Input
                name="name"
                type="text"
                id="name"
                placeholder="Your Name"
                defaultValue={player?.name ?? undefined}
              />
            </div>
            <div className="space-y-1">
              <Label>Your Email</Label>
              <Input
                name="email"
                type="email"
                id="email"
                placeholder="Your Email"
                defaultValue={player?.email as string}
                disabled
              />
            </div>

            <div className="space-y-1 flex gap-3 items-center justify-center w-full">
              <div className="flex-1 space-y-1">
                <Label>Mano preferida</Label>
                <Select
                  name="preferredHand"
                  defaultValue={player?.preferredHand as string}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar mano dominante" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Mano dominante</SelectLabel>
                      <SelectItem value="hand-left">Zurdo</SelectItem>
                      <SelectItem value="hand-right">Diestro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1">
                <Label>Lado preferido</Label>
                <Select
                  name="preferredSide"
                  defaultValue={player?.preferredSide as string}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar lado preferido" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Lado preferido</SelectLabel>
                      <SelectItem value="side-left">Reves</SelectItem>
                      <SelectItem value="side-right">Drive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Color de tema</Label>
              <Select name="color" defaultValue={player?.colorSchema as string}>
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
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  )
}
