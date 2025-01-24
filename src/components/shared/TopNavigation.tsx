import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export function TopNavigation() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex items-center gap-3">
      <button className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300">
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      <Link to="/profile">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ''} />
          <AvatarFallback>
            {profile?.first_name && profile?.last_name 
              ? `${profile.first_name[0]}${profile.last_name[0]}`
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}