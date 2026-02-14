export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          calendly_link: string | null
          created_at: string
          created_by: string | null
          custom_departure_date: string | null
          custom_departure_date_end: string | null
          departure_type: string
          details: Json | null
          fixed_date_id: string | null
          id: string
          internal_notes: string | null
          lead_type: string
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          tour_id: string | null
          traveler_id: string | null
          updated_at: string
        }
        Insert: {
          calendly_link?: string | null
          created_at?: string
          created_by?: string | null
          custom_departure_date?: string | null
          custom_departure_date_end?: string | null
          departure_type?: string
          details?: Json | null
          fixed_date_id?: string | null
          id?: string
          internal_notes?: string | null
          lead_type?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          tour_id?: string | null
          traveler_id?: string | null
          updated_at?: string
        }
        Update: {
          calendly_link?: string | null
          created_at?: string
          created_by?: string | null
          custom_departure_date?: string | null
          custom_departure_date_end?: string | null
          departure_type?: string
          details?: Json | null
          fixed_date_id?: string | null
          id?: string
          internal_notes?: string | null
          lead_type?: string
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          tour_id?: string | null
          traveler_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_fixed_date_id_fkey"
            columns: ["fixed_date_id"]
            isOneToOne: false
            referencedRelation: "tour_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cell_phone: string | null
          company_data: Json | null
          created_at: string
          first_name: string
          id: string
          ig_handle: string | null
          last_name: string
          location: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cell_phone?: string | null
          company_data?: Json | null
          created_at?: string
          first_name?: string
          id: string
          ig_handle?: string | null
          last_name?: string
          location?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cell_phone?: string | null
          company_data?: Json | null
          created_at?: string
          first_name?: string
          id?: string
          ig_handle?: string | null
          last_name?: string
          location?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      tour_schedules: {
        Row: {
          capacity: number | null
          created_at: string
          end_date: string | null
          id: string
          start_date: string
          status: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date: string
          status?: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_schedules_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          canonical_slug: string
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_slug: string
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_slug?: string
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      lead_status:
      | "new"
      | "in_progress"
      | "confirmed"
      | "completed"
      | "cancelled"
      user_role:
      | "superadmin"
      | "leadership"
      | "reseller"
      | "supplier"
      | "traveler"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      lead_status: [
        "new",
        "in_progress",
        "confirmed",
        "completed",
        "cancelled",
      ],
      user_role: [
        "superadmin",
        "leadership",
        "reseller",
        "supplier",
        "traveler",
      ],
    },
  },
} as const
