export interface ProfileFormValues {
  first_name: string;
  last_name: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
  phone_home: string;
  phone_mobile: string;
  email: string;
  avatar_url?: string;
  birth_date?: Date;
  birth_city?: string;
  birth_department?: string;
  blood_type?: string;
  marital_status?: string;
  children_count?: number;
}

export interface ProfessionalFormValues {
  professional_status?: string[];
  administration?: string;
  administration_entry_date?: Date;
  training_site?: string;
  grade?: string;
  assignment_direction?: string;
  assignment_service?: string;
  professional_document_url?: string;
}