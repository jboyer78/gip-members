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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

  const handleRowClick = (profile: Profile) => {
    setSelectedUser(profile);
    setModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

  const filteredProfiles = profiles?.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.email?.toLowerCase().includes(searchLower) ||
      profile.grade?.toLowerCase().includes(searchLower) ||
      profile.assignment_service?.toLowerCase().includes(searchLower) ||
      profile.assignment_direction?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = filteredProfiles ? Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProfiles = filteredProfiles?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Rechercher un membre..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Réinitialiser la page lors d'une nouvelle recherche
          }}
        />
      </div>

      <ScrollArea className="h-[600px] rounded-md">
        <Table>
          <MemberTableHeader />
          <TableBody>
            {displayedProfiles?.map((profile) => (
              <MemberTableRow 
                key={profile.id} 
                profile={profile} 
                onRowClick={handleRowClick}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="py-2 px-4">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      <UserDetailsModal 
        user={selectedUser}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};