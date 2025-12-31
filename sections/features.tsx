import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart3, Calendar, Clock, Shield, Trophy, Users } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Todo lo que Necesitas en un Solo Lugar
          </h2>
          <p className="text-muted-foreground">
            Herramientas profesionales diseñadas específicamente para la gestión
            de torneos deportivos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: 'Gestión de Calendarios',
              description:
                'Crea y administra calendarios de partidos automáticamente con nuestro sistema inteligente.',
            },
            {
              icon: Users,
              title: 'Inscripciones Online',
              description:
                'Los jugadores pueden registrarse fácilmente y realizar pagos de forma segura.',
            },
            {
              icon: Trophy,
              title: 'Clasificaciones en Tiempo Real',
              description:
                'Actualiza resultados y visualiza clasificaciones actualizadas al instante.',
            },
            {
              icon: BarChart3,
              title: 'Estadísticas Detalladas',
              description:
                'Analiza el rendimiento de jugadores y torneos con reportes completos.',
            },
            {
              icon: Clock,
              title: 'Ahorra Tiempo',
              description:
                'Automatiza tareas repetitivas y dedica más tiempo a lo que realmente importa.',
            },
            {
              icon: Shield,
              title: 'Seguro y Confiable',
              description:
                'Tus datos y los de tus jugadores están protegidos con la mejor tecnología.',
            },
          ].map((feature, i) => (
            <Card key={i} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
