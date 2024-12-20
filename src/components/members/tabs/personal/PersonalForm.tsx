import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormFields } from "./components/FormFields";
import { FormActions } from "./components/FormActions";
import { reverseBloodTypeMapping } from "./constants";

interface PersonalFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

export const PersonalForm = ({ user, onCancel, onSuccess }: PersonalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    birth_date: user.birth_date || "",
    birth_city: user.birth_city || "",
    birth_department: user.birth_department || "",
    blood_type: reverseBloodTypeMapping[user.blood_type || "Unknown"] || "Inconnu",
    marital_status: user.marital_status || "",
    children_count: user.children_count || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Starting personal form submission...");
    console.log("Current user:", user);
    console.log("Form data to submit:", formData);
    
    try {
      const updateData = {
        ...formData,
        children_count: parseInt(formData.children_count.toString()),
        updated_at: new Date().toISOString(),
      };

      console.log("Preparing Supabase update with data:", updateData);

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour des informations personnelles",
        });
        return;
      }

      console.log("Supabase update successful. Response data:", data);

      toast({
        title: "Succès",
        description: "Les informations personnelles ont été mises à jour avec succès",
      });
      
      onSuccess(data);
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la mise à jour des informations personnelles",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormFields 
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      <FormActions onCancel={onCancel} />
    </form>
  );
};