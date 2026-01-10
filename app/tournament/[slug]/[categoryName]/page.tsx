import Footer from '@/sections/Footer'
import Navbar from '@/sections/navbar'

export default async function CategoryTournamentPage({
  params,
}: {
  params: { slug: string; categoryName: string }
}) {
  const { slug, categoryName } = await params
  return (
    <div>
      <Navbar />
      Category Tournament Page: {slug} - {categoryName}
      <Footer />
    </div>
  )
}
