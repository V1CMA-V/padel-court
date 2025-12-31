import CTA from '@/components/cta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AboutSection from '@/sections/about'
import FeaturesSection from '@/sections/features'
import Footer from '@/sections/Footer'
import Navbar from '@/sections/navbar'
import TournamentPrincipalSection from '@/sections/tournament-principal'
import { ArrowDown, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col">
        <section className="container mx-auto px-4 py-20 md:py-32 h-dvh flex items-center flex-col justify-center text-center gap-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              Gestión Profesional de Torneos
            </Badge>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Organiza Torneos Pádel sin Complicaciones
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              ChamPádel es la plataforma completa para clubes deportivos.
              Gestiona inscripciones, calendarios, clasificaciones y mucho más
              en un solo lugar.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="#contacto">
                  Comenzar Prueba Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#precios">Ver Precios</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center w-fit p-2 animate-bounce bg-primary/10 rounded-full ">
            <ArrowDown className="mx-auto h-8 w-8 text-primary" />
          </div>
        </section>

        <AboutSection />

        <TournamentPrincipalSection />

        <FeaturesSection />

        <CTA />
      </main>

      <Footer />
    </>
  )
}
