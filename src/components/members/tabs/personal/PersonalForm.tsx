import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

const bloodTypeOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Inconnu"
];

const maritalStatusOptions = [
  "Marié(e)",
  "Divorcé(e)",
  "Veuf(ve)",
  "Célibataire",
  "Autres"
];

export const PersonalForm = ({ user, onCancel, onSuccess }: PersonalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    birth_date: user.birth_date || "",
    birth_city: user.birth_city || "",
    birth_department: user.birth_department || "",
    blood_type: user.blood_type || "",
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
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="birth_date">Date de naissance</Label>
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_city">Ville de naissance</Label>
          <Input
            id="birth_city"
            name="birth_city"
            value={formData.birth_city}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_department">Département de naissance</Label>
          <Input
            id="birth_department"
            name="birth_department"
            value={formData.birth_department}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blood_type">Groupe sanguin</Label>
          <Select 
            value={formData.blood_type} 
            onValueChange={(value) => handleSelectChange("blood_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marital_status">Situation matrimoniale</Label>
          <Select 
            value={formData.marital_status} 
            onValueChange={(value) => handleSelectChange("marital_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre situation" />
            </SelectTrigger>
            <SelectContent>
              {maritalStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="children_count">Nombre d'enfants</Label>
          <Input
            id="children_count"
            name="children_count"
            type="number"
            min="0"
            value={formData.children_count}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Enregistrer
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};