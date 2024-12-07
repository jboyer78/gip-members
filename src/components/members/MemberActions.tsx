import { EditButton } from "./actions/EditButton";
import { DeleteButton } from "./actions/DeleteButton";
import { AdminToggle } from "./actions/AdminToggle";
import { BanButton } from "./actions/BanButton";

interface MemberActionsProps {
  profileId: string;
  isAdmin: boolean;
  isBanned: boolean;
}

export const MemberActions = ({ profileId, isAdmin, isBanned }: MemberActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <EditButton profileId={profileId} />
      <DeleteButton profileId={profileId} />
      <AdminToggle profileId={profileId} initialStatus={isAdmin} />
      <BanButton profileId={profileId} isBanned={isBanned} />
    </div>
  );
};