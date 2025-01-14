import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfessionalFormValues } from "./types";

export const useProfessionalForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<ProfessionalFormValues>();

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
            administration,
            administration_entry_date,
            training_site,
            grade,
            assignment_direction,
            assignment_service,
            professional_status,
            professional_document_url
          `)
          .eq("id", user.id);

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profiles && profiles.length > 0) {
          const profileData = {
            ...profiles[0],
            administration_entry_date: profiles[0].administration_entry_date ? new Date(profiles[0].administration_entry_date) : undefined,
          };
          form.reset(profileData);
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      }
    };

    fetchProfile();
  }, [form, navigate]);

  const onSubmit = async (values: ProfessionalFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const professionalFields = {
        administration: values.administration,
        administration_entry_date: values.administration_entry_date?.toISOString().split('T')[0],
        training_site: values.training_site,
        grade: values.grade,
        assignment_direction: values.assignment_direction,
        assignment_service: values.assignment_service,
        professional_status: values.professional_status,
        professional_document_url: values.professional_document_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(professionalFields)
        .eq("id", user.id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations professionnelles ont été enregistrées avec succès",
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