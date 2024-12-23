import {
  Table,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/integrations/supabase/types/profile";
import { MemberTableHeader } from "./MemberTableHeader";
import { UserDetailsModal } from "./UserDetailsModal";
import { useState } from "react";
import { MembersFilters } from "./filters/MembersFilters";
import { MembersPagination } from "./pagination/MembersPagination";
import { filterProfiles } from "./utils/filterProfiles";
import { sortProfiles } from "./utils/sortProfiles";
import { useProfilesWithBanking } from "@/hooks/useProfilesWithBanking";
import { MembersTableContent } from "./MembersTableContent";

interface MembersTableProps {
  profiles: Profile[] | null;
  isLoading: boolean;
}

export const MembersTable = ({ profiles, isLoading }: MembersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [directionFilter, setDirectionFilter] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const { data: profilesWithBankingInfo, refetch } = useProfilesWithBanking(isLoading, profiles);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

  const filteredProfiles = filterProfiles(
    profilesWithBankingInfo || [],
    searchQuery,
    gradeFilter,
    serviceFilter,
    directionFilter
  );

  const sortedProfiles = sortProfiles(filteredProfiles, sortColumn, sortDirection);

  const totalPages = Math.ceil(sortedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProfiles = sortedProfiles.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (profile: Profile) => {
    console.log("Row clicked, profile:", profile);
    setSelectedUser(profile);
    setModalOpen(true);
  };

  const handleModalOpenChange = async (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      console.log("Modal closed, refreshing data...");
      await refetch();
    }
  };

  return (
    <div className="space-y-4">
      <MembersFilters
        profiles={profiles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        gradeFilter={gradeFilter}
        setGradeFilter={setGradeFilter}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        directionFilter={directionFilter}
        setDirectionFilter={setDirectionFilter}
        setCurrentPage={setCurrentPage}
      />

      <ScrollArea className="h-[800px] rounded-md">
        <Table>
          <MemberTableHeader 
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <MembersTableContent 
            displayedProfiles={displayedProfiles}
            onRowClick={handleRowClick}
          />
        </Table>
      </ScrollArea>

      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={sortedProfiles.length}
      />

      <UserDetailsModal 
        user={selectedUser}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        onUpdate={refetch}
      />
    </div>
  );
};