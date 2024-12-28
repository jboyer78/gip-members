interface CardBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export const CardBackground = ({ imageUrl, children }: CardBackgroundProps) => {
  return (
    <div className="relative h-full">
      <img 
        src={imageUrl} 
        alt="Card background" 
        className="absolute inset-1 sm:inset-2 w-[calc(100%-0.5rem)] sm:w-[calc(100%-1rem)] h-[calc(100%-0.5rem)] sm:h-[calc(100%-1rem)] object-contain rounded-xl"
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};