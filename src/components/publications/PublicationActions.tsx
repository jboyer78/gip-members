import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PublicationToggle } from "./PublicationToggle";

interface PublicationActionsProps {
  publication: {
    id: string;
    is_published: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const PublicationActions = ({ 
  publication, 
  onEdit, 
  onDelete 
}: PublicationActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <PublicationToggle 
        publicationId={publication.id} 
        isPublished={publication.is_published || false} 
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary"
            onClick={onEdit}
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
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Supprimer</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};