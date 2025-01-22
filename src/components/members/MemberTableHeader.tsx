import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface MemberTableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
}

export const MemberTableHeader = ({ onSort, sortColumn, sortDirection }: MemberTableHeaderProps) => {
  const { t } = useTranslation();

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
        <TableHead className="w-12">{t('members.photo')}</TableHead>
        <TableHead className="w-28">{renderSortButton(t('members.memberNumber'), "member_number")}</TableHead>
        <TableHead className="w-28">{renderSortButton(t('profile.firstName'), "first_name")}</TableHead>
        <TableHead className="w-28">{renderSortButton(t('profile.lastName'), "last_name")}</TableHead>
        <TableHead className="w-48">{renderSortButton(t('profile.email'), "email")}</TableHead>
        <TableHead className="w-16">{renderSortButton(t('members.age'), "birth_date")}</TableHead>
        <TableHead className="w-24 max-w-[120px]">{renderSortButton(t('profile.grade'), "grade")}</TableHead>
        <TableHead className="hidden xl:table-cell w-32 max-w-[150px]">
          {renderSortButton(t('profile.service'), "assignment_service")}
        </TableHead>
        <TableHead className="hidden xl:table-cell w-32 max-w-[150px]">
          {renderSortButton(t('profile.direction'), "assignment_direction")}
        </TableHead>
        <TableHead className="w-32">{t('members.personalInfo')}</TableHead>
        <TableHead className="w-32">{t('members.professionalInfo')}</TableHead>
        <TableHead className="w-32">{t('members.bankingInfo')}</TableHead>
        <TableHead className="hidden 2xl:table-cell w-40 max-w-[120px]">
          {renderSortButton(t('members.createdAt'), "created_at")}
        </TableHead>
        <TableHead className="hidden 2xl:table-cell w-40 max-w-[120px]">
          {renderSortButton(t('members.updatedAt'), "updated_at")}
        </TableHead>
        <TableHead className="hidden 2xl:table-cell w-40">
          {renderSortButton(t('members.bannedAt'), "banned_at")}
        </TableHead>
        <TableHead className="w-24">{t('members.actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};