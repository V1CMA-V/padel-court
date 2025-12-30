import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="grid grid-cols-3 items-center gap-4 border-t px-4 py-8">
      <h2 className="text-2xl font-bold text-center">
        Cham<span className="text-primary">Pádel</span>
      </h2>

      <div className="flex flex-col gap-2 ">
        <h4 className="text-lg font-semibold text-center text-primary">
          Links
        </h4>
        <nav className="m-auto">
          <ul
            className="flex flex-col gap-2 text-muted-foreground transition-colors duration-300
          "
          >
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/tournaments" className="hover:text-foreground">
                Tournaments
              </Link>
            </li>
            <li>
              <Link href="/clubs" className="hover:text-foreground">
                Clubs
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-semibold text-center text-primary">
          Empresas
        </h4>
        <nav className="m-auto ">
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li>
              <Link href="/advertising" className="hover:text-foreground">
                Publicidad
              </Link>
            </li>
            <li>
              <Link href="/affiliates" className="hover:text-foreground">
                Afiliados
              </Link>
            </li>
            <li>
              <Link href="/sponsors" className="hover:text-foreground">
                Patrocinadores
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="col-span-3 mt-8 text-center text-sm text-muted-foreground border-t pt-4 group transition-colors duration-300">
        <p className="inline-block group-hover:text-foreground">
          Todos los derechos reservados. &copy; {new Date().getFullYear()} Cham
          <span className="group-hover:text-primary">Pádel</span>.
        </p>
      </div>
    </footer>
  )
}
