import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profile";

interface StatusUpdateFormProps {
  user: Profile;
}

export const StatusUpdateForm = ({ user }: StatusUpdateFormProps) => {
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
    console.log("Starting status update with:", { newStatus, userId: user.id });
    
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User error:", userError);
        throw userError;
      }
      
      if (!currentUser) {
        throw new Error("No user found");
      }

      // Ensure status is an array and log the update payload
      const statusArray = [newStatus];
      console.log("Updating profile with status:", statusArray);

      const { data: updateData, error: profileError } = await supabase
        .from("profiles")
        .update({ 
          status: statusArray
        })
        .eq("id", user.id)
        .select();

      console.log("Profile update response:", { data: updateData, error: profileError });

      if (profileError) {
        throw profileError;
      }

      if (comment.trim()) {
        console.log("Adding comment:", comment);
        const { error: commentError } = await supabase
          .from("status_comments")
          .insert({
            profile_id: user.id,
            status: newStatus,
            comment: comment.trim(),
            created_by: currentUser.id
          });

        if (commentError) {
          console.error("Comment error:", commentError);
          throw commentError;
        }
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
    <>
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
    </>
  );
};