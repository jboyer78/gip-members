import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberTableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
}

export const MemberTableHeader = ({ onSort, sortColumn, sortDirection }: MemberTableHeaderProps) => {
  const renderSortButton = (label: string, column: string) => (
    <Button
      variant="ghost"
      onClick={() => onSort(column)}
      className="hover:bg-transparent whitespace-normal text-left h-auto py-2"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">Photo</TableHead>
        <TableHead className="w-28">{renderSortButton("N° Adhérent", "member_number")}</TableHead>
        <TableHead className="w-28">{renderSortButton("Prénom", "first_name")}</TableHead>
        <TableHead className="w-28">{renderSortButton("Nom", "last_name")}</TableHead>
        <TableHead className="w-48">{renderSortButton("Email", "email")}</TableHead>
        <TableHead className="w-16">{renderSortButton("Âge", "birth_date")}</TableHead>
        <TableHead className="w-24 max-w-[120px]">{renderSortButton("Grade", "grade")}</TableHead>
        <TableHead className="hidden xl:table-cell w-32 max-w-[150px]">{renderSortButton("Service d'affectation", "assignment_service")}</TableHead>
        <TableHead className="hidden xl:table-cell w-32 max-w-[150px]">{renderSortButton("Direction d'affectation", "assignment_direction")}</TableHead>
        <TableHead className="w-32">Infos perso.</TableHead>
        <TableHead className="w-32">Infos pro.</TableHead>
        <TableHead className="w-32">Infos bancaires</TableHead>
        <TableHead className="hidden 2xl:table-cell w-40 max-w-[120px]">{renderSortButton("Date de création", "created_at")}</TableHead>
        <TableHead className="hidden 2xl:table-cell w-40 max-w-[120px]">{renderSortButton("Date de modification", "updated_at")}</TableHead>
        <TableHead className="hidden 2xl:table-cell w-40">{renderSortButton("Date de bannissement", "banned_at")}</TableHead>
        <TableHead className="w-24">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};