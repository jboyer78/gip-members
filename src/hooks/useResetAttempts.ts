import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const RESET_COOLDOWN = 300000; // 5 minutes cooldown

export const useResetAttempts = (email: string) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (!email) return;
      
      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking reset attempts:", error);
        return;
      }

      if (data?.last_attempt) {
        updateCountdown(new Date(data.last_attempt).getTime());
      }
    };

    checkExistingAttempt();
  }, [email]);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (!email) return;

      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking attempts:", error);
        setCountdown("");
        return;
      }

      if (data?.last_attempt) {
        updateCountdown(new Date(data.last_attempt).getTime());
      } else {
        setCountdown("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const updateCountdown = (lastAttempt: number) => {
    const now = Date.now();
    const remaining = RESET_COOLDOWN - (now - lastAttempt);
    
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    } else {
      setCountdown("");
    }
  };

  return countdown;
};