import {
  Table,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/integrations/supabase/types/profile";
import { MemberTableHeader } from "./MemberTableHeader";
import { UserDetailsModal } from "./UserDetailsModal";
import { useState, useMemo, useCallback } from "react";
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

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const filteredProfiles = useMemo(() => filterProfiles(
    profilesWithBankingInfo || [],
    searchQuery,
    gradeFilter,
    serviceFilter,
    directionFilter
  ), [profilesWithBankingInfo, searchQuery, gradeFilter, serviceFilter, directionFilter]);

  const sortedProfiles = useMemo(() => sortProfiles(
    filteredProfiles,
    sortColumn,
    sortDirection
  ), [filteredProfiles, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProfiles = useMemo(() => 
    sortedProfiles.slice(startIndex, startIndex + itemsPerPage),
    [sortedProfiles, startIndex, itemsPerPage]
  );

  const handleRowClick = useCallback((profile: Profile) => {
    setSelectedUser(profile);
    setModalOpen(true);
  }, []);

  const handleModalOpenChange = useCallback(async (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      await refetch();
    }
  }, [refetch]);

  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

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