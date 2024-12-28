import { Profile } from "@/integrations/supabase/types/profile";
import { QRCodeSVG } from "qrcode.react";
import { CardBackground } from "./CardBackground";

interface BackCardProps {
  profile: Profile;
  publicCardUrl: string;
}

export const BackCard = ({ profile, publicCardUrl }: BackCardProps) => {
  return (
    <CardBackground imageUrl="/lovable-uploads/c22c59c8-c1b1-4a6e-90f6-6039957c2112.png">
      <div className="relative h-full">
        <div className="absolute top-[35%] sm:top-[45%] left-9 sm:left-28 space-y-0.5 sm:space-y-1 transform scale-[0.70] sm:scale-90 md:scale-100 origin-top-left">
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Adresse :</span> {profile.street}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Code postal :</span> {profile.postal_code}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Ville :</span> {profile.city}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Pays :</span> {profile.country}</p>
          <div className="h-4" />
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Email :</span> {profile.email}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Téléphone :</span> {profile.phone_mobile || profile.phone_home}</p>
        </div>
        <div className="absolute top-[35%] sm:top-[45%] right-7 sm:right-16">
          <QRCodeSVG 
            value={publicCardUrl}
            size={117}
            level="H"
            className="bg-white p-2 rounded transform scale-75 sm:scale-90 md:scale-100"
          />
        </div>
      </div>
    </CardBackground>
  );
};