import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";
import { AvatarUpload } from "./AvatarUpload";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { ContactFields } from "./ContactFields";
import { PersonalDetailsFields } from "./PersonalDetailsFields";

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const ProfileFormFields = ({ form }: ProfileFormFieldsProps) => {
  return (
    <div className="space-y-8">
      <AvatarUpload form={form} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Informations personnelles</h2>
          <PersonalInfoFields form={form} />
          <PersonalDetailsFields form={form} />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Coordonnées</h2>
          <AddressFields form={form} />
          <ContactFields form={form} />
        </div>
      </div>
    </div>
  );
};