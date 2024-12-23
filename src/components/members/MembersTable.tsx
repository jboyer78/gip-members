import React, { useState } from "react";
import { MembersPagination } from "@/components/members/pagination/MembersPagination";
import { MembersFilters } from "@/components/members/filters/MembersFilters";
import { Profile } from "@/integrations/supabase/types/profile";

interface MembersTableProps {
  profiles: Profile[] | null;
  isLoading: boolean;
}

export const MembersTable = ({ profiles, isLoading }: MembersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Changed default value to 50
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = profile.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          profile.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter ? profile.grade === gradeFilter : true;
    const matchesService = serviceFilter ? profile.assignment_service === serviceFilter : true;
    const matchesDirection = directionFilter ? profile.assignment_direction === directionFilter : true;

    return matchesSearch && matchesGrade && matchesService && matchesDirection;
  });

  const totalPages = Math.ceil((filteredProfiles?.length || 0) / itemsPerPage);
  const paginatedProfiles = filteredProfiles?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
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

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Grade</th>
              <th>Service</th>
              <th>Direction</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProfiles?.map(profile => (
              <tr key={profile.id}>
                <td>{profile.first_name}</td>
                <td>{profile.last_name}</td>
                <td>{profile.grade}</td>
                <td>{profile.assignment_service}</td>
                <td>{profile.assignment_direction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={filteredProfiles?.length || 0}
      />
    </div>
  );
};
