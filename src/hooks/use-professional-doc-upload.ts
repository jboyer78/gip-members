import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ACCEPTED_DOC_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
];
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

interface UseProfessionalDocUploadOptions {
  onSuccess: (url: string) => void;
}

export const useProfessionalDocUpload = ({ onSuccess }: UseProfessionalDocUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    if (!ACCEPTED_DOC_TYPES.includes(file.type)) {
      throw new Error('Le type de fichier doit être JPEG, PNG, WEBP ou PDF.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('La taille du fichier ne doit pas dépasser 1MB.');
    }
  };

  const uploadDocument = async (file: File) => {
    try {
      setUploading(true);
      validateFile(file);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('professional_docs')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professional_docs')
        .getPublicUrl(filePath);

      onSuccess(publicUrl);
      
      toast({
        title: "Document professionnel mis à jour",
        description: "Votre justificatif a été uploadé avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'upload du document",
      });
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadDocument,
    ACCEPTED_DOC_TYPES,
  };
};