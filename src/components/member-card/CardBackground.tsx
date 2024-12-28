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
        className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain rounded-xl"
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};