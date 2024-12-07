export interface StatusComment {
  id: string
  profile_id: string | null
  status: string
  comment: string | null
  created_at: string
  created_by: string | null
}

export interface StatusCommentInsert {
  id?: string
  profile_id?: string | null
  status: string
  comment?: string | null
  created_at?: string
  created_by?: string | null
}

export interface StatusCommentUpdate {
  id?: string
  profile_id?: string | null
  status?: string
  comment?: string | null
  created_at?: string
  created_by?: string | null
}