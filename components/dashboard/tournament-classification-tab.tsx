import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function TournamentClassificationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clasificación Actual</CardTitle>
        <CardDescription>
          Rankings y posiciones de los participantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          La clasificación se actualizará automáticamente conforme se completen
          los partidos.
        </div>
      </CardContent>
    </Card>
  )
}
