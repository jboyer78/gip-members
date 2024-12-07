import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/integrations/supabase/types/profile";
import { MemberTableHeader } from "./MemberTableHeader";
import { MemberTableRow } from "./MemberTableRow";
import { UserDetailsModal } from "./UserDetailsModal";
import { useState } from "react";
import { MembersFilters } from "./filters/MembersFilters";
import { MembersPagination } from "./pagination/MembersPagination";
import { filterProfiles } from "./utils/filterProfiles";

interface MembersTableProps {
  profiles: Profile[] | null;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 10;

export const MembersTable = ({ profiles, isLoading }: MembersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [directionFilter, setDirectionFilter] = useState<string>("");

  const handleRowClick = (profile: Profile) => {
    setSelectedUser(profile);
    setModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

  const filteredProfiles = filterProfiles(
    profiles,
    searchQuery,
    gradeFilter,
    serviceFilter,
    directionFilter
  );

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

      <ScrollArea className="h-[600px] rounded-md">
        <Table>
          <MemberTableHeader />
          <TableBody>
            {displayedProfiles.map((profile) => (
              <MemberTableRow 
                key={profile.id} 
                profile={profile} 
                onRowClick={handleRowClick}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <UserDetailsModal 
        user={selectedUser}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};