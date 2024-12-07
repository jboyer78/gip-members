import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/integrations/supabase/types/profile";
import { MemberTableHeader } from "./MemberTableHeader";
import { MemberTableRow } from "./MemberTableRow";

interface MembersTableProps {
  profiles: Profile[] | null;
  isLoading: boolean;
}

export const MembersTable = ({ profiles, isLoading }: MembersTableProps) => {
  if (isLoading) {
    return <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>;
  }

  return (
    <ScrollArea className="h-[600px] rounded-md">
      <Table>
        <MemberTableHeader />
        <TableBody>
          {profiles?.map((profile) => (
            <MemberTableRow key={profile.id} profile={profile} />
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};