import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const RESET_COOLDOWN = 60000; // 1 minute cooldown

export const useResetAttempts = (email: string) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (!email) return;
      
      const { data, error } = await supabase
        .from('password_reset_attempts')
        .select('last_attempt')
        .eq('email', email)
        .order('last_attempt', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error checking reset attempts:", error);
        return;
      }

      if (data?.[0]?.last_attempt) {
        updateCountdown(new Date(data[0].last_attempt).getTime());
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
        .order('last_attempt', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error checking attempts:", error);
        setCountdown("");
        return;
      }

      if (data?.[0]?.last_attempt) {
        updateCountdown(new Date(data[0].last_attempt).getTime());
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
      const seconds = Math.ceil(remaining / 1000);
      setCountdown(`${seconds}`);
    } else {
      setCountdown("");
    }
  };

  return countdown;
};