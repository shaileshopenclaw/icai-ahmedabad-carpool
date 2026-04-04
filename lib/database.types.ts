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
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          event_time: string | null
          venue_name: string
          venue_address: string
          event_type: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          event_time?: string | null
          venue_name: string
          venue_address: string
          event_type?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          venue_name?: string
          venue_address?: string
          event_type?: string | null
          is_active?: boolean | null
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          event_id: string | null
          name: string
          phone: string
          email: string
          whatsapp_number: string | null
          area_name: string
          pincode: string
          full_address: string | null
          latitude: number | null
          longitude: number | null
          linkedin_url: string | null
          is_offering_ride: boolean | null
          seats_available: number | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          name: string
          phone: string
          email: string
          whatsapp_number?: string | null
          area_name: string
          pincode: string
          full_address?: string | null
          latitude?: number | null
          longitude?: number | null
          linkedin_url?: string | null
          is_offering_ride?: boolean | null
          seats_available?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          name?: string
          phone?: string
          email?: string
          whatsapp_number?: string | null
          area_name?: string
          pincode?: string
          full_address?: string | null
          latitude?: number | null
          longitude?: number | null
          linkedin_url?: string | null
          is_offering_ride?: boolean | null
          seats_available?: number | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
