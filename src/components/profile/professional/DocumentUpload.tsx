import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";
import { useProfessionalDocUpload, ACCEPTED_DOC_TYPES } from "@/hooks/use-professional-doc-upload";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const DocumentUpload = ({ form }: DocumentUploadProps) => {
  const { toast } = useToast();
  const { uploading, uploadDocument } = useProfessionalDocUpload({
    onSuccess: (url) => form.setValue('professional_document_url', url)
  });

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    await uploadDocument(event.target.files[0]);
  };

  const handleDeleteDocument = async () => {
    try {
      const documentUrl = form.getValues('professional_document_url');
      if (!documentUrl) return;

      // Extract the file path from the URL
      const filePath = documentUrl.split('/').pop();
      if (!filePath) return;

      const { error } = await supabase.storage
        .from('professional_docs')
        .remove([filePath]);

      if (error) throw error;

      form.setValue('professional_document_url', '');
      
      toast({
        title: "Document supprimé",
        description: "Le justificatif professionnel a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du document",
      });
      console.error('Error deleting document:', error);
    }
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
            
            {documentUrl ? (
              <div className="flex items-center gap-4">
                <a 
                  href={documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex-grow"
                >
                  Voir le document actuel
                </a>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteDocument}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun document n'a été uploadé
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('doc-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Upload en cours...' : documentUrl ? 'Changer le document' : 'Joindre un justificatif'}
            </Button>

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