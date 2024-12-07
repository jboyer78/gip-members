import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IpResponse {
  suspicious: boolean
  message?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ip_address } = await req.json()
    
    if (!ip_address) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if IP is already blocked
    const { data: existingAttempt } = await supabaseClient
      .from('login_attempts')
      .select('*')
      .eq('ip_address', ip_address)
      .single()

    if (existingAttempt?.is_blocked) {
      return new Response(
        JSON.stringify({ 
          suspicious: true,
          message: 'This IP address has been blocked due to suspicious activity'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if there are too many recent attempts
    if (existingAttempt) {
      const timeSinceLastAttempt = new Date().getTime() - new Date(existingAttempt.last_attempt).getTime()
      const tooManyAttempts = existingAttempt.attempt_count >= 5 && timeSinceLastAttempt < 15 * 60 * 1000 // 15 minutes

      if (tooManyAttempts) {
        // Block the IP
        await supabaseClient
          .from('login_attempts')
          .update({ 
            is_blocked: true,
            last_attempt: new Date().toISOString()
          })
          .eq('ip_address', ip_address)

        return new Response(
          JSON.stringify({ 
            suspicious: true,
            message: 'Too many login attempts. Please try again later.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update attempt count
      await supabaseClient
        .from('login_attempts')
        .update({ 
          attempt_count: existingAttempt.attempt_count + 1,
          last_attempt: new Date().toISOString()
        })
        .eq('ip_address', ip_address)
    } else {
      // Create new attempt record
      await supabaseClient
        .from('login_attempts')
        .insert([{ ip_address }])
    }

    return new Response(
      JSON.stringify({ suspicious: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})