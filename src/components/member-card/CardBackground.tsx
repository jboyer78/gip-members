interface CardBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export const CardBackground = ({ imageUrl, children }: CardBackgroundProps) => {
  return (
    <div className="relative h-full">
      <div className="absolute inset-1 sm:inset-2 overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Card background" 
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            WebkitTransform: 'translate3d(0,0,0)',
            WebkitBackfaceVisibility: 'hidden',
            WebkitPerspective: '1000px',
            WebkitTransformStyle: 'preserve-3d',
            WebkitOverflowScrolling: 'touch',
          }}
          loading="eager"
          decoding="sync"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            requestAnimationFrame(() => {
              target.style.opacity = '0.99';
              requestAnimationFrame(() => {
                target.style.opacity = '1';
              });
            });
          }}
        />
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};