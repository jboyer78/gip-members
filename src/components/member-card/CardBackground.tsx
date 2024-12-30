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
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', {
      src: e.currentTarget.src,
      error: e
    });
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-1 sm:inset-2 overflow-hidden rounded-lg">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'translate3d(0,0,0)',
            WebkitTransform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            perspective: '1000px',
            WebkitPerspective: '1000px',
            WebkitOverflowScrolling: 'touch',
          }}
        />
        <img 
          src={imageUrl} 
          alt="Card background" 
          className="opacity-0 absolute inset-0 w-full h-full"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
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