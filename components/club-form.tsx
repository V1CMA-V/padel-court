import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export function ClubForm({ className, ...props }: React.ComponentProps<'div'>) {
  async function signIn(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    console.log('New Club: ', name, email, password, confirmPassword)

    if (password !== confirmPassword)
      throw new Error('Las contraseñas no coinciden.')

    const supabase = createClient()

    const { data, error } = await (
      await supabase
    ).auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'CLUB',
        },
        emailRedirectTo: `${process.env.BASE_URL}/dashboard`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    await prisma.club.create({
      data: {
        id: data?.user?.id as string,
        name: name as string,
        email: email as string,
      },
    })

    redirect('/welcome')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form action={signIn}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nombre del Club</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Tu nombre"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <div className="flex gap-4">
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirmar Contraseña
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
              />
            </Field>
          </div>

          <Field>
            <Button type="submit">Iniciar Sesión</Button>
          </Field>
          <FieldSeparator>O</FieldSeparator>
          <Field>
            <Button variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continuar con Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Al hacer clic en continuar, aceptas nuestros{' '}
        <a href="#">Términos de Servicio</a> y nuestra{' '}
        <a href="#">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
