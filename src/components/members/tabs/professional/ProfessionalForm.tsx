import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfessionalFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

const professionalStatuses = [
  "Actif",
  "Retraité",
  "Membre fondateur",
  "Membre honoraire",
  "Membre bienfaiteur"
];

const administrations = [
  "Agent du Ministère de la Justice",
  "Armée",
  "Disney",
  "Douane",
  "Gendarmerie Nationale",
  "Police de l'environnement",
  "Police des transports",
  "Police Municipale",
  "Police Nationale",
  "Sureté",
  "autres"
];

export const ProfessionalForm = ({ user, onCancel, onSuccess }: ProfessionalFormProps) => {
  const { toast } = useToast();
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
    
    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

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
          description: "Une erreur est survenue lors de la mise à jour des informations professionnelles",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Les informations professionnelles ont été mises à jour avec succès",
      });
      
      onSuccess(data);
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la mise à jour des informations professionnelles",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Situation professionnelle</label>
          <Select 
            value={formData.professional_status[0] || ""} 
            onValueChange={(value) => handleSelectChange("professional_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre situation" />
            </SelectTrigger>
            <SelectContent>
              {professionalStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Administration</label>
          <Select 
            value={formData.administration} 
            onValueChange={(value) => handleSelectChange("administration", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre administration" />
            </SelectTrigger>
            <SelectContent>
              {administrations.map((admin) => (
                <SelectItem key={admin} value={admin}>
                  {admin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date d'entrée dans l'administration</label>
          <Input
            type="date"
            name="administration_entry_date"
            value={formData.administration_entry_date}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Site de formation</label>
          <Input
            name="training_site"
            value={formData.training_site}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Grade</label>
          <Input
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direction</label>
          <Input
            name="assignment_direction"
            value={formData.assignment_direction}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Service</label>
          <Input
            name="assignment_service"
            value={formData.assignment_service}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};