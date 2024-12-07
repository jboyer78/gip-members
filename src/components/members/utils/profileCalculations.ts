import { Profile } from "@/integrations/supabase/types/profile";

export const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return "-";
  const ageDifMs = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const calculateCompletionPercentage = (profile: Profile) => {
  let total = 0;
  let completed = 0;

  // Check if personal info exists
  total += 5; // first_name, last_name, email, birth_date, grade
  if (profile.first_name) completed++;
  if (profile.last_name) completed++;
  if (profile.email) completed++;
  if (profile.birth_date) completed++;
  if (profile.grade) completed++;

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

export const calculateProfessionalCompletionPercentage = (profile: Profile) => {
  let total = 0;
  let completed = 0;

  // Check if professional info exists
  total += 4; // assignment_service, assignment_direction, professional_status, professional_document_url
  if (profile.assignment_service) completed++;
  if (profile.assignment_direction) completed++;
  if (profile.professional_status) completed++;
  if (profile.professional_document_url) completed++;

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

export const calculateBankingCompletionPercentage = (profile: Profile) => {
  let total = 0;
  let completed = 0;

  // Check if banking info exists
  if (profile.banking_info) {
    total += 2; // IBAN and authorize_debit fields
    if (profile.banking_info.iban) completed++;
    if (profile.banking_info.authorize_debit) completed++;
  }

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};
