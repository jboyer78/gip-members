import { EditButton } from "./actions/EditButton";
import { DeleteButton } from "./actions/DeleteButton";
import { AdminToggle } from "./actions/AdminToggle";

interface MemberActionsProps {
  profileId: string;
  isAdmin: boolean;
}

export const MemberActions = ({ profileId, isAdmin }: MemberActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <EditButton profileId={profileId} />
      <DeleteButton profileId={profileId} />
      <AdminToggle profileId={profileId} initialStatus={isAdmin} />
    </div>
  );
};