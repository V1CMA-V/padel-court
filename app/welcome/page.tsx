import { CheckCircleIcon } from 'lucide-react'

export default function WelcomePage() {
  return (
    <section className="h-dvh w-full flex flex-col items-center justify-center gap-4">
      <div className="p-4 rounded-full bg-green-500/10 ">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold">Bienvenido a ChampPádel</h1>
      <p className="max-w-md text-center text-muted-foreground leading-7">
        Gracias por registrarte. Por favor, revisa tu correo electrónico para
        confirmar tu cuenta.
      </p>
    </section>
  )
}
