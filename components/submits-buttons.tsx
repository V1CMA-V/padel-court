'use client'

import { DoorClosed, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Guardar cambios
        </Button>
      )}
    </>
  )
}

export function AddCourt() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Añadir pista
        </Button>
      )}
    </>
  )
}

export function SignUpButton() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Creando cuenta...
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Crear cuenta
        </Button>
      )}
    </>
  )
}

export function SignInButton() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Iniciar sesión
        </Button>
      )}
    </>
  )
}

export function SingOutButton() {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          <DoorClosed className="mr-2 w-4 h-4" />
          Cerrar sesión
        </Button>
      )}
    </>
  )
}
