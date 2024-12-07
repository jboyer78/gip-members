import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";
import { useProfessionalDocUpload, ACCEPTED_DOC_TYPES } from "@/hooks/use-professional-doc-upload";

interface DocumentUploadProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const DocumentUpload = ({ form }: DocumentUploadProps) => {
  const { uploading, uploadDocument } = useProfessionalDocUpload({
    onSuccess: (url) => form.setValue('professional_document_url', url)
  });

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    await uploadDocument(event.target.files[0]);
  };

  const documentUrl = form.watch('professional_document_url');

  return (
    <FormField
      control={form.control}
      name="professional_document_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Justificatif professionnel</FormLabel>
          <div className="space-y-4">
            <Input
              type="file"
              accept={ACCEPTED_DOC_TYPES.join(',')}
              onChange={handleDocumentUpload}
              disabled={uploading}
              className="hidden"
              id="doc-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('doc-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Upload en cours...' : 'Joindre un justificatif'}
            </Button>
            {documentUrl && (
              <div className="flex items-center gap-2">
                <a 
                  href={documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Voir le document
                </a>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Formats acceptés : JPEG, PNG, WEBP, PDF. Taille max : 1MB
            </p>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};