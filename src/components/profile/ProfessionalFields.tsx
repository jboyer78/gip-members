import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useProfessionalDocUpload, ACCEPTED_DOC_TYPES } from "@/hooks/use-professional-doc-upload";

const administrations = [
  "Police Nationale",
  "Police Municipale",
  "Gendarmerie Nationale",
  "Police des transports",
  "Douane",
  "Police de l'environnement",
  "autres"
];

const statusOptions = [
  { id: "actif", label: "Actif" },
  { id: "retraite", label: "Retraité(e)" },
  { id: "sympathisant", label: "Sympathisant" },
  { id: "eleve", label: "Élève" }
];

interface ProfessionalFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const ProfessionalFields = ({ form }: ProfessionalFieldsProps) => {
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
    <>
      <FormField
        control={form.control}
        name="administration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Administration</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre administration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {administrations.map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="administration_entry_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date d'entrée dans l'administration</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_site"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site de formation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="grade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignment_direction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Direction d'affectation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assignment_service"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service d'affectation</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={() => (
          <FormItem>
            <FormLabel>Situation</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {statusOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.label)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, option.label]);
                              } else {
                                field.onChange(
                                  currentValue.filter((value) => value !== option.label)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </>
  );
};
