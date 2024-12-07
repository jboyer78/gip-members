import { toast } from "@/hooks/use-toast";
import { SignUpError } from "./types";
import { supabase } from "@/integrations/supabase/client";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15; // minutes

const updateLoginAttempts = async () => {
  try {
    const { data: clientData } = await supabase.auth.getSession();
    const clientIp = clientData?.session?.user?.user_metadata?.client_ip;

    if (!clientIp) {
      console.error('Could not detect client IP');
      return;
    }

    const { data: existingAttempt } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('ip_address', clientIp)
      .single();

    if (existingAttempt) {
      if (existingAttempt.is_blocked) {
        const blockEndTime = new Date(existingAttempt.last_attempt);
        blockEndTime.setMinutes(blockEndTime.getMinutes() + BLOCK_DURATION);
        
        if (new Date() < blockEndTime) {
          const remainingMinutes = Math.ceil((blockEndTime.getTime() - new Date().getTime()) / (1000 * 60));
          throw new Error(`Trop de tentatives. Veuillez réessayer dans ${remainingMinutes} minutes.`);
        }
      }

      const { error } = await supabase
        .from('login_attempts')
        .update({
          attempt_count: (existingAttempt.attempt_count || 0) + 1,
          last_attempt: new Date().toISOString(),
          is_blocked: (existingAttempt.attempt_count || 0) + 1 >= MAX_ATTEMPTS
        })
        .eq('ip_address', clientIp);

      if (error) {
        console.error('Error updating login attempts:', error);
      }

      if ((existingAttempt.attempt_count || 0) + 1 >= MAX_ATTEMPTS) {
        throw new Error(`Trop de tentatives. Veuillez réessayer dans ${BLOCK_DURATION} minutes.`);
      }
    } else {
      const { error } = await supabase
        .from('login_attempts')
        .insert([{ ip_address: clientIp, attempt_count: 1 }]);

      if (error) {
        console.error('Error inserting login attempt:', error);
      }
    }
  } catch (error) {
    console.error('Error in updateLoginAttempts:', error);
    throw error;
  }
};

export const handleSignUpError = async (error: SignUpError): Promise<void> => {
  console.error('SignUp error:', error);
  
  try {
    if (error.status === 429 || error.message?.includes('rate limit') || 
        error.message?.includes('email rate limit exceeded')) {
      await updateLoginAttempts();
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
  } catch (e: any) {
    toast({
      variant: "destructive",
      title: "Erreur d'inscription",
      description: e.message || "Une erreur est survenue lors de l'inscription",
    });
  }
};