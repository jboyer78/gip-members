import { Profile } from "@/integrations/supabase/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { MemberProgressBar } from "./MemberProgressBar";
import { MemberActions } from "./MemberActions";
import { calculateAge, calculateCompletionPercentage, calculateProfessionalCompletionPercentage } from "./utils/profileCalculations";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MemberTableRowProps {
  profile: Profile;
  onRowClick: (profile: Profile) => void;
}

export const MemberTableRow = ({ profile, onRowClick }: MemberTableRowProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss", { locale: fr });
  };

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
      <TableCell className="flex items-center gap-2">
        {profile.email || '-'}
        {profile.email && (
          profile.email_verified ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )
        )}
      </TableCell>
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
      <TableCell>{formatDate(profile.created_at)}</TableCell>
      <TableCell>{formatDate(profile.updated_at)}</TableCell>
      <TableCell>
        {profile.banned_at ? (
          <span className="text-red-500">{formatDate(profile.banned_at)}</span>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <MemberActions profileId={profile.id} isAdmin={profile.is_admin || false} />
      </TableCell>
    </TableRow>
  );
};