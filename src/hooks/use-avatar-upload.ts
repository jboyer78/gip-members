import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useImageResize } from "./use-image-resize";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_AVATAR_SIZE = 1024; // pixels
export const MIN_AVATAR_SIZE = 128; // pixels

interface UseAvatarUploadOptions {
  onSuccess: (url: string) => void;
}

export const useAvatarUpload = ({ onSuccess }: UseAvatarUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { resizeImage } = useImageResize();

  const validateFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Le type de fichier doit être JPEG, PNG ou WEBP.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('La taille du fichier ne doit pas dépasser 5MB.');
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      validateFile(file);

      const resizedImage = await resizeImage(file, {
        maxSize: MAX_AVATAR_SIZE,
        minSize: MIN_AVATAR_SIZE,
        quality: 0.95
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, resizedImage, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onSuccess(publicUrl);
      
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre photo a été uploadée avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'upload de la photo",
      });
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar,
    ACCEPTED_IMAGE_TYPES,
  };
};