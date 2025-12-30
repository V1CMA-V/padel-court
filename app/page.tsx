import AboutSection from '@/sections/about'
import TournamentPrincipalSection from '@/sections/tournament-principal'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col">
      <div className="h-dvh w-full flex items-center justify-center flex-col gap-6 px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide ">
          Bienvenido a Cham<span className="text-primary">Pádel</span>
        </h1>
        <div className="mt-6 max-w-2xl text-center space-y-4 text-lg md:text-xl text-foreground">
          <p>
            Tu lugar para encontrar y reservar torneos de pádel fácilmente.
            Además, descubre clubes y eventos cerca de ti.
          </p>
          <p>Administrar torneos y eventos de tu club fácilmente.</p>
        </div>

        <div className="mt-10 animate-bounce bg-accent/20 rounded-full p-2">
          <Link href="#about" className="">
            <ArrowDown className="w-8 h-8" />
          </Link>
        </div>
      </div>

      <AboutSection />

      <TournamentPrincipalSection />
    </section>
  )
}
