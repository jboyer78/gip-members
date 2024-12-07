export interface LoginAttempt {
  id: string
  ip_address: string
  attempt_count: number | null
  last_attempt: string | null
  is_blocked: boolean | null
  created_at: string | null
}

export interface LoginAttemptInsert {
  id?: string
  ip_address: string
  attempt_count?: number | null
  last_attempt?: string | null
  is_blocked?: boolean | null
  created_at?: string | null
}

export interface LoginAttemptUpdate {
  id?: string
  ip_address?: string
  attempt_count?: number | null
  last_attempt?: string | null
  is_blocked?: boolean | null
  created_at?: string | null
}