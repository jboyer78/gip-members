import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StatusUpdateParams {
  newStatus: string;
  comment: string;
}

export const useStatusUpdate = (user: Profile, onUpdate?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ newStatus, comment }: StatusUpdateParams) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          status: [newStatus],
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Always create a status comment entry
      const { error: commentError } = await supabase
        .from('status_comments')
        .insert({
          profile_id: user.id,
          status: newStatus,
          comment: comment.trim() || null, // If comment is empty, store null
          created_by: currentUser.id
        });

      if (commentError) throw commentError;

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['statusComments', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      if (onUpdate) onUpdate();
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  });

  return { updateStatus };
};