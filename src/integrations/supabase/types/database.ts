import { Profile, ProfileInsert, ProfileUpdate } from './profile';
import { BankingInfo, BankingInfoInsert, BankingInfoUpdate } from './banking';
import { Publication, PublicationInsert, PublicationUpdate } from './publication';
import { StatusComment, StatusCommentInsert, StatusCommentUpdate } from './status-comment';
import { LoginAttempt, LoginAttemptInsert, LoginAttemptUpdate } from './login-attempt';
import { PasswordResetAttempt, PasswordResetAttemptInsert } from './password-reset';

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
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      banking_info: {
        Row: BankingInfo
        Insert: BankingInfoInsert
        Update: BankingInfoUpdate
      }
      publications: {
        Row: Publication
        Insert: PublicationInsert
        Update: PublicationUpdate
      }
      status_comments: {
        Row: StatusComment
        Insert: StatusCommentInsert
        Update: StatusCommentUpdate
      }
      login_attempts: {
        Row: LoginAttempt
        Insert: LoginAttemptInsert
        Update: LoginAttemptUpdate
      }
      password_reset_attempts: {
        Row: PasswordResetAttempt
        Insert: PasswordResetAttemptInsert
        Update: PasswordResetAttemptInsert
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