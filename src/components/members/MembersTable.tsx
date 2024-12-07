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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Get unique values for filters
  const uniqueGrades = Array.from(new Set(profiles?.map(p => p.grade).filter(Boolean) || []));
  const uniqueServices = Array.from(new Set(profiles?.map(p => p.assignment_service).filter(Boolean) || []));
  const uniqueDirections = Array.from(new Set(profiles?.map(p => p.assignment_direction).filter(Boolean) || []));

  const filteredProfiles = profiles?.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.email?.toLowerCase().includes(searchLower) ||
      profile.grade?.toLowerCase().includes(searchLower) ||
      profile.assignment_service?.toLowerCase().includes(searchLower) ||
      profile.assignment_direction?.toLowerCase().includes(searchLower);

    const matchesGrade = !gradeFilter || profile.grade === gradeFilter;
    const matchesService = !serviceFilter || profile.assignment_service === serviceFilter;
    const matchesDirection = !directionFilter || profile.assignment_direction === directionFilter;

    return matchesSearch && matchesGrade && matchesService && matchesDirection;
  });

  const totalPages = filteredProfiles ? Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProfiles = filteredProfiles?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un membre..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={gradeFilter} onValueChange={(value) => { setGradeFilter(value); setCurrentPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les grades</SelectItem>
              {uniqueGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={(value) => { setServiceFilter(value); setCurrentPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={directionFilter} onValueChange={(value) => { setDirectionFilter(value); setCurrentPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les directions</SelectItem>
              {uniqueDirections.map((direction) => (
                <SelectItem key={direction} value={direction}>{direction}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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