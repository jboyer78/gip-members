interface ImageResizeOptions {
  maxSize: number;
  quality?: number;
}

export const useImageResize = () => {
  const resizeImage = async (
    file: File,
    { maxSize, quality = 0.9 }: ImageResizeOptions
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

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

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
      };
      
      reader.onerror = (error) => reject(error);
    });
  };

  return { resizeImage };
};