import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import sharp from 'sharp';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

interface UseAvatarUploadProps {
  onSuccess?: (url: string) => void;
}

export const useAvatarUpload = ({ onSuccess }: UseAvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Convertir le File en Buffer pour sharp
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Optimiser l'image avec sharp
      const optimizedImageBuffer = await sharp(buffer)
        .resize(800, 800, { // Taille maximale
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 }) // Convertir en WebP avec une qualité de 80%
        .toBuffer();

      // Créer un nouveau Blob à partir du buffer optimisé
      const optimizedBlob = new Blob([optimizedImageBuffer], { type: 'image/webp' });
      const optimizedFile = new File([optimizedBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
        type: 'image/webp'
      });

      const fileExt = '.webp';
      const fileName = `${Math.random()}-${Date.now()}${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, optimizedFile, {
          cacheControl: '31536000', // Cache pour 1 an
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      if (onSuccess) {
        onSuccess(publicUrl);
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar
  };
};