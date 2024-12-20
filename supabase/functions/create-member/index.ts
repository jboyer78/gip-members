import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface CreateMemberPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  birthDate: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const payload: CreateMemberPayload = await req.json()

    // Check if email already exists in auth.users
    const { data: existingUser, error: authSearchError } = await supabaseClient.auth.admin.listUsers()
    
    if (authSearchError) {
      console.error('Error checking existing users:', authSearchError)
      return new Response(
        JSON.stringify({ error: 'Error checking existing users' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const userExists = existingUser.users.some(user => user.email === payload.email)
    
    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'Un utilisateur existe déjà avec cette adresse email' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create the auth user with email confirmation disabled
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'No user created' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update profile with additional information
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        first_name: payload.firstName,
        last_name: payload.lastName,
        birth_date: payload.birthDate,
        email_verified: true,
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Error updating profile' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ user: authData.user }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in create-member function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})