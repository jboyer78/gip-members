export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banking_info: {
        Row: {
          authorize_debit: boolean | null
          created_at: string
          iban: string | null
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          authorize_debit?: boolean | null
          created_at?: string
          iban?: string | null
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          authorize_debit?: boolean | null
          created_at?: string
          iban?: string | null
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banking_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          id: string
          ip_address: string
          is_blocked: boolean | null
          last_attempt: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address: string
          is_blocked?: boolean | null
          last_attempt?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string
          is_blocked?: boolean | null
          last_attempt?: string | null
        }
        Relationships: []
      }
      password_reset_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_attempt: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_attempt?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_attempt?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          administration: string | null
          administration_entry_date: string | null
          assignment_direction: string | null
          assignment_service: string | null
          avatar_url: string | null
          banned_at: string | null
          birth_city: string | null
          birth_date: string | null
          birth_department: string | null
          blood_type: string | null
          children_count: number | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          grade: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          marital_status: string | null
          phone_home: string | null
          phone_mobile: string | null
          postal_code: string | null
          professional_document_url: string | null
          professional_status: string[] | null
          status: string[] | null
          street: string | null
          training_site: string | null
          updated_at: string
        }
        Insert: {
          administration?: string | null
          administration_entry_date?: string | null
          assignment_direction?: string | null
          assignment_service?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          birth_city?: string | null
          birth_date?: string | null
          birth_department?: string | null
          blood_type?: string | null
          children_count?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          grade?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          marital_status?: string | null
          phone_home?: string | null
          phone_mobile?: string | null
          postal_code?: string | null
          professional_document_url?: string | null
          professional_status?: string[] | null
          status?: string[] | null
          street?: string | null
          training_site?: string | null
          updated_at?: string
        }
        Update: {
          administration?: string | null
          administration_entry_date?: string | null
          assignment_direction?: string | null
          assignment_service?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          birth_city?: string | null
          birth_date?: string | null
          birth_department?: string | null
          blood_type?: string | null
          children_count?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          grade?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          marital_status?: string | null
          phone_home?: string | null
          phone_mobile?: string | null
          postal_code?: string | null
          professional_document_url?: string | null
          professional_status?: string[] | null
          status?: string[] | null
          street?: string | null
          training_site?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          reading_time: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          reading_time?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          reading_time?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_attempt: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_attempt?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_attempt?: string | null
        }
        Relationships: []
      }
      status_comments: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string | null
          id: string
          profile_id: string | null
          status: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id?: string | null
          status: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
