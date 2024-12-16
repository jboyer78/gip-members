import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useResetAttempts = (email: string) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!email) return;

    const checkAttempts = async () => {
      const { data, error } = await supabase
        .from("password_reset_attempts")
        .select("last_attempt")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Error checking reset attempts:", error);
        return;
      }

      if (data?.last_attempt) {
        const lastAttempt = new Date(data.last_attempt).getTime();
        const cooldownPeriod = 5 * 60 * 1000; // 5 minutes
        const remainingTime = cooldownPeriod - (Date.now() - lastAttempt);

        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);

          const timer = setInterval(() => {
            const newRemainingTime = cooldownPeriod - (Date.now() - lastAttempt);
            if (newRemainingTime <= 0) {
              setCountdown("");
              clearInterval(timer);
            } else {
              const newMinutes = Math.floor(newRemainingTime / 60000);
              const newSeconds = Math.floor((newRemainingTime % 60000) / 1000);
              setCountdown(
                `${newMinutes}:${newSeconds.toString().padStart(2, "0")}`
              );
            }
          }, 1000);

          return () => clearInterval(timer);
        }
      }
    };

    checkAttempts();
  }, [email]);

  return countdown;
};