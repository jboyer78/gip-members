import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MemberCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de votre carte de membre...</p>
        </div>
      </div>
    );
  }

  if (!profile?.member_number) {
    toast({
      title: "Accès refusé",
      description: "Vous devez avoir un numéro d'adhérent pour accéder à votre carte de membre.",
      variant: "destructive",
    });
    navigate('/profile');
    return null;
  }

  const publicCardUrl = `${window.location.origin}/public-card/${profile.id}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Front of the card */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative overflow-hidden">
        <img 
          src="/lovable-uploads/8f64e4d3-cf3b-4b84-8737-cb5ad454a25e.png" 
          alt="Card background" 
          className="absolute inset-0 w-full h-full object-cover"
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative overflow-hidden">
        <img 
          src="/lovable-uploads/d8b51032-d815-4569-9886-afa10e6e9002.png" 
          alt="Card background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <p><span className="font-semibold">Adresse :</span></p>
              <p>{profile.street}</p>
              <p>{profile.postal_code} {profile.city}</p>
              <p>{profile.country}</p>
              <p><span className="font-semibold">E-mail :</span> {profile.email}</p>
              <p><span className="font-semibold">Téléphone :</span> {profile.phone_mobile || profile.phone_home}</p>
            </div>
          </div>
          <div>
            <QRCodeSVG 
              value={publicCardUrl}
              size={128}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;