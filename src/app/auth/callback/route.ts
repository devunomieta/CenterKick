import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'recovery' | 'signup' | 'invite' | 'magiclink' | null
  const next = searchParams.get('next') ?? '/'

  const error_param = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error_param) {
    return NextResponse.redirect(`${origin}/login?error=${error_description || error_param}`)
  }

  const supabase = await createClient()

  if (code) {
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Auth callback error (code):', error)
      return NextResponse.redirect(`${origin}/login?error=Auth code exchange failed: ${error.message}`)
    }

    // Ensure we have the user from the session
    const user = session?.user
    let finalNext = next

    if (user) {
      // Check for existing database records
      let { data: userRecord } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

      // AUTO-CREATE OR SYNC USER RECORD
      if (!userRecord) {
        // Intercept new Google sign-ups and reject them
        if (user.app_metadata?.providers?.includes('google')) {
          const { createClient: createAdminClient } = await import('@supabase/supabase-js')
          
          const adminSupabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          
          // Delete the newly orphaned user to free up the email address
          await adminSupabase.auth.admin.deleteUser(user.id)
          
          // Sign out the local session
          await supabase.auth.signOut()
          
          return NextResponse.redirect(`${origin}/auth/unlinked-account`)
        }

        let assignedRole = 'player'
        // Auto-promote specific developer/admin emails
        const adminEmails = ['centerkickdev@gmail.com', 'admin@centerkick.com']
        if (user.email && adminEmails.includes(user.email)) {
          assignedRole = 'superadmin'
        }

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id, 
            email: user.email, 
            role: assignedRole,
            is_active: true
          }])
          .select()
          .single()

        // Explicitly update auth metadata for immediate session availability
        await supabase.auth.updateUser({
          data: { role: assignedRole }
        })
        
        if (!insertError) {
          userRecord = newUser
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('user_id', user.id)
        .single()

      const role = userRecord?.role
      const adminRoles = ['superadmin', 'admin', 'blogger', 'operations', 'finance']

      if (role && adminRoles.includes(role)) {
        finalNext = '/admin'
      } else {
        finalNext = '/dashboard'
      }
    }

    // Dynamic redirect based on where the request came from
    // This solves the localhost vs production redirect issue
    return NextResponse.redirect(`${origin}${finalNext}`)
  }

  // Handle OTP/Token-based login
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })
    if (error) {
      console.error('Auth callback error (otp):', error)
      return NextResponse.redirect(`${origin}/login?error=OTP verification failed: ${error.message}`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=No authentication code found`)
}
