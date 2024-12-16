export interface PasswordResetAttempt {
  id: string;
  email: string;
  last_attempt: string | null;
  created_at: string | null;
}

export interface PasswordResetAttemptInsert {
  id?: string;
  email: string;
  last_attempt?: string | null;
  created_at?: string | null;
}