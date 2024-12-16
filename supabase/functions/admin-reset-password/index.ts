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

    // First get the user by email
    const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers()
    
    if (userError) throw userError

    const user = userData.users.find(u => u.email === 'jfboyer2007@yahoo.fr')
    
    if (!user) {
      throw new Error('User not found')
    }

    // Now update the password using the correct user ID
    const { data, error } = await supabaseClient.auth.admin.updateUserById(
      user.id,
      { password: 'Azerty123456!' }
    )

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})