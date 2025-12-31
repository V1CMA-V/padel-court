import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Home, LayoutDashboard, Settings, Trophy, Users2 } from 'lucide-react'
import Link from 'next/link'
import { SingOutButton } from './submits-buttons'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export const navItemsPlayer = [
  {
    name: 'Torneos',
    href: '/tournaments',
    icon: Home,
  },
  { name: 'Perfil', href: '/profile', icon: Settings },
  { name: 'Equipos', href: '/profile/teams', icon: Users2 },
]

const navItemsClub = [
  {
    href: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/tournament',
    name: 'Mis Torneos',
    icon: Trophy,
  },
  {
    href: '/dashboard/club',
    name: 'Perfil del Club',
    icon: Settings,
  },
]

export default async function UserNav({
  id,
  role,
}: {
  id: string
  role: 'PLAYER' | 'CLUB' | undefined
}) {
  async function getPlayerInfo(userId: string) {
    if (!userId) return null
    const user = await prisma.player.findUnique({
      where: { id: id },
      select: {
        name: true,
        email: true,
        profileImageUrl: true,
      },
    })
    return user
  }

  async function getClubInfo(userId: string) {
    if (!userId) return null
    const user = await prisma.club.findUnique({
      where: { id: id },
      select: {
        name: true,
        email: true,
        logoUrl: true,
      },
    })
    return user
  }

  async function handleSignOut() {
    'use server'

    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    }
  }

  const user =
    role === 'PLAYER' ? await getPlayerInfo(id) : await getClubInfo(id)

  const avatarImage =
    role === 'PLAYER'
      ? (user as { profileImageUrl?: string })?.profileImageUrl
      : (user as { logoUrl?: string })?.logoUrl

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={avatarImage || ''} alt="User Avatar" />
            <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {(role === 'PLAYER' ? navItemsPlayer : navItemsClub).map(
            (item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href={item.href}
                  className="w-full flex justify-between items-center"
                >
                  {item.name}
                  <span>
                    <item.icon className="w-4 h-4" />
                  </span>
                </Link>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="w-full flex justify-between items-center"
          asChild
        >
          <form action={handleSignOut}>
            <SingOutButton />
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
