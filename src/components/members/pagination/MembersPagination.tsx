import { Button } from "@/components/ui/button";

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const MembersPagination = ({ currentPage, totalPages, setCurrentPage }: MembersPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
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
  );
};