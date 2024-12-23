import { Profile } from "@/integrations/supabase/types/profile";

export const sortProfiles = (
  profiles: Profile[], 
  sortColumn: string | null, 
  sortDirection: 'asc' | 'desc' | null
) => {
  if (!sortColumn || !sortDirection) return profiles;

  return [...profiles].sort((a, b) => {
    const aValue = a[sortColumn as keyof Profile];
    const bValue = b[sortColumn as keyof Profile];

    if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

    // Handle date fields specifically
    if (sortColumn === 'birth_date' || sortColumn === 'created_at' || sortColumn === 'updated_at' || sortColumn === 'banned_at') {
      const dateA = aValue ? new Date(aValue as string).getTime() : 0;
      const dateB = bValue ? new Date(bValue as string).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // Handle boolean values
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection === 'asc' 
        ? (aValue === bValue ? 0 : aValue ? 1 : -1)
        : (aValue === bValue ? 0 : aValue ? -1 : 1);
    }

    // Handle arrays (like status)
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      const strA = aValue.join(',');
      const strB = bValue.join(',');
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB, 'fr')
        : strB.localeCompare(strA, 'fr');
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue, 'fr')
        : bValue.localeCompare(aValue, 'fr');
    }

    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }

    // Default comparison for other types
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue), 'fr')
      : String(bValue).localeCompare(String(aValue), 'fr');
  });
};