import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const MemberCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile?.member_number) {
        toast.error("Vous devez avoir un numéro d'adhérent pour accéder à votre carte");
        navigate("/profile");
        return;
      }

      setProfile(profile);
    };

    getProfile();
  }, [navigate]);

  if (!profile) return null;

  const cardUrl = `${window.location.origin}/card/${profile.member_number}`;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-8">Ma carte d'adhérent</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recto */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <h2 className="text-xl font-semibold mb-6">Recto</h2>
          <div className="relative">
            <img 
              src="/lovable-uploads/a98bf3ea-1e39-4268-bd9b-6d0f6b19f6fc.png" 
              alt="Carte d'adhérent recto"
              className="w-full h-auto"
            />
            <div className="absolute top-[65%] left-48 right-8 text-black">
              <p className="uppercase mb-0">{profile.last_name}</p>
              <p className="uppercase mt-0">{profile.first_name}</p>
              <p className="mt-0">{profile.member_number}</p>
            </div>
            {profile.avatar_url && (
              <div className="absolute top-[130px] right-[55px] w-[148px] h-[180px] overflow-hidden">
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
            <div className="absolute top-[35px] left-32 right-8 text-black space-y-0">
              <p className="mb-0">{profile.street}</p>
              <p className="mt-0 mb-0">{profile.postal_code} {profile.city}</p>
              <p className="-mt-1">{profile.country}</p>
              <p className="mt-4">{profile.email}</p>
              <p>{profile.phone_mobile || profile.phone_home}</p>
            </div>
            <div className="absolute top-[48px] right-8 w-32 h-32">
              <QRCodeSVG
                value={cardUrl}
                size={128}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;