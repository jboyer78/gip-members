import { BankingInfo } from './banking';

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  phone_home: string | null;
  phone_mobile: string | null;
  email: string | null;
  email_verified: boolean | null;
  updated_at: string;
  avatar_url: string | null;
  birth_date: string | null;
  birth_city: string | null;
  birth_department: string | null;
  blood_type: string | null;
  marital_status: string | null;
  children_count: number | null;
  status: string[] | null;
  professional_status: string[] | null;
  administration: string | null;
  administration_entry_date: string | null;
  training_site: string | null;
  grade: string | null;
  assignment_direction: string | null;
  assignment_service: string | null;
  professional_document_url: string | null;
  is_admin: boolean | null;
  created_at: string;
  banned_at: string | null;
  banking_info?: BankingInfo | null;
  member_number: string | null;
  donation_amount?: number | null;
};

export type ProfileInsert = {
  id: string;
} & Partial<Omit<Profile, 'id'>>;

export type ProfileUpdate = Partial<Profile>;