import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useImageResize } from "@/hooks/use-image-resize";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

interface PublicationFormValues {
  title: string;
  content: string;
  image?: FileList;
}

interface PublicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PublicationFormDialog = ({ open, onOpenChange }: PublicationFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { resizeImage } = useImageResize();

  const form = useForm<PublicationFormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const validateFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Le type de fichier doit être JPEG, PNG ou WEBP.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('La taille du fichier ne doit pas dépasser 1MB.');
    }
  };

  const handleSubmit = async (values: PublicationFormValues) => {
    try {
      setIsSubmitting(true);

      let imageUrl = null;
      if (values.image?.[0]) {
        const file = values.image[0];
        
        // Validate the file before processing
        validateFile(file);
        
        const resizedImage = await resizeImage(file, {
          maxSize: 800,
          quality: 0.9
        });

        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('publications')
          .upload(filePath, resizedImage, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('publications')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('publications')
        .insert({
          title: values.title,
          content: values.content,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: "Publication créée",
        description: "La publication a été créée avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['publications'] });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating publication:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la publication",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle publication</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    Formats acceptés : JPEG, PNG, WEBP. Taille max : 1MB
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};