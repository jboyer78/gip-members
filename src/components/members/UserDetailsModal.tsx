import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UserDetailsModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsModal = ({ user, open, onOpenChange }: UserDetailsModalProps) => {
  if (!user) return null;

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-muted-foreground">Email</p>
              <p>{user.email || "-"}</p>
              <p className="text-muted-foreground">Date de naissance</p>
              <p>{formatDate(user.birth_date)}</p>
              <p className="text-muted-foreground">Ville de naissance</p>
              <p>{user.birth_city || "-"}</p>
              <p className="text-muted-foreground">Département</p>
              <p>{user.birth_department || "-"}</p>
              <p className="text-muted-foreground">Groupe sanguin</p>
              <p>{user.blood_type || "-"}</p>
              <p className="text-muted-foreground">Situation familiale</p>
              <p>{user.marital_status || "-"}</p>
              <p className="text-muted-foreground">Nombre d'enfants</p>
              <p>{user.children_count !== null ? user.children_count : "-"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Coordonnées</h3>
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
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-lg">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-muted-foreground">Statut</p>
              <p>{user.status?.join(", ") || "-"}</p>
              <p className="text-muted-foreground">Administration</p>
              <p>{user.administration || "-"}</p>
              <p className="text-muted-foreground">Date d'entrée</p>
              <p>{formatDate(user.administration_entry_date)}</p>
              <p className="text-muted-foreground">Site de formation</p>
              <p>{user.training_site || "-"}</p>
              <p className="text-muted-foreground">Grade</p>
              <p>{user.grade || "-"}</p>
              <p className="text-muted-foreground">Direction</p>
              <p>{user.assignment_direction || "-"}</p>
              <p className="text-muted-foreground">Service</p>
              <p>{user.assignment_service || "-"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};