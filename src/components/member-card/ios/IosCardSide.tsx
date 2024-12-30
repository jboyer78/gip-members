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
    const img = new Image();
    const timestamp = Date.now();
    const cacheBustedUrl = `${backgroundImage}?t=${timestamp}`;
    
    img.onload = () => {
      console.log('iOS background image loaded successfully:', {
        url: cacheBustedUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      setIsImageLoaded(true);
    };
    
    img.onerror = (error) => {
      console.error('iOS background image failed to load:', {
        url: cacheBustedUrl,
        error
      });
    };
    
    img.src = cacheBustedUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [backgroundImage]);

  return (
    <CardSide>
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        {isImageLoaded && (
          <img 
            src={`${backgroundImage}?t=${Date.now()}`}
            alt="Card background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: 'translate3d(0,0,0)',
              WebkitTransform: 'translate3d(0,0,0)',
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: '1000px',
              WebkitTransformStyle: 'preserve-3d',
              opacity: 1,
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