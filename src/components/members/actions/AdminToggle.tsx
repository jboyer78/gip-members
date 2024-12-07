import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminToggleProps {
  profileId: string;
  initialStatus: boolean;
}

export const AdminToggle = ({ profileId, initialStatus }: AdminToggleProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminStatus, setAdminStatus] = useState(initialStatus);

  const toggleAdminStatus = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !adminStatus })
        .eq('id', profileId);

      if (error) throw error;

      setAdminStatus(!adminStatus);
      toast({
        title: "Statut administrateur mis à jour",
        description: `L'utilisateur est maintenant ${!adminStatus ? 'administrateur' : 'utilisateur standard'}`,
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut administrateur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAdminStatus}
          disabled={isLoading}
        >
          {adminStatus ? (
            <ToggleRight className="h-4 w-4 text-primary" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{adminStatus ? "Retirer les droits administrateur" : "Définir comme administrateur"}</p>
      </TooltipContent>
    </Tooltip>
  );
};