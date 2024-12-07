import { toast } from "@/hooks/use-toast";
import { SignUpError } from "./types";
import { supabase } from "@/integrations/supabase/client";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15; // minutes

const updateLoginAttempts = async (ip: string) => {
  const { data: existingAttempt } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('ip_address', ip)
    .single();

  if (existingAttempt) {
    if (existingAttempt.is_blocked) {
      const blockEndTime = new Date(existingAttempt.last_attempt);
      blockEndTime.setMinutes(blockEndTime.getMinutes() + BLOCK_DURATION);
      
      if (new Date() < blockEndTime) {
        const remainingMinutes = Math.ceil((blockEndTime.getTime() - new Date().getTime()) / (1000 * 60));
        throw new Error(`Too many attempts. Please try again in ${remainingMinutes} minutes.`);
      }
    }

    const { error } = await supabase
      .from('login_attempts')
      .update({
        attempt_count: (existingAttempt.attempt_count || 0) + 1,
        last_attempt: new Date().toISOString(),
        is_blocked: (existingAttempt.attempt_count || 0) + 1 >= MAX_ATTEMPTS
      })
      .eq('ip_address', ip);

    if ((existingAttempt.attempt_count || 0) + 1 >= MAX_ATTEMPTS) {
      throw new Error(`Too many attempts. Please try again in ${BLOCK_DURATION} minutes.`);
    }
  } else {
    await supabase
      .from('login_attempts')
      .insert([{ ip_address: ip, attempt_count: 1 }]);
  }
};

export const handleSignUpError = async (error: SignUpError): Promise<void> => {
  console.error('SignUp error:', error);

  // Get IP address from the client
  const response = await fetch('https://api.ipify.org?format=json');
  const { ip } = await response.json();
  
  if (error.status === 429 || error.message?.includes('rate limit')) {
    await updateLoginAttempts(ip);
    toast({
      variant: "destructive",
      title: "Limite d'envoi atteinte",
      description: "Trop de tentatives d'inscription. Veuillez réessayer dans quelques minutes.",
    });
    return;
  }

  if (error.message?.includes("User already registered")) {
    toast({
      variant: "destructive",
      title: "Erreur d'inscription",
      description: "Un compte existe déjà avec cette adresse email",
    });
    return;
  }

  toast({
    variant: "destructive",
    title: "Erreur d'inscription",
    description: "Une erreur est survenue lors de l'inscription",
  });
};