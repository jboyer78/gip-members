import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactTabProps {
  user: Profile;
}

export const ContactTab = ({ user }: ContactTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Starting form submission...");
    console.log("Current user:", user);
    console.log("Form data to submit:", formData);
    
    try {
      const updateData = {
        street: formData.street,
        postal_code: formData.postal_code,
        city: formData.city,
        country: formData.country,
        phone_home: formData.phone_home,
        phone_mobile: formData.phone_mobile,
        updated_at: new Date().toISOString(),
      };

      console.log("Preparing Supabase update with data:", updateData);
      console.log("User ID for update:", user.id);

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select();

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

      // Verify if data was actually updated
      const { data: verifyData, error: verifyError } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      console.log("Verification query result:", verifyData);
      if (verifyError) {
        console.error("Verification query error:", verifyError);
      }

      toast({
        title: "Succès",
        description: "Les coordonnées ont été mises à jour avec succès",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la mise à jour des coordonnées",
      });
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <p className="text-muted-foreground">Adresse</p>
          <p>{user.street || "-"}</p>
          <p className="text-muted-foreground">Code postal</p>
          <p>{user.postal_code || "-"}</p>
          <p className="text-muted-foreground">Ville</p>
          <p>{user.city || "-"}</p>
          <p className="text-muted-foreground">Pays</p>
          <p>{user.country || "-"}</p>
          <p className="text-muted-foreground">Téléphone fixe</p>
          <p>{user.phone_home || "-"}</p>
          <p className="text-muted-foreground">Téléphone mobile</p>
          <p>{user.phone_mobile || "-"}</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Modifier les coordonnées
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Adresse</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_home">Téléphone fixe</Label>
          <Input
            id="phone_home"
            name="phone_home"
            type="tel"
            value={formData.phone_home}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_mobile">Téléphone mobile</Label>
          <Input
            id="phone_mobile"
            name="phone_mobile"
            type="tel"
            value={formData.phone_mobile}
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
          onClick={() => setIsEditing(false)}
          className="flex-1"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};