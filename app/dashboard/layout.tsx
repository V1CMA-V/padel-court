import { DashboardNavigation } from '@/components/dashboard-navigation'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type React from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  const role = data?.claims?.user_metadata?.role

  if (!data?.claims.sub) {
    redirect('/login')
  }
  if (role !== 'CLUB') {
    redirect('/profile')
  }

  return (
    <div className="min-h-screen">
      <DashboardNavigation />
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
