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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 pl-9 sm:pl-28">
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Adresse :</span> {profile.street}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Code postal :</span> {profile.postal_code}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Ville :</span> {profile.city}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Pays :</span> {profile.country}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Email :</span> {profile.email}</p>
          <p className="text-sm sm:text-sm md:text-base"><span className="font-semibold">Téléphone :</span> {profile.phone_mobile || profile.phone_home}</p>
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
    </CardBackground>
  );
};