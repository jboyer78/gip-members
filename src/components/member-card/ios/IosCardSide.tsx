import { CardSide } from "../CardSide";
import { Profile } from "@/integrations/supabase/types/profile";
import { FrontCard } from "../FrontCard";
import { BackCard } from "../BackCard";
import { useEffect, useState } from "react";

interface IosCardSideProps {
  type: "front" | "back";
  profile: Profile;
  publicCardUrl?: string;
  backgroundImage: string;
}

export const IosCardSide = ({ type, profile, publicCardUrl, backgroundImage }: IosCardSideProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Précharger l'image
    const img = new Image();
    img.onload = () => {
      console.log(`Background image loaded successfully: ${backgroundImage}`);
      setIsImageLoaded(true);
    };
    img.onerror = (e) => {
      console.error(`Error loading background image: ${backgroundImage}`, e);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  return (
    <CardSide>
      <div className="relative w-full h-full">
        {isImageLoaded && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${backgroundImage}')`,
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: 'translate3d(0, 0, 0)',
              WebkitPerspective: '1000',
              opacity: isImageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        )}
        <div className="relative z-10">
          {type === "front" ? (
            <FrontCard profile={profile} />
          ) : (
            <BackCard profile={profile} publicCardUrl={publicCardUrl || ""} />
          )}
        </div>
      </div>
    </CardSide>
  );
};