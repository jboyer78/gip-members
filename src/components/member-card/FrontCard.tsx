import { Profile } from "@/integrations/supabase/types/profile";
import { CardBackground } from "./CardBackground";

interface FrontCardProps {
  profile: Profile;
}

export const FrontCard = ({ profile }: FrontCardProps) => {
  return (
    <CardBackground imageUrl="/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png">
      <div className="flex flex-col h-full">
        <div className="flex-1 relative">
          <div className="absolute top-[65%] left-28 space-y-1 transform scale-90 sm:scale-100 origin-top-left">
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-semibold">Nom :</span> {profile.last_name}
            </p>
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-semibold">Prénom :</span> {profile.first_name}
            </p>
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-semibold">N°adhérent :</span> {profile.member_number}
            </p>
          </div>
          <div className="absolute top-[7.75rem] right-20 sm:right-24 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gray-100 overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Photo de profil" 
                className="w-full h-full object-cover border-2 border-black rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                PHOTO
              </div>
            )}
          </div>
        </div>
      </div>
    </CardBackground>
  );
};