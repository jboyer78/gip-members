import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, confirmationUrl } = await req.json()
    console.log('Sending confirmation email to:', email)
    console.log('Confirmation URL:', confirmationUrl)

    // Vérifier la clé API Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set')
      throw new Error('RESEND_API_KEY is not set')
    }
    console.log('RESEND_API_KEY is configured')

    // Tentative d'envoi de l'email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'G.I.P. <onboarding@resend.dev>',
        to: email,
        subject: 'Confirmez votre inscription',
        html: `
          <h2>Bienvenue sur G.I.P.</h2>
          <p>Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
          <p><a href="${confirmationUrl}">Confirmer mon email</a></p>
        `,
      }),
    })

    // Log de la réponse de Resend pour le debugging
    const resText = await res.text()
    console.log('Resend API response:', res.status, resText)

    if (!res.ok) {
      console.error('Error from Resend API:', resText)
      throw new Error(`Resend API error: ${resText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Detailed error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})