import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressFields } from "./components/AddressFields";
import { PhoneFields } from "./components/PhoneFields";
import { FormActions } from "./components/FormActions";

interface ContactFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

export const ContactForm = ({ user, onCancel, onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    street: user.street || "",
    postal_code: user.postal_code || "",
    city: user.city || "",
    country: user.country || "",
    phone_home: user.phone_home || "",
    phone_mobile: user.phone_mobile || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Starting form submission...");
    console.log("Current user:", user);
    console.log("Form data to submit:", formData);
    
    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      console.log("Preparing Supabase update with data:", updateData);
      console.log("User ID for update:", user.id);

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
          description: "Une erreur est survenue lors de la mise à jour des coordonnées",
        });
        return;
      }

      console.log("Supabase update successful. Response data:", data);

      toast({
        title: "Succès",
        description: "Les coordonnées ont été mises à jour avec succès",
      });
      
      onSuccess(data);
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la mise à jour des coordonnées",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <AddressFields 
          formData={formData}
          handleChange={handleChange}
          handleCountryChange={handleCountryChange}
        />
        <PhoneFields 
          formData={formData}
          handleChange={handleChange}
        />
      </div>

      <FormActions onCancel={onCancel} />
    </form>
  );
};