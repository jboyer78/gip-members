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
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          willChange: 'transform',
          WebkitTransform: 'translate3d(0,0,0)',
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: '1000px',
          WebkitTransformStyle: 'preserve-3d',
          WebkitOverflowScrolling: 'touch',
          WebkitCompositingReasons: 'transform',
        }}
      >
        {/* Hidden img tag for preloading and fallback */}
        <img 
          src={imageUrl} 
          alt="Card background" 
          className="hidden"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
          }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          onLoad={(e) => {
            // Force repaint on image load
            const target = e.target as HTMLImageElement;
            target.style.opacity = '0.99';
            setTimeout(() => {
              target.style.opacity = '1';
            }, 0);
          }}
        />
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};