import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PublicationToggleProps {
  publicationId: string;
  isPublished: boolean;
}

export const PublicationToggle = ({ publicationId, isPublished }: PublicationToggleProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('publications')
        .update({ 
          is_published: !isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', publicationId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['publications'] });

      toast({
        title: "Statut mis à jour",
        description: `La publication est maintenant ${!isPublished ? 'visible' : 'masquée'} sur la page d'actualités`,
      });
    } catch (error) {
      console.error('Error toggling publication status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isUpdating}
      className={`hover:text-primary ${isPublished ? 'text-success' : 'text-muted-foreground'}`}
    >
      {isPublished ? (
        <ToggleRight className="h-5 w-5" />
      ) : (
        <ToggleLeft className="h-5 w-5" />
      )}
    </Button>
  );
};