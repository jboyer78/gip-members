export interface BankingInfo {
  id: string;
  profile_id: string;
  iban: string | null;
  created_at: string;
  updated_at: string;
  authorize_debit: boolean | null;
}

export interface BankingInfoInsert {
  id?: string;
  profile_id: string;
  iban?: string | null;
  created_at?: string;
  updated_at?: string;
  authorize_debit?: boolean | null;
}

export interface BankingInfoUpdate {
  id?: string;
  profile_id?: string;
  iban?: string | null;
  created_at?: string;
  updated_at?: string;
  authorize_debit?: boolean | null;
}