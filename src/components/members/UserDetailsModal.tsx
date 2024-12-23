import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Profile } from "@/integrations/supabase/types/profile";
import { UserDetailsHeader } from "./modal/UserDetailsHeader";
import { UserDetailsTabs } from "./modal/UserDetailsTabs";
import { useUserDetails } from "./modal/useUserDetails";

interface UserDetailsModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export const UserDetailsModal = ({ 
  user: initialUser, 
  open, 
  onOpenChange,
  onUpdate 
}: UserDetailsModalProps) => {
  const { user, handleProfileUpdate } = useUserDetails({
    initialUser,
    open,
    onUpdate
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] max-h-[95vh] md:max-h-[90vh] w-full md:w-[1200px] overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-200 ease-in-out">
        <UserDetailsHeader user={user} />
        <UserDetailsTabs user={user} onUpdate={handleProfileUpdate} />
      </DialogContent>
    </Dialog>
  );
};