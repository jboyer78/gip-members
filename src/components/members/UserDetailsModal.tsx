import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/integrations/supabase/types/profile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserDetailsModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsModal = ({ user, open, onOpenChange }: UserDetailsModalProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un statut",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update profile status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ status: [newStatus] })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Add status comment if provided
      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from("status_comments")
          .insert({
            profile_id: user.id,
            status: newStatus,
            comment: comment.trim(),
          });

        if (commentError) throw commentError;
      }

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour avec succès",
      });

      setNewStatus("");
      setComment("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="contact">Coordonnées</TabsTrigger>
            <TabsTrigger value="professional">Informations professionnelles</TabsTrigger>
            <TabsTrigger value="status">Statut d'inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut actuel</label>
                  <p className="text-lg font-semibold">{user.status?.[0] || "En attente"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nouveau statut</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Validée">Validée</SelectItem>
                      <SelectItem value="Refusée">Refusée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire</label>
                <Textarea
                  placeholder="Ajouter un commentaire concernant le changement de statut..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour le statut"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};