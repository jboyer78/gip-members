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
          .select(`
            first_name,
            last_name,
            email,
            birth_date,
            birth_city,
            birth_department,
            blood_type,
            marital_status,
            children_count,
            street,
            postal_code,
            city,
            country,
            phone_home,
            phone_mobile,
            avatar_url
          `)
          .eq("id", user.id);

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profiles && profiles.length > 0) {
          const profileData = {
            ...profiles[0],
            email: user.email,
            birth_date: profiles[0].birth_date ? new Date(profiles[0].birth_date) : undefined,
          };
          form.reset(profileData);
        } else {
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

      const personalFields = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        birth_date: values.birth_date?.toISOString().split('T')[0],
        birth_city: values.birth_city,
        birth_department: values.birth_department,
        blood_type: values.blood_type,
        marital_status: values.marital_status,
        children_count: values.children_count,
        street: values.street,
        postal_code: values.postal_code,
        city: values.city,
        country: values.country,
        phone_home: values.phone_home,
        phone_mobile: values.phone_mobile,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(personalFields)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été enregistrées avec succès",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        duration: 3000,
      });
    }
  };

  return { form, onSubmit };
};