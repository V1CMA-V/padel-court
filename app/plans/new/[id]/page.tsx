import { ClubForm } from '@/components/club-form'

export default async function NewClubPlan({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <section className="max-w-350 mx-auto min-h-screen pt-20 px-4 flex flex-col items-center gap-14">
      <div className="mt-10 flex flex-col items-center gap-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Configura tu Club para el plan{' '}
          <span className="text-primary uppercase">{id}</span>
        </h1>
        <p className="text-center text-muted-foreground">
          Aquí puedes configurar un nuevo plan para clubes.
        </p>
      </div>

      <ClubForm />
    </section>
  )
}
