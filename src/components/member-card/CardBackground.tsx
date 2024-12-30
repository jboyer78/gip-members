interface CardBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
}

export const CardBackground = ({ imageUrl, children }: CardBackgroundProps) => {
  console.log('CardBackground rendering with imageUrl:', imageUrl);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image load event triggered');
    const target = e.target as HTMLImageElement;
    console.log('Image natural dimensions:', {
      width: target.naturalWidth,
      height: target.naturalHeight
    });
    console.log('Image display dimensions:', {
      width: target.width,
      height: target.height
    });

    requestAnimationFrame(() => {
      console.log('First RAF - setting opacity to 0.99');
      target.style.opacity = '0.99';
      requestAnimationFrame(() => {
        console.log('Second RAF - setting opacity to 1');
        target.style.opacity = '1';
      });
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', {
      src: e.currentTarget.src,
      error: e
    });
  };

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
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};