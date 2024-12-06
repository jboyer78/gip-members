import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { AvatarUpload } from "./AvatarUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { ContactFields } from "./ContactFields";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <div className="space-y-8">
      <AvatarUpload form={form} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoFields form={form} />
        <AddressFields form={form} />
        <ContactFields form={form} />
      </div>
    </div>
  );
};