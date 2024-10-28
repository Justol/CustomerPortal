export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }
      mailboxes: {
        Row: {
          id: string
          number: string
          type: 'digital_30' | 'digital_60' | 'physical_standard' | 'physical_business' | 'physical_executive'
          status: 'active' | 'suspended' | 'cancelled'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: string
          type: 'digital_30' | 'digital_60' | 'physical_standard' | 'physical_business' | 'physical_executive'
          status?: 'active' | 'suspended' | 'cancelled'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: string
          type?: 'digital_30' | 'digital_60' | 'physical_standard' | 'physical_business' | 'physical_executive'
          status?: 'active' | 'suspended' | 'cancelled'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      mail: {
        Row: {
          id: string
          sender: string
          recipient: string
          status: 'received' | 'scanned' | 'forwarded' | 'archived'
          mailbox_id: string
          scanned_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender: string
          recipient: string
          status?: 'received' | 'scanned' | 'forwarded' | 'archived'
          mailbox_id: string
          scanned_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender?: string
          recipient?: string
          status?: 'received' | 'scanned' | 'forwarded' | 'archived'
          mailbox_id?: string
          scanned_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          tracking_no: string
          carrier: string
          status: 'received' | 'processing' | 'forwarded' | 'delivered'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_no: string
          carrier: string
          status?: 'received' | 'processing' | 'forwarded' | 'delivered'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_no?: string
          carrier?: string
          status?: 'received' | 'processing' | 'forwarded' | 'delivered'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}