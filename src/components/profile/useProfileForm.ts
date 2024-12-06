import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileFormValues } from "./types";

export const useProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // If we have a profile, use it to reset the form
        if (profiles && profiles.length > 0) {
          // Merge the profile data with the user's email
          const profileData = {
            ...profiles[0],
            email: user.email // Add the email from the authenticated user
          };
          form.reset(profileData);
        } else {
          // If no profile exists yet, at least set the email
          form.reset({ email: user.email });
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      }
    };

    fetchProfile();
  }, [form, navigate]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...values,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
      });
    }
  };

  return { form, onSubmit };
};