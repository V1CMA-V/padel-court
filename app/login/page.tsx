import { LoginForm } from '@/components/login-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/dist/client/components/navigation'

export default async function LoginPage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()

  const role = data?.claims?.user_metadata?.role

  if (role === 'PLAYER') {
    redirect('/profile')
  } else if (role === 'CLUB') {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
