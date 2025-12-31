import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Básico',
    description: 'Ideal para jugadores ocasionales',
    price: 'GRATIS',
    features: [
      'Crear y unirse a torneos públicos',
      'Acceso a estadísticas básicas',
      'Soporte comunitario',
    ],
    label: '/free',
  },
  {
    name: 'Pro',
    description: 'Para jugadores frecuentes y organizadores',
    price: '9.99',
    features: [
      'Crear torneos privados',
      'Acceso a estadísticas avanzadas',
      'Soporte prioritario',
    ],
    label: '/pro',
  },
  {
    name: 'Club',
    description: 'Para clubes y organizaciones',
    price: '29.99',
    features: [
      'Gestión completa de clubes',
      'Integración con sistemas de reservas',
      'Soporte dedicado',
    ],
    label: '/club',
  },
]

export default function PlansPage() {
  return (
    <section className="max-w-350  mx-auto min-h-screen pt-20 px-4 flex flex-col items-center gap-14">
      <div className="mt-10 flex flex-col items-center gap-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Planes
        </h1>
        <p className="w-3/4 text-balance text-center text-muted-foreground">
          Si quieres unirte a nuestro equipo y administrar de manera sencilla
          tus propios torneos o ligas de tu club, estás en el lugar correcto.
        </p>
        <p className="w-3/4 text-balance text-center text-muted-foreground">
          Elige el plan que mejor se adapte a tus necesidades y comienza a
          disfrutar de todos los beneficios que ofrecemos.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8">
        {plans.map((plans, index) => (
          <Card
            key={plans.name}
            className={`flex-1 p-6 ${
              index === 1
                ? 'md:scale-105 md:-translate-y-2 border-primary border-2'
                : 'md:translate-y-2'
            }`}
          >
            <CardHeader>
              {index === 1 ? (
                <div className="absolute -mt-10 -ml-6 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </div>
              ) : null}
              <CardTitle>
                <h2 className="text-2xl font-bold uppercase ">{plans.name}</h2>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground">
                  {plans.description}
                </p>
              </CardDescription>

              <CardAction>
                <p className="text-3xl font-bold">
                  {plans.price === 'GRATIS' ? '' : '$'}
                  {plans.price}{' '}
                  <span className="ml-1 text-2xl text-muted-foreground">
                    {plans.price === 'GRATIS' ? '' : '/mo'}
                  </span>{' '}
                </p>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex-1 flex flex-col justify-between px-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  {plans.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            {/* TODO: Crear link funcional para pagos en stripe de cada plan disponible */}
            <CardFooter>
              <form action="" className="w-full">
                <Button className="w-full" asChild>
                  <Link href={`/plans/new/${plans.label}`}>Suscribirse</Link>
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
