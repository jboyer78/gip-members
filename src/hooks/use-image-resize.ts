interface ImageResizeOptions {
  maxSize: number;
  minSize?: number;
  quality?: number;
}

export const useImageResize = () => {
  const resizeImage = async (
    file: File,
    { maxSize, minSize = 128, quality = 0.95 }: ImageResizeOptions
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Vérifier la taille minimale
          if (width < minSize || height < minSize) {
            reject(new Error(`L'image doit faire au moins ${minSize}x${minSize} pixels`));
            return;
          }

          // Calculer les nouvelles dimensions en préservant le ratio
          const aspectRatio = width / height;

          if (width > height) {
            if (width > maxSize) {
              width = maxSize;
              height = Math.round(width / aspectRatio);
            }
          } else {
            if (height > maxSize) {
              height = maxSize;
              width = Math.round(height * aspectRatio);
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }

          // Améliorer la qualité du rendu
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Échec du redimensionnement de l\'image'));
              }
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      };
      
      reader.onerror = (error) => reject(error);
    });
  };

  return { resizeImage };
};