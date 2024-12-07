import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProfileDelete } from "./hooks/useProfileDelete";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface DeleteButtonProps {
  profileId: string;
}

export const DeleteButton = ({ profileId }: DeleteButtonProps) => {
  const { deleteProfile, isDeleting } = useProfileDelete();

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Supprimer le profil</p>
        </TooltipContent>
      </Tooltip>

      <DeleteConfirmationDialog
        isDeleting={isDeleting}
        onConfirm={() => deleteProfile(profileId)}
      />
    </AlertDialog>
  );
};