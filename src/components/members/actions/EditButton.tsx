import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface EditButtonProps {
  profileId: string;
}

export const EditButton = ({ profileId }: EditButtonProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};