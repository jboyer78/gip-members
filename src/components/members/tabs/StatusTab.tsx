import { Profile } from "@/integrations/supabase/types/profile";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      // Update profile status - now properly wrapped in an array
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
  );
};