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
      className="hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead>Photo</TableHead>
        <TableHead>{renderSortButton("N° Adhérent", "member_number")}</TableHead>
        <TableHead>{renderSortButton("Prénom", "first_name")}</TableHead>
        <TableHead>{renderSortButton("Nom", "last_name")}</TableHead>
        <TableHead>{renderSortButton("Email", "email")}</TableHead>
        <TableHead>{renderSortButton("Âge", "birth_date")}</TableHead>
        <TableHead>{renderSortButton("Grade", "grade")}</TableHead>
        <TableHead>{renderSortButton("Service", "assignment_service")}</TableHead>
        <TableHead>{renderSortButton("Direction", "assignment_direction")}</TableHead>
        <TableHead>Informations personnelles</TableHead>
        <TableHead>Informations professionnelles</TableHead>
        <TableHead>Informations bancaires</TableHead>
        <TableHead>{renderSortButton("Date de création", "created_at")}</TableHead>
        <TableHead>{renderSortButton("Dernière modification", "updated_at")}</TableHead>
        <TableHead>{renderSortButton("Date de bannissement", "banned_at")}</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};