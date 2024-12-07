import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface EditPublicationFormValues {
  title: string;
  content: string;
  image?: FileList;
}

interface EditPublicationFormFieldsProps {
  form: UseFormReturn<EditPublicationFormValues>;
  publication: {
    image_url: string | null;
  } | null;
  ACCEPTED_IMAGE_TYPES: string[];
}

export const EditPublicationFormFields = ({ 
  form, 
  publication, 
  ACCEPTED_IMAGE_TYPES 
}: EditPublicationFormFieldsProps) => {
  return (
    <>
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
            {publication?.image_url && (
              <img
                src={publication.image_url}
                alt="Current"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            )}
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
    </>
  );
};