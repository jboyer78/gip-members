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
    // Précharger l'image avec un cache buster pour iOS
    const img = new Image();
    const cacheBustedUrl = `${backgroundImage}?cache=${Date.now()}`;
    
    img.onload = () => {
      console.log(`Background image loaded successfully: ${cacheBustedUrl}`, {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      setIsImageLoaded(true);
    };
    
    img.onerror = (e) => {
      console.error(`Error loading background image: ${cacheBustedUrl}`, e);
    };
    
    img.src = cacheBustedUrl;
  }, [backgroundImage]);

  return (
    <CardSide>
      <div className="relative w-full h-full overflow-hidden">
        {isImageLoaded && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url('${backgroundImage}?cache=${Date.now()}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: '1000',
              WebkitTransformStyle: 'preserve-3d',
              WebkitOverflowScrolling: 'touch',
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