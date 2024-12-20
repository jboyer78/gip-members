import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Create the user account
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email: 'admin_gip_78600@example.com',
      password: 'Azerty123456!',
      email_confirm: true
    })

    if (createUserError) throw createUserError

    if (!userData.user) {
      throw new Error('User creation failed')
    }

    // Update the profile to make it an admin
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        is_admin: true,
        email_verified: true,
        username: 'admin_gip_78600'
      })
      .eq('id', userData.user.id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        message: 'Admin account created successfully',
        user: userData.user
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})