import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInYears } from "date-fns";
import { MemberProgressBar } from "./MemberProgressBar";
import { MemberActions } from "./MemberActions";
import { Profile } from "@/integrations/supabase/types";

interface MembersTableProps {
  profiles: Profile[] | null;
  isLoading: boolean;
}

export const MembersTable = ({ profiles, isLoading }: MembersTableProps) => {
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return '-';
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const calculateCompletionPercentage = (profile: Profile) => {
    const personalFields = [
      'first_name',
      'last_name',
      'birth_date',
      'birth_city',
      'birth_department',
      'blood_type',
      'marital_status',
      'children_count',
      'phone_home',
      'phone_mobile',
      'email',
      'street',
      'postal_code',
      'city',
      'country'
    ];

    const filledFields = personalFields.filter(field => 
      profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== ''
    );

    return Math.round((filledFields.length / personalFields.length) * 100);
  };

  const calculateProfessionalCompletionPercentage = (profile: Profile) => {
    const professionalFields = [
      'status',
      'administration',
      'administration_entry_date',
      'training_site',
      'grade',
      'assignment_direction',
      'assignment_service',
      'professional_document_url'
    ];

    const filledFields = professionalFields.filter(field => {
      if (field === 'status') {
        return profile[field] && profile[field].length > 0;
      }
      return profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== '';
    });

    return Math.round((filledFields.length / professionalFields.length) * 100);
  };

  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

  return (
    <ScrollArea className="h-[600px] rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Âge</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Informations personnelles</TableHead>
            <TableHead>Informations professionnelles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.id}>
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
              <TableCell>
                <MemberActions profileId={profile.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};