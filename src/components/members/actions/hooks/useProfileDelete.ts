import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileDelete = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProfile = async (profileId: string) => {
    console.log("Starting deletion process for profile:", profileId);
    setIsDeleting(true);

    try {
      // First, check if the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw new Error('Could not verify profile existence');
      }

      if (!existingProfile) {
        console.error('Profile not found:', profileId);
        throw new Error('Profile not found');
      }

      // Attempt to delete the profile
      const { error: deleteError, data: deleteData } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)
        .select();

      console.log("Delete response:", { deleteError, deleteData });

      if (deleteError) {
        console.error('Error deleting profile:', deleteError);
        throw deleteError;
      }

      // Invalidate both queries to ensure all data is refreshed
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['profiles'] }),
        queryClient.invalidateQueries({ queryKey: ['profiles-with-banking'] })
      ]);

      toast({
        title: "Succès",
        description: "Le profil a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du profil. Veuillez réessayer.",
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