import { SearchFilter } from "./SearchFilter";
import { SelectFilter } from "./SelectFilter";
import { Profile } from "@/integrations/supabase/types/profile";

interface MembersFiltersProps {
  profiles: Profile[] | null;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  gradeFilter: string;
  setGradeFilter: (value: string) => void;
  serviceFilter: string;
  setServiceFilter: (value: string) => void;
  directionFilter: string;
  setDirectionFilter: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

export const MembersFilters = ({
  profiles,
  searchQuery,
  setSearchQuery,
  gradeFilter,
  setGradeFilter,
  serviceFilter,
  setServiceFilter,
  directionFilter,
  setDirectionFilter,
  setCurrentPage,
}: MembersFiltersProps) => {
  const uniqueGrades = Array.from(new Set(profiles?.map(p => p.grade).filter(Boolean) || []));
  const uniqueServices = Array.from(new Set(profiles?.map(p => p.assignment_service).filter(Boolean) || []));
  const uniqueDirections = Array.from(new Set(profiles?.map(p => p.assignment_direction).filter(Boolean) || []));

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <SearchFilter 
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectFilter
          value={gradeFilter || "all"}
          onChange={handleFilterChange(setGradeFilter)}
          placeholder="Filtrer par grade"
          options={uniqueGrades}
          allLabel="Tous les grades"
        />

        <SelectFilter
          value={serviceFilter || "all"}
          onChange={handleFilterChange(setServiceFilter)}
          placeholder="Filtrer par service"
          options={uniqueServices}
          allLabel="Tous les services"
        />

        <SelectFilter
          value={directionFilter || "all"}
          onChange={handleFilterChange(setDirectionFilter)}
          placeholder="Filtrer par direction"
          options={uniqueDirections}
          allLabel="Toutes les directions"
        />
      </div>
    </div>
  );
};