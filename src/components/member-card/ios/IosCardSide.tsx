import { CardSide } from "../CardSide";
import { Profile } from "@/integrations/supabase/types/profile";
import { FrontCard } from "../FrontCard";
import { BackCard } from "../BackCard";

interface IosCardSideProps {
  type: "front" | "back";
  profile: Profile;
  publicCardUrl?: string;
  backgroundImage: string;
}

export const IosCardSide = ({ type, profile, publicCardUrl, backgroundImage }: IosCardSideProps) => {
  return (
    <CardSide>
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            WebkitBackfaceVisibility: 'hidden',
            WebkitTransform: 'translate3d(0, 0, 0)',
            WebkitPerspective: '1000',
          }}
        />
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