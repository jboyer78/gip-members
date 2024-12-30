interface CardBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export const CardBackground = ({ imageUrl, children }: CardBackgroundProps) => {
  return (
    <div className="relative h-full">
      <div className="absolute inset-1 sm:inset-2">
        <img 
          src={imageUrl} 
          alt="Card background" 
          className="w-full h-full object-contain"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            WebkitTransform: 'translate3d(0,0,0)', // Force GPU acceleration on iOS
          }}
        />
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};