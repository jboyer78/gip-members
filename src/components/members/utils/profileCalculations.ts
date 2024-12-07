import { Profile } from "@/integrations/supabase/types/profile";
import { differenceInYears } from "date-fns";

export const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return '-';
  return differenceInYears(new Date(), new Date(birthDate));
};

export const calculateCompletionPercentage = (profile: Profile) => {
  const personalFields = [
    'first_name',
    'last_name',
    'birth_date',
    'birth_city',
    'birth_department',
    'blood_type',
    'marital_status',
    'children_count',
    'phone_home',
    'phone_mobile',
    'email',
    'street',
    'postal_code',
    'city',
    'country'
  ];

  const filledFields = personalFields.filter(field => 
    profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== ''
  );

  return Math.round((filledFields.length / personalFields.length) * 100);
};

export const calculateProfessionalCompletionPercentage = (profile: Profile) => {
  const professionalFields = [
    'status',
    'administration',
    'administration_entry_date',
    'training_site',
    'grade',
    'assignment_direction',
    'assignment_service',
    'professional_document_url'
  ];

  const filledFields = professionalFields.filter(field => {
    if (field === 'status') {
      return profile[field] && profile[field].length > 0;
    }
    return profile[field as keyof Profile] !== null && profile[field as keyof Profile] !== '';
  });

  return Math.round((filledFields.length / professionalFields.length) * 100);
};