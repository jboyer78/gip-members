import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { useAvatarUpload, ACCEPTED_IMAGE_TYPES } from "@/hooks/use-avatar-upload";

interface AvatarUploadProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const AvatarUpload = ({ form }: AvatarUploadProps) => {
  const { uploading, uploadAvatar } = useAvatarUpload({
    onSuccess: (url) => form.setValue('avatar_url', url)
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    await uploadAvatar(event.target.files[0]);
  };

  const avatarUrl = form.watch('avatar_url');
  const firstName = form.watch('first_name');
  const lastName = form.watch('last_name');

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>
          {firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-4">
        <Input
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
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
        <p className="text-sm text-gray-500">
          Formats acceptés : JPEG, PNG, WEBP. Taille max : 1MB
        </p>
      </div>
    </div>
  );
};