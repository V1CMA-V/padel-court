import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-300 mx-auto px-4 py-16 space-y-8 flex flex-col md:flex-row md:items-center md:justify-between md:space-y-0 md:gap-8"
    >
      <div className="flex-1 flex flex-col gap-6 md:w-1/2 ">
        <h2 className="text-3xl font-semibold tracking-wide">Sobre Nosotros</h2>

        <p className="text-lg leading-7">
          Somos un equipo{' '}
          <span className="text-primary/85 font-semibold">
            apasionado por el pádel
          </span>
          , dedicados a{' '}
          <span className="text-primary/85 font-semibold">
            conectar jugadores, clubes y eventos
          </span>{' '}
          para crear una{' '}
          <span className="text-primary/85 font-semibold">
            comunidad vibrante y activa
          </span>
          .
        </p>
        <p className="text-lg leading-7">
          Nuestra <span className="text-primary/85 font-semibold">misión</span>{' '}
          es{' '}
          <span className="text-primary/85 font-semibold">
            facilitar la inscripción y gestión de torneos
          </span>
          , así como promover el{' '}
          <span className="text-primary/85 font-semibold">
            crecimiento del pádel
          </span>{' '}
          a nivel local e internacional.
        </p>
        <p className="text-lg leading-7">
          Creemos en el{' '}
          <span className="text-primary/85 font-semibold">
            poder del deporte
          </span>{' '}
          para{' '}
          <span className="text-primary/85 font-semibold">
            unir a las personas
          </span>{' '}
          y fomentar un{' '}
          <span className="text-primary/85 font-semibold">
            estilo de vida saludable y activo
          </span>
          .
        </p>

        <p className="text-lg leading-7">
          Únete a nosotros en este emocionante viaje y descubre todo lo que
          <span className="text-primary/85 font-semibold"> ChamPádel</span>{' '}
          tiene para ofrecerte.
        </p>

        <div className="mt-4 m-auto w-fit">
          <Button asChild>
            <Link href="/register">Regístrate Ahora</Link>
          </Button>

          <Button asChild variant="outline" className="ml-4">
            <Link href="/learn-more">Aprende Más</Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 hover:scale-105 transition-transform duration-300 md:w-1/2 rounded-2xl overflow-hidden max-h-150">
        <img
          src="https://images.unsplash.com/photo-1658723826297-fe4d1b1e6600?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </section>
  )
}
