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
          <div className="absolute top-[55%] sm:top-[65%] left-9 sm:left-28 space-y-0.5 sm:space-y-1 transform scale-[0.70] sm:scale-90 md:scale-100 origin-top-left">
            <p className="text-sm sm:text-sm md:text-base">
              <span className="font-semibold">Nom :</span> {profile.last_name?.toUpperCase()}
            </p>
            <p className="text-sm sm:text-sm md:text-base">
              <span className="font-semibold">Prénom :</span> {profile.first_name?.toUpperCase()}
            </p>
            <p className="text-sm sm:text-sm md:text-base">
              <span className="font-semibold">N°adhérent :</span> {profile.member_number}
            </p>
          </div>
          <div className="absolute top-[12.5rem] sm:top-[8.75rem] right-7 sm:right-32 md:right-28 w-20 sm:w-28 md:w-40 h-24 sm:h-36 md:h-48 bg-gray-100 overflow-hidden">
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