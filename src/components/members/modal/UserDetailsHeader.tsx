import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/integrations/supabase/types/profile";

interface UserDetailsHeaderProps {
  user: Profile;
}

export const UserDetailsHeader = ({ user }: UserDetailsHeaderProps) => {
  return (
    <DialogHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
      <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-primary/10 transition-all duration-200">
        <AvatarImage src={user.avatar_url || ''} className="object-cover" />
        <AvatarFallback className="text-lg md:text-xl bg-primary/5">
          {user.first_name && user.last_name 
            ? `${user.first_name[0]}${user.last_name[0]}`
            : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <DialogTitle className="text-2xl md:text-3xl font-semibold">
          {user.first_name} {user.last_name}
        </DialogTitle>
        <p className="text-sm text-muted-foreground">
          N° Adhérent: {user.member_number || 'Non défini'}
        </p>
      </div>
    </DialogHeader>
  );
};