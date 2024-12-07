import { Profile } from "@/integrations/supabase/types/profile";
import { StatusDisplay } from "./status/StatusDisplay";
import { StatusUpdateForm } from "./status/StatusUpdateForm";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatusDisplay currentStatus={user.status?.[0]} />
      </div>
      <StatusUpdateForm user={user} />
    </div>
  );
};