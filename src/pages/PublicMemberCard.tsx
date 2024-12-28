import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PublicMemberCard = () => {
  const { id } = useParams();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, member_number, avatar_url')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Carte de membre non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative overflow-hidden">
        <img 
          src="/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png" 
          alt="Card background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold"></h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Nom :</span> {profile.last_name}</p>
                <p><span className="font-semibold">Prénom :</span> {profile.first_name}</p>
                <p><span className="font-semibold">N°adhérent :</span> {profile.member_number}</p>
              </div>
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  PHOTO
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMemberCard;