export default async function ClasificationTournaments() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
            1 === 1
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          1
        </div>
        <div>
          <p className="font-medium">Equipo Nombre</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Categoría Nombre</span>
            <span>•</span>
            <span>G: 0 / P: 0</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-primary">0</p>
        <p className="text-xs text-muted-foreground">puntos</p>
      </div>
    </div>
  )
}
