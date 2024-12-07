import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isDeleting: boolean;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog = ({
  isDeleting,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action est irréversible. Cette action supprimera définitivement le profil
          de l'utilisateur et toutes les données associées.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={isDeleting}
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};