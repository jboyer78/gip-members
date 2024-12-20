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

    // First check if the profile exists
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    console.log('Profile lookup result:', { profile, error: profileError })

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw new Error('Error fetching profile')
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Then check if the auth user exists
    const { data: user, error: getUserError } = await supabaseClient.auth.admin.getUserById(userId)
    
    console.log('User lookup result:', { user, error: getUserError })

    // If the auth user doesn't exist but profile does, we should delete the profile
    if (getUserError || !user) {
      console.log('Auth user not found, deleting only profile')
      const { error: deleteProfileError } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (deleteProfileError) {
        console.error('Error deleting profile:', deleteProfileError)
        throw deleteProfileError
      }

      return new Response(
        JSON.stringify({ message: 'Profile deleted successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // If both profile and auth user exist, delete the auth user (which will trigger the profile deletion via trigger)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      throw deleteError
    }

    console.log('User successfully deleted:', userId)

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
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