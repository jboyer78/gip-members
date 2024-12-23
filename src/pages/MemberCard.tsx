import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/integrations/supabase/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Ma carte d'adhérent</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Votre carte d'adhérent numérique</p>
              </div>
            </div>
          </div>

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
                  <p className="mt-8">{profile.country}</p>
                  <p className="mt-4">{profile.email}</p>
                  <p>{profile.phone_mobile || profile.phone_home}</p>
                </div>
                <div className="absolute top-[40px] right-8 w-32 h-32">
                  <QRCodeSVG
                    value={cardUrl}
                    size={128}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MemberCard;