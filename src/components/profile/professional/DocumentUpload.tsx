import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";
import { useProfessionalDocUpload, ACCEPTED_DOC_TYPES } from "@/hooks/use-professional-doc-upload";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface DocumentUploadProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const DocumentUpload = ({ form }: DocumentUploadProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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

      const urlParts = documentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('Attempting to delete file:', fileName);

      const { error } = await supabase.storage
        .from('professional_docs')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }

      form.setValue('professional_document_url', '');
      
      toast({
        title: t('success.title'),
        description: t('success.documentDeleted'),
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: t('error.title'),
        description: t('error.documentDelete'),
      });
    }
  };

  const documentUrl = form.watch('professional_document_url');
  const professionalStatus = form.watch('professional_status')?.[0];

  const isActiveOrFounder = professionalStatus === "Actif" || professionalStatus === "Membre fondateur";

  return (
    <FormField
      control={form.control}
      name="professional_document_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('profile.professionalDocument')}</FormLabel>
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
                  {t('profile.downloadDocument')}
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
                {t('profile.noDocument')}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('doc-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? t('profile.uploadInProgress') : documentUrl ? t('profile.changeDocument') : t('profile.uploadDocument')}
            </Button>

            <p className="text-sm text-gray-500">
              {t('profile.acceptedFormats')}
            </p>
            
            <p className="text-sm text-gray-500">
              {t(isActiveOrFounder ? 'profile.acceptedDocuments.active' : 'profile.acceptedDocuments.other')}
            </p>

            <p className="text-sm text-gray-500 italic">
              {t('profile.dataRetention')}
            </p>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};