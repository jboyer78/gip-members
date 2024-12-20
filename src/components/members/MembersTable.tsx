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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: profilesWithBankingInfo, refetch } = useQuery({
    queryKey: ['profiles-with-banking'],
    queryFn: async () => {
      console.log("Fetching profiles with banking info...");
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          banking_info (*)
        `)
        .order('updated_at', { ascending: false })
        .order('last_name', { ascending: true })
        .order('first_name', { ascending: true });

      if (error) {
        console.error("Error fetching profiles with banking info:", error);
        throw error;
      }

      console.log("Profiles with banking info:", profiles);
      return profiles;
    },
    enabled: !isLoading && !!profiles
  });

  console.log("Raw profiles data:", profilesWithBankingInfo);

  const handleRowClick = (profile: Profile) => {
    console.log("Row clicked, profile:", profile);
    setSelectedUser(profile);
    setModalOpen(true);
  };

  const handleProfileUpdate = async () => {
    console.log("Refetching profiles data after update...");
    await refetch();
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

  console.log("Filtered profiles:", filteredProfiles);

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  console.log("Displayed profiles:", displayedProfiles);

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
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};