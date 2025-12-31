import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function CTA() {
  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary dark:bg-primary/25 p-8 text-center md:p-12">
          <h2 className="mb-4 text-balance text-3xl font-bold text-primary-foreground md:text-4xl">
            Únete a los Clubes que ya Confían en Courtify
          </h2>
          <p className="mb-8 text-pretty text-lg text-primary-foreground/90">
            Comienza tu prueba gratuita de 14 días hoy. Sin tarjeta de crédito
            requerida.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant={'secondary'} asChild>
              <Link href="#contacto">
                Comenzar Prueba Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contacto">Agendar Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
