import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileDelete = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProfile = async (profileId: string) => {
    console.log("Deleting profile:", profileId);
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['profiles'] });

      toast({
        title: "Succès",
        description: "Le profil a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du profil.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProfile,
    isDeleting
  };
};