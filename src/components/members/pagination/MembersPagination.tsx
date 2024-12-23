import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
}

export const MembersPagination = ({ 
  currentPage, 
  totalPages, 
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems
}: MembersPaginationProps) => {
  if (totalItems === 0) return null;

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="flex justify-between items-center gap-2 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Lignes par page:
        </span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {totalItems} résultat{totalItems > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span className="py-2 px-4">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};