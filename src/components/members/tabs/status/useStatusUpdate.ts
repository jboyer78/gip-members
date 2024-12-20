import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StatusUpdateParams {
  newStatus: string;
  comment: string;
}

export const useStatusUpdate = (user: Profile) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ newStatus, comment }: StatusUpdateParams) => {
      console.log("Starting status update with:", { newStatus, userId: user.id });
      
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User error:", userError);
        throw userError;
      }
      
      if (!currentUser) {
        throw new Error("No user found");
      }

      // Get country code for member number generation
      const countryCode = getCountryCode(user.country || '');

      // Generate member number if not already present
      let memberNumber = user.member_number;
      if (!memberNumber) {
        const { data: memberNumberData, error: memberNumberError } = await supabase
          .rpc('generate_unique_member_number', { country_code: countryCode });

        if (memberNumberError) {
          console.error("Member number generation error:", memberNumberError);
          throw memberNumberError;
        }
        memberNumber = memberNumberData;
      }

      // Ensure status is a single-element array to comply with the check constraint
      const statusArray = [newStatus];
      console.log("Updating profile with status array:", statusArray);

      const { data: updateData, error: profileError } = await supabase
        .from("profiles")
        .update({ 
          status: statusArray,
          member_number: memberNumber,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select();

      console.log("Profile update response:", { data: updateData, error: profileError });

      if (profileError) {
        console.error("Profile update error:", profileError);
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

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['statusComments', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
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

// Helper function to get country code
function getCountryCode(country: string): string {
  const countryMap: { [key: string]: string } = {
    'France': 'FR',
    'United Kingdom': 'UK',
    'United States': 'US',
    'Royaume-Uni': 'UK',
    'États-Unis': 'US',
  };

  // Default to FR if country not found in map
  return countryMap[country] || 'FR';
}