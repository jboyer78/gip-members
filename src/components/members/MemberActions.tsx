import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface MemberActionsProps {
  profileId: string;
  isAdmin: boolean;
}

export const MemberActions = ({ profileId, isAdmin }: MemberActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminStatus, setAdminStatus] = useState(isAdmin);

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
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/profile/${profileId}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Modifier le profil</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Supprimer le profil</p>
        </TooltipContent>
      </Tooltip>

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
    </div>
  );
};