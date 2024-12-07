import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/profile";
import { StatusSelector } from "./StatusSelector";
import { CommentInput } from "./CommentInput";
import { useStatusUpdate } from "./useStatusUpdate";
import { useToast } from "@/hooks/use-toast";

interface StatusUpdateFormProps {
  user: Profile;
}

export const StatusUpdateForm = ({ user }: StatusUpdateFormProps) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateStatus } = useStatusUpdate(user);
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

    console.log("Updating status with:", { newStatus, comment });
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
  );
};