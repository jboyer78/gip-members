import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";

interface AvatarUploadProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AvatarUpload = ({ form }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      form.setValue('avatar_url', publicUrl);
      
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre photo a été uploadée avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo",
      });
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = form.watch('avatar_url');
  const firstName = form.watch('first_name');
  const lastName = form.watch('last_name');

  return (
    <div className="flex flex-col items-start gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>
          {firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? 'Upload en cours...' : 'Changer la photo'}
        </Button>
      </div>
    </div>
  );
};