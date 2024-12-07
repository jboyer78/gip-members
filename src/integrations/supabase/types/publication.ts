export interface Publication {
  id: string
  title: string
  content: string
  image_url: string | null
  reading_time: number | null
  created_at: string
  updated_at: string
  created_by: string | null
  is_published: boolean | null
}

export interface PublicationInsert {
  id?: string
  title: string
  content: string
  image_url?: string | null
  reading_time?: number | null
  created_at?: string
  updated_at?: string
  created_by?: string | null
  is_published?: boolean | null
}

export interface PublicationUpdate {
  id?: string
  title?: string
  content?: string
  image_url?: string | null
  reading_time?: number | null
  created_at?: string
  updated_at?: string
  created_by?: string | null
  is_published?: boolean | null
}