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
      complaints: {
        Row: {
          component: string
          created_at: string
          date_added: string | null
          failure_date: string | null
          id: string
          odi_number: string
          summary: string
          vehicle_id: string
        }
        Insert: {
          component: string
          created_at?: string
          date_added?: string | null
          failure_date?: string | null
          id?: string
          odi_number: string
          summary: string
          vehicle_id: string
        }
        Update: {
          component?: string
          created_at?: string
          date_added?: string | null
          failure_date?: string | null
          id?: string
          odi_number?: string
          summary?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          id: string
          preferred_communication: string | null
        }
        Insert: {
          id: string
          preferred_communication?: string | null
        }
        Update: {
          id?: string
          preferred_communication?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investigations: {
        Row: {
          action_number: string
          component_description: string
          created_at: string
          id: string
          investigation_type: string | null
          open_date: string | null
          summary: string
          vehicle_id: string
        }
        Insert: {
          action_number: string
          component_description: string
          created_at?: string
          id?: string
          investigation_type?: string | null
          open_date?: string | null
          summary: string
          vehicle_id: string
        }
        Update: {
          action_number?: string
          component_description?: string
          created_at?: string
          id?: string
          investigation_type?: string | null
          open_date?: string | null
          summary?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investigations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_notes: {
        Row: {
          created_at: string
          id: string
          maintenance_id: string
          note: string
        }
        Insert: {
          created_at?: string
          id?: string
          maintenance_id: string
          note: string
        }
        Update: {
          created_at?: string
          id?: string
          maintenance_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_notes_maintenance_id_fkey"
            columns: ["maintenance_id"]
            isOneToOne: false
            referencedRelation: "maintenance_records"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          created_at: string
          customer_id: string
          date: string
          description: string
          id: string
          mechanic_id: string | null
          mechanic_signature: boolean | null
          service_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          date?: string
          description: string
          id?: string
          mechanic_id?: string | null
          mechanic_signature?: boolean | null
          service_type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          date?: string
          description?: string
          id?: string
          mechanic_id?: string | null
          mechanic_signature?: boolean | null
          service_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanic_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_profiles: {
        Row: {
          about: string | null
          featured_until: string | null
          hourly_rate: number
          id: string
          is_featured: boolean | null
          rating: number | null
          specialties: string | null
          years_experience: number
        }
        Insert: {
          about?: string | null
          featured_until?: string | null
          hourly_rate?: number
          id: string
          is_featured?: boolean | null
          rating?: number | null
          specialties?: string | null
          years_experience?: number
        }
        Update: {
          about?: string | null
          featured_until?: string | null
          hourly_rate?: number
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          specialties?: string | null
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      recalls: {
        Row: {
          camp_no: string
          component: string
          consequence: string | null
          created_at: string
          id: string
          notes: string | null
          remedy: string | null
          reported_date: string | null
          summary: string
          vehicle_id: string
        }
        Insert: {
          camp_no: string
          component: string
          consequence?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          remedy?: string | null
          reported_date?: string | null
          summary: string
          vehicle_id: string
        }
        Update: {
          camp_no?: string
          component?: string
          consequence?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          remedy?: string | null
          reported_date?: string | null
          summary?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recalls_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          make: string
          model: string
          owner_id: string
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          make: string
          model: string
          owner_id: string
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          make?: string
          model?: string
          owner_id?: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
