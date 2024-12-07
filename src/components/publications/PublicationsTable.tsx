import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, Trash2, CheckSquare, XSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditPublicationDialog } from "./EditPublicationDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Publication {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  is_published?: boolean;
}

export const PublicationsTable = () => {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: publications, isLoading } = useQuery({
    queryKey: ["publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Publication[];
    },
  });

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (publication: Publication) => {
    setPublicationToDelete(publication);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!publicationToDelete) return;

    try {
      const { error } = await supabase
        .from("publications")
        .delete()
        .eq("id", publicationToDelete.id);

      if (error) throw error;

      toast({
        title: "Publication supprimée",
        description: "La publication a été supprimée avec succès",
      });

      await queryClient.invalidateQueries({ queryKey: ["publications"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPublicationToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Chargement des publications...</div>;
  }

  return (
    <>
      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Date de modification</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publications?.map((publication) => (
              <TableRow key={publication.id}>
                <TableCell>
                  {publication.image_url ? (
                    <img
                      src={publication.image_url}
                      alt={publication.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                      Pas d'image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{publication.title}</TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate">{publication.content}</p>
                </TableCell>
                <TableCell>
                  {format(new Date(publication.created_at), "dd MMMM yyyy HH:mm:ss", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(publication.updated_at), "dd MMMM yyyy HH:mm:ss", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>
                  {publication.is_published ? (
                    <CheckSquare className="h-5 w-5 text-success" />
                  ) : (
                    <XSquare className="h-5 w-5 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-primary"
                        onClick={() => handleEdit(publication)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Modifier</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive"
                        onClick={() => handleDeleteClick(publication)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimer</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <EditPublicationDialog
        publication={selectedPublication}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};