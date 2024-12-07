import { Profile } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { MemberProgressBar } from "./MemberProgressBar";
import { MemberActions } from "./MemberActions";
import { calculateAge, calculateCompletionPercentage, calculateProfessionalCompletionPercentage } from "./utils/profileCalculations";

interface MemberTableRowProps {
  profile: Profile;
  onRowClick: (profile: Profile) => void;
}

export const MemberTableRow = ({ profile, onRowClick }: MemberTableRowProps) => {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onRowClick(profile)}
    >
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url || ''} />
          <AvatarFallback>
            {profile.first_name && profile.last_name 
              ? `${profile.first_name[0]}${profile.last_name[0]}`
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>{profile.first_name || '-'}</TableCell>
      <TableCell>{profile.last_name || '-'}</TableCell>
      <TableCell>{profile.email || '-'}</TableCell>
      <TableCell>{calculateAge(profile.birth_date)}</TableCell>
      <TableCell>{profile.grade || '-'}</TableCell>
      <TableCell>{profile.assignment_service || '-'}</TableCell>
      <TableCell>{profile.assignment_direction || '-'}</TableCell>
      <TableCell className="w-32">
        <MemberProgressBar value={calculateCompletionPercentage(profile)} />
      </TableCell>
      <TableCell className="w-32">
        <MemberProgressBar value={calculateProfessionalCompletionPercentage(profile)} />
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <MemberActions profileId={profile.id} />
      </TableCell>
    </TableRow>
  );
};