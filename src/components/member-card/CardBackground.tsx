interface CardBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export const CardBackground = ({ imageUrl, children }: CardBackgroundProps) => {
  return (
    <div className="relative h-full">
      <div 
        className="absolute inset-1 sm:inset-2"
        style={{
          transform: 'translateZ(0)', // Force GPU acceleration
          backfaceVisibility: 'hidden', // Prevent flickering
          perspective: 1000, // Enhance 3D rendering
          willChange: 'transform' // Hint to browser about animation
        }}
      >
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
            WebkitTransform: 'translateZ(0)', // iOS specific GPU acceleration
            WebkitBackfaceVisibility: 'hidden', // iOS specific anti-flickering
            WebkitPerspective: 1000, // iOS specific 3D context
          }}
          loading="eager" // Prioritize loading
        />
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};