import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";

const MemberCard = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  const publicCardUrl = `${window.location.origin}/public-card/${profile.id}`;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Ma carte de membre</h1>
              <Button onClick={() => setIsFlipped(!isFlipped)}>
                {isFlipped ? "Voir le recto" : "Voir le verso"}
              </Button>
            </div>

            <div className="relative perspective-1000">
              <div className={`relative transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front of the card */}
                <div className={`bg-white rounded-xl shadow-xl p-8 ${isFlipped ? 'hidden' : ''}`}>
                  <img 
                    src="/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png" 
                    alt="Card background" 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold">CARTE D'ADHÉRENT</h2>
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

                {/* Back of the card */}
                <div className={`bg-white rounded-xl shadow-xl p-8 ${!isFlipped ? 'hidden' : ''}`}>
                  <img 
                    src="/lovable-uploads/c22c59c8-c1b1-4a6e-90f6-6039957c2112.png" 
                    alt="Card background" 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-semibold">Adresse :</span> {profile.street}</p>
                      <p><span className="font-semibold">Code postal :</span> {profile.postal_code}</p>
                      <p><span className="font-semibold">Ville :</span> {profile.city}</p>
                      <p><span className="font-semibold">Pays :</span> {profile.country}</p>
                      <p><span className="font-semibold">Email :</span> {profile.email}</p>
                      <p><span className="font-semibold">Téléphone :</span> {profile.phone_mobile || profile.phone_home}</p>
                    </div>
                    <div className="flex justify-end items-center">
                      <QRCodeSVG 
                        value={publicCardUrl}
                        size={128}
                        level="H"
                        className="bg-white p-2 rounded"
                      />
                    </div>
                  </div>
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