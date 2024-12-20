import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactFormProps {
  user: Profile;
  onCancel: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}

const COUNTRIES = [
  { name: "Allemagne", code: "DE" },
  { name: "Autriche", code: "AT" },
  { name: "Belgique", code: "BE" },
  { name: "Bulgarie", code: "BG" },
  { name: "Chypre", code: "CY" },
  { name: "Croatie", code: "HR" },
  { name: "Danemark", code: "DK" },
  { name: "Espagne", code: "ES" },
  { name: "Estonie", code: "EE" },
  { name: "Finlande", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Grèce", code: "GR" },
  { name: "Hongrie", code: "HU" },
  { name: "Irlande", code: "IE" },
  { name: "Italie", code: "IT" },
  { name: "Lettonie", code: "LV" },
  { name: "Lituanie", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Malte", code: "MT" },
  { name: "Pays-Bas", code: "NL" },
  { name: "Pologne", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "République Tchèque", code: "CZ" },
  { name: "Roumanie", code: "RO" },
  { name: "Slovaquie", code: "SK" },
  { name: "Slovénie", code: "SI" },
  { name: "Suède", code: "SE" },
  { name: "Royaume-Uni", code: "GB" },
  { name: "Australie", code: "AU" },
  { name: "Canada", code: "CA" },
  { name: "Chili", code: "CL" },
  { name: "Colombie", code: "CO" },
  { name: "Corée (République de)", code: "KR" },
  { name: "Costa-Rica", code: "CR" },
  { name: "États-Unis d'Amérique", code: "US" },
  { name: "Islande", code: "IS" },
  { name: "Israël", code: "IL" },
  { name: "Japon", code: "JP" },
  { name: "Mexique", code: "MX" },
  { name: "Norvège", code: "NO" },
  { name: "Nouvelle-Zélande", code: "NZ" },
  { name: "Suisse", code: "CH" },
  { name: "Turquie", code: "TR" },
  { name: "Afghanistan", code: "AF" },
  { name: "Afrique du Sud", code: "ZA" },
  { name: "Albanie", code: "AL" },
  { name: "Algérie", code: "DZ" },
  { name: "Andorre", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Arabie Saoudite", code: "SA" },
  { name: "Argentine", code: "AR" },
  { name: "Arménie", code: "AM" },
  { name: "Azerbaïdjan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahreïn", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Bélize", code: "BZ" },
  { name: "Bénin", code: "BJ" },
  { name: "Bhoutan", code: "BT" },
  { name: "Biélorussie", code: "BY" },
  { name: "Birmanie (Myanmar)", code: "MM" },
  { name: "Bolivie", code: "BO" },
  { name: "Bosnie-Herzégovine", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Brésil", code: "BR" },
  { name: "Bruneï", code: "BN" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodge", code: "KH" },
  { name: "Cameroun", code: "CM" },
  { name: "Cap Vert", code: "CV" },
  { name: "Centrafrique", code: "CF" },
  { name: "Chine", code: "CN" },
  { name: "Comores", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Corée", code: "KP" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Cuba", code: "CU" },
  { name: "Djibouti", code: "DJ" },
  { name: "Égypte", code: "EG" },
  { name: "Émirats Arabes Unis", code: "AE" },
  { name: "Équateur", code: "EC" },
  { name: "Érythrée", code: "ER" },
  { name: "Éthiopie", code: "ET" },
  { name: "Fidji", code: "FJ" },
  { name: "Gabon", code: "GA" },
  { name: "Gambie", code: "GM" },
  { name: "Géorgie", code: "GE" },
  { name: "Ghana", code: "GH" },
  { name: "Grenade", code: "GD" },
  { name: "Guatemala", code: "GT" },
  { name: "Guinée", code: "GN" },
  { name: "Guinée Équatoriale", code: "GQ" },
  { name: "Guinée-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haïti", code: "HT" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Inde", code: "IN" },
  { name: "Indonésie", code: "ID" },
  { name: "Irak", code: "IQ" },
  { name: "Iran", code: "IR" },
  { name: "Jamaïque", code: "JM" },
  { name: "Jordanie", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kirghizistan", code: "KG" },
  { name: "Koweït", code: "KW" },
  { name: "Laos", code: "LA" },
  { name: "Lesotho", code: "LS" },
  { name: "Liban", code: "LB" },
  { name: "Libéria", code: "LR" },
  { name: "Libye", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Macao", code: "MO" },
  { name: "Macédoine", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malaisie", code: "MY" },
  { name: "Malawi", code: "MW" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Maroc", code: "MA" },
  { name: "Maurice", code: "MU" },
  { name: "Mauritanie", code: "MR" },
  { name: "Moldavie", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolie", code: "MN" },
  { name: "Monténégro", code: "ME" },
  { name: "Mozambique", code: "MZ" },
  { name: "Namibie", code: "NA" },
  { name: "Népal", code: "NP" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigéria", code: "NG" },
  { name: "Oman", code: "OM" },
  { name: "Ouganda", code: "UG" },
  { name: "Ouzbékistan", code: "UZ" },
  { name: "Pakistan", code: "PK" },
  { name: "Panama", code: "PA" },
  { name: "Papouasie-Nouvelle-Guinée", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Pérou", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Qatar", code: "QA" },
  { name: "Russie", code: "RU" },
  { name: "Rwanda", code: "RW" },
  { name: "Sénégal", code: "SN" },
  { name: "Serbie", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapour", code: "SG" },
  { name: "Somalie", code: "SO" },
  { name: "Soudan", code: "SD" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Syrie", code: "SY" },
  { name: "Tadjikistan", code: "TJ" },
  { name: "Taïwan", code: "TW" },
  { name: "Tanzanie", code: "TZ" },
  { name: "Tchad", code: "TD" },
  { name: "Thaïlande", code: "TH" },
  { name: "Togo", code: "TG" },
  { name: "Tunisie", code: "TN" },
  { name: "Turkménistan", code: "TM" },
  { name: "Ukraine", code: "UA" },
  { name: "Uruguay", code: "UY" },
  { name: "Venezuela", code: "VE" },
  { name: "Vietnam", code: "VN" },
  { name: "Yémen", code: "YE" },
  { name: "Zambie", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" }
].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

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
          <Select value={formData.country} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un pays" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};