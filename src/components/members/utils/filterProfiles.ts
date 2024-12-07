import { Profile } from "@/integrations/supabase/types/profile";

export const filterProfiles = (
  profiles: Profile[] | null,
  searchQuery: string,
  gradeFilter: string,
  serviceFilter: string,
  directionFilter: string
): Profile[] => {
  if (!profiles) return [];

  return profiles.filter((profile) => {
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
};