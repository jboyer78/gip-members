import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/profile";
import { StatusSelector } from "./StatusSelector";
import { CommentInput } from "./CommentInput";
import { useStatusUpdate } from "./useStatusUpdate";
import { useToast } from "@/hooks/use-toast";

interface StatusUpdateFormProps {
  user: Profile;
  onUpdate: () => void;
}

export const StatusUpdateForm = ({ user, onUpdate }: StatusUpdateFormProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateStatus } = useStatusUpdate(user, onUpdate);
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
      await updateStatus({ newStatus, comment });
      setNewStatus("");
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">Mettre à jour le statut</h3>
      <div className="space-y-4">
        <StatusSelector value={newStatus} onChange={setNewStatus} />
        <CommentInput value={comment} onChange={setComment} />
        <Button
          className="w-full"
          onClick={handleStatusUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mise à jour..." : "Mettre à jour le statut"}
        </Button>
      </div>
    </div>
  );
};