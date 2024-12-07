import { useState } from "react";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BanButtonProps {
  profileId: string;
  isBanned: boolean;
}

export const BanButton = ({ profileId, isBanned }: BanButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleBanToggle = async () => {
    console.log("Toggling ban status for profile:", profileId);
    console.log("Current ban status:", isBanned);
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          banned_at: isBanned ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)
        .select();

      console.log("Update response:", { data, error });

      if (error) throw error;

      // Invalider le cache pour forcer un rechargement des données
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      
      toast({
        title: isBanned ? "Utilisateur réactivé" : "Utilisateur banni",
        description: isBanned 
          ? "L'utilisateur peut maintenant se reconnecter" 
          : "L'utilisateur ne pourra plus se connecter",
      });
    } catch (error) {
      console.error('Error updating ban status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de bannissement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={isBanned ? "text-destructive hover:text-destructive/90" : ""}
              disabled={isLoading}
            >
              <Ban className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBanned ? "Réactiver l'utilisateur" : "Bannir l'utilisateur"}</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? "Réactiver l'utilisateur ?" : "Bannir l'utilisateur ?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned 
              ? "Cette action permettra à l'utilisateur de se reconnecter à l'application."
              : "Cette action empêchera l'utilisateur de se connecter à l'application."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBanToggle}
            className={isBanned ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
          >
            {isBanned ? "Réactiver" : "Bannir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};