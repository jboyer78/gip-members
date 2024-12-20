import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()
    console.log('Attempting to delete user:', userId)

    if (!userId) {
      throw new Error('User ID is required')
    }

    // First delete the auth user if it exists
    const { data: user, error: getUserError } = await supabaseClient.auth.admin.getUserById(userId)
    console.log('Auth user lookup result:', { user, error: getUserError })

    if (user) {
      const { error: deleteAuthError } = await supabaseClient.auth.admin.deleteUser(userId)
      if (deleteAuthError) {
        console.error('Error deleting auth user:', deleteAuthError)
        throw deleteAuthError
      }
      console.log('Auth user deleted successfully')
    } else {
      console.log('Auth user not found or already deleted')
    }

    // Then ensure the profile is deleted
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    console.log('Profile lookup result:', { profile, error: profileError })

    if (profile) {
      const { error: deleteProfileError } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (deleteProfileError) {
        console.error('Error deleting profile:', deleteProfileError)
        throw deleteProfileError
      }
      console.log('Profile deleted successfully')
    } else {
      console.log('Profile not found or already deleted')
    }

    return new Response(
      JSON.stringify({ message: 'User and profile deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})