import { Profile } from "@/integrations/supabase/types/profile";
import { CardBackground } from "./CardBackground";
import "./FrontCard.css";

interface FrontCardProps {
  profile: Profile;
}

export const FrontCard = ({ profile }: FrontCardProps) => {
  return (
    <CardBackground imageUrl="https://gip-members.lovable.app/lovable-uploads/7fabfc2f-74f0-42fe-b42e-d38ff0226691.png">
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
          <div className="photo-container absolute top-[12.75rem] sm:top-[11rem] right-8 sm:right-7 w-20 h-24 sm:h-40 md:h-56 bg-gray-100 overflow-hidden sm:w-32 md:w-48 border border-black">
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
    </CardBackground>
  );
};