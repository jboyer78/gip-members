import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "./types";
import { AdministrationFields } from "./professional/AdministrationFields";
import { AssignmentFields } from "./professional/AssignmentFields";
import { StatusField } from "./professional/StatusField";
import { DocumentUpload } from "./professional/DocumentUpload";

interface ProfessionalFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const ProfessionalFields = ({ form }: ProfessionalFieldsProps) => {
  return (
    <>
      <AdministrationFields form={form} />
      <AssignmentFields form={form} />
      <StatusField form={form} />
      <DocumentUpload form={form} />
    </>
  );
};