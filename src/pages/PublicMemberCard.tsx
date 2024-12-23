import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";

const PublicMemberCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { memberNumber } = useParams();

  useEffect(() => {
    const getProfile = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("member_number", memberNumber)
        .single();

      setProfile(profile);
    };

    if (memberNumber) {
      getProfile();
    }
  }, [memberNumber]);

  if (!profile) return <div className="p-8">Carte non trouvée</div>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-8">Carte d'adhérent - {profile.member_number}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recto */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Recto</h2>
          <div className="relative">
            <img 
              src="/lovable-uploads/a98bf3ea-1e39-4268-bd9b-6d0f6b19f6fc.png" 
              alt="Carte d'adhérent recto"
              className="w-full h-auto"
            />
            <div className="absolute top-[65%] left-28 right-8 text-black space-y-2">
              <p className="uppercase">{profile.last_name}</p>
              <p className="uppercase -mt-6 ml-6">{profile.first_name}</p>
              <p>{profile.member_number}</p>
            </div>
            {profile.avatar_url && (
              <div className="absolute top-[85px] right-[32px] w-[128px] h-[160px] overflow-hidden">
                <img 
                  src={profile.avatar_url} 
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Verso */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Verso</h2>
          <div className="relative">
            <img 
              src="/lovable-uploads/11bd045a-89e5-4a4a-8f43-f1047f9c5b9c.png" 
              alt="Carte d'adhérent verso"
              className="w-full h-auto"
            />
            <div className="absolute top-[48px] left-8 right-8 text-black space-y-2">
              <p>{profile.street}</p>
              <p>{profile.postal_code} {profile.city}</p>
              <p>{profile.country}</p>
              <p className="mt-4">{profile.email}</p>
              <p>{profile.phone_mobile || profile.phone_home}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMemberCard;