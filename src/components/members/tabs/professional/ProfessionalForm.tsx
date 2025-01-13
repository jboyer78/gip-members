import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ProfessionalStatusSelect } from "./form/ProfessionalStatusSelect";
import { AdministrationSelect } from "./form/AdministrationSelect";
import { FormActions } from "./form/FormActions";

interface ProfessionalFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

export const ProfessionalForm = ({ user, onCancel, onSuccess }: ProfessionalFormProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    professional_status: user.professional_status || [],
    administration: user.administration || "",
    administration_entry_date: user.administration_entry_date || "",
    training_site: user.training_site || "",
    grade: user.grade || "",
    assignment_direction: user.assignment_direction || "",
    assignment_service: user.assignment_service || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'professional_status') {
      setFormData(prev => ({ ...prev, [name]: [value] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!currentProfile) throw new Error("Profile not found");

      const updateData = {
        ...currentProfile,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned after update");

      toast({
        title: "Succès",
        description: "Les informations professionnelles ont été mises à jour avec succès",
      });
      
      onSuccess(data);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour des informations professionnelles",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Situation professionnelle</label>
          <ProfessionalStatusSelect
            value={formData.professional_status[0] || ""}
            onChange={(value) => handleSelectChange("professional_status", value)}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Administration</label>
          <AdministrationSelect
            value={formData.administration}
            onChange={(value) => handleSelectChange("administration", value)}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date d'entrée dans l'administration</label>
          <Input
            type="date"
            name="administration_entry_date"
            value={formData.administration_entry_date}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Site de formation</label>
          <Input
            name="training_site"
            value={formData.training_site}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Grade</label>
          <Input
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction</label>
          <Input
            name="assignment_direction"
            value={formData.assignment_direction}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Service</label>
          <Input
            name="assignment_service"
            value={formData.assignment_service}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>
      </div>

      <FormActions onCancel={onCancel} isSaving={isSaving} />
    </form>
  );
};