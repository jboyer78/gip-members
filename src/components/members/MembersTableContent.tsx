import { TableBody } from "@/components/ui/table";
import { Profile } from "@/integrations/supabase/types/profile";
import { MemberTableRow } from "./MemberTableRow";

interface MembersTableContentProps {
  displayedProfiles: Profile[];
  onRowClick: (profile: Profile) => void;
}

export const MembersTableContent = ({ displayedProfiles, onRowClick }: MembersTableContentProps) => {
  return (
    <TableBody>
      {displayedProfiles.map((profile) => (
        <MemberTableRow 
          key={profile.id} 
          profile={profile} 
          onRowClick={onRowClick}
        />
      ))}
    </TableBody>
  );
};