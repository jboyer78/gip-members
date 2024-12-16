import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MINIMUM_WAIT_TIME = 300000; // 5 minutes in milliseconds

export const checkSignupAttempts = async (email: string): Promise<boolean> => {
  const { data: attempts, error: attemptsError } = await supabase
    .from('signup_attempts')
    .select('last_attempt')
    .eq('email', email)
    .order('last_attempt', { ascending: false })
    .limit(1);

  if (attemptsError) {
    console.error('Error checking signup attempts:', attemptsError);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de la vérification des tentatives",
    });
    return false;
  }

  if (attempts && attempts.length > 0) {
    const lastAttempt = new Date(attempts[0].last_attempt);
    const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();

    if (timeSinceLastAttempt < MINIMUM_WAIT_TIME) {
      const remainingMinutes = Math.ceil((MINIMUM_WAIT_TIME - timeSinceLastAttempt) / 60000);
      toast({
        variant: "destructive",
        title: "Trop de tentatives",
        description: `Veuillez attendre ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} avant de réessayer`,
      });
      return false;
    }
  }

  return true;
};

export const recordSignupAttempt = async (email: string): Promise<boolean> => {
  const { error: insertError } = await supabase
    .from('signup_attempts')
    .insert([{ 
      email,
      last_attempt: new Date().toISOString(),
    }]);

  if (insertError) {
    console.error('Error recording signup attempt:', insertError);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement de la tentative",
    });
    return false;
  }

  return true;
};

export const handleSignupError = (error: any): boolean => {
  console.error('SignUp error:', error);
  
  let errorMessage = error.message;
  let errorCode = '';

  // Parse error body if it exists
  try {
    if (error.body) {
      const errorBody = JSON.parse(error.body);
      errorCode = errorBody.code;
      errorMessage = errorBody.message;
    }
  } catch (e) {
    console.error('Error parsing error body:', e);
  }
  
  if (errorCode === 'over_email_send_rate_limit' || 
      errorMessage.includes("rate limit") || 
      error.status === 429) {
    toast({
      variant: "destructive",
      title: "Limite de tentatives atteinte",
      description: "Trop de tentatives d'inscription. Veuillez réessayer dans 5 minutes.",
    });
    return false;
  }
  
  toast({
    variant: "destructive",
    title: "Erreur lors de l'inscription",
    description: errorMessage || "Une erreur est survenue lors de l'inscription",
  });
  return false;
};