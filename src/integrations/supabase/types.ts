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
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string
          name: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization: string
          name: string
          profile_id: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string
          name?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          sender_name: string
          thread_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          sender_name: string
          thread_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          sender_name?: string
          thread_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant_names: Json
          participants: string[]
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_names?: Json
          participants: string[]
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_names?: Json
          participants?: string[]
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
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
      custom_offers: {
        Row: {
          budget: string | null
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          labor_hours: number | null
          mechanic_id: string
          parts_used: string | null
          preferred_date: string | null
          status: string
          timeframe: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          customer_id: string
          description: string
          id?: string
          labor_hours?: number | null
          mechanic_id: string
          parts_used?: string | null
          preferred_date?: string | null
          status?: string
          timeframe?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          labor_hours?: number | null
          mechanic_id?: string
          parts_used?: string | null
          preferred_date?: string | null
          status?: string
          timeframe?: string | null
          updated_at?: string
        }
        Relationships: []
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
      customer_vehicles: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_primary: boolean | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_primary?: boolean | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_primary?: boolean | null
          vehicle_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          profile_id: string
          start_date: string | null
        }
        Insert: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          profile_id: string
          start_date?: string | null
        }
        Update: {
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          profile_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
      job_completions: {
        Row: {
          amount_paid: number | null
          completed_at: string
          created_at: string
          customer_id: string | null
          id: string
          is_first_job: boolean | null
          job_type: string
          mechanic_id: string
        }
        Insert: {
          amount_paid?: number | null
          completed_at?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_first_job?: boolean | null
          job_type: string
          mechanic_id: string
        }
        Update: {
          amount_paid?: number | null
          completed_at?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_first_job?: boolean | null
          job_type?: string
          mechanic_id?: string
        }
        Relationships: []
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
          custom_offer_id: string | null
          customer_id: string
          date: string
          description: string
          id: string
          mechanic_id: string | null
          mechanic_signature: boolean | null
          service_booking_id: string | null
          service_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          custom_offer_id?: string | null
          customer_id: string
          date?: string
          description: string
          id?: string
          mechanic_id?: string | null
          mechanic_signature?: boolean | null
          service_booking_id?: string | null
          service_type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          custom_offer_id?: string | null
          customer_id?: string
          date?: string
          description?: string
          id?: string
          mechanic_id?: string | null
          mechanic_signature?: boolean | null
          service_booking_id?: string | null
          service_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_custom_offer_id_fkey"
            columns: ["custom_offer_id"]
            isOneToOne: false
            referencedRelation: "custom_offers"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "maintenance_records_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "mechanic_stats"
            referencedColumns: ["mechanic_id"]
          },
          {
            foreignKeyName: "maintenance_records_service_booking_id_fkey"
            columns: ["service_booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
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
      mechanic_gallery: {
        Row: {
          created_at: string
          id: string
          image_url: string
          mechanic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          mechanic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          mechanic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_gallery_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_payment_methods: {
        Row: {
          card_brand: string | null
          card_last4: string | null
          created_at: string
          id: string
          is_active: boolean | null
          mechanic_id: string
          stripe_payment_method_id: string | null
          stripe_setup_intent_id: string
          updated_at: string
        }
        Insert: {
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          mechanic_id: string
          stripe_payment_method_id?: string | null
          stripe_setup_intent_id: string
          updated_at?: string
        }
        Update: {
          card_brand?: string | null
          card_last4?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          mechanic_id?: string
          stripe_payment_method_id?: string | null
          stripe_setup_intent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      mechanic_profiles: {
        Row: {
          about: string | null
          featured_until: string | null
          hourly_rate: number
          id: string
          is_featured: boolean | null
          profile_completion_score: number | null
          rating: number | null
          response_time: string | null
          review_count: number | null
          specialties: string | null
          verification_status: string | null
          years_experience: number
        }
        Insert: {
          about?: string | null
          featured_until?: string | null
          hourly_rate?: number
          id: string
          is_featured?: boolean | null
          profile_completion_score?: number | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          specialties?: string | null
          verification_status?: string | null
          years_experience?: number
        }
        Update: {
          about?: string | null
          featured_until?: string | null
          hourly_rate?: number
          id?: string
          is_featured?: boolean | null
          profile_completion_score?: number | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          specialties?: string | null
          verification_status?: string | null
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
      mechanic_reviews: {
        Row: {
          author: string
          created_at: string
          customer_id: string | null
          id: string
          mechanic_id: string
          rating: number
          text: string | null
          user_id: string | null
        }
        Insert: {
          author: string
          created_at?: string
          customer_id?: string | null
          id?: string
          mechanic_id: string
          rating: number
          text?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          mechanic_id?: string
          rating?: number
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_services: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          mechanic_id: string
          name: string
          price: number
          status: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          mechanic_id: string
          name: string
          price?: number
          status?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          mechanic_id?: string
          name?: string
          price?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_services_mechanic_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_spotlight_purchases: {
        Row: {
          amount: number
          created_at: string
          expires_at: string | null
          id: string
          mechanic_id: string
          spotlight_type: string | null
          status: string | null
          stripe_payment_intent_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string | null
          id?: string
          mechanic_id: string
          spotlight_type?: string | null
          status?: string | null
          stripe_payment_intent_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          mechanic_id?: string
          spotlight_type?: string | null
          status?: string | null
          stripe_payment_intent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      mechanic_subscriptions: {
        Row: {
          created_at: string
          first_job_completed: boolean | null
          first_job_completed_at: string | null
          id: string
          mechanic_id: string
          monthly_amount: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_started_at: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_job_completed?: boolean | null
          first_job_completed_at?: string | null
          id?: string
          mechanic_id: string
          monthly_amount?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_job_completed?: boolean | null
          first_job_completed_at?: string | null
          id?: string
          mechanic_id?: string
          monthly_amount?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_started_at?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_reminders: boolean | null
          id: string
          mechanic_inactivity_alerts: boolean | null
          service_reminders: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_reminders?: boolean | null
          id?: string
          mechanic_inactivity_alerts?: boolean | null
          service_reminders?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_reminders?: boolean | null
          id?: string
          mechanic_inactivity_alerts?: boolean | null
          service_reminders?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      planner_entries: {
        Row: {
          created_at: string
          customer_name: string
          date: string
          estimated_time: string
          id: string
          mechanic_id: string
          notes: string | null
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          date: string
          estimated_time: string
          id?: string
          mechanic_id: string
          notes?: string | null
          service_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          date?: string
          estimated_time?: string
          id?: string
          mechanic_id?: string
          notes?: string | null
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          mechanic_id: string
          user_agent: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          mechanic_id: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          mechanic_id?: string
          user_agent?: string | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_login: string | null
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
          last_login?: string | null
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
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      qr_leads: {
        Row: {
          conversion_timestamp: string | null
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          is_founding_member: boolean | null
          scan_id: number | null
          source: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          conversion_timestamp?: string | null
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          is_founding_member?: boolean | null
          scan_id?: number | null
          source?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          conversion_timestamp?: string | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          is_founding_member?: boolean | null
          scan_id?: number | null
          source?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_leads_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "qr_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_scans: {
        Row: {
          converted_to_lead: boolean | null
          id: number
          ip_address: string | null
          scan_time: string
          user_agent: string | null
        }
        Insert: {
          converted_to_lead?: boolean | null
          id?: number
          ip_address?: string | null
          scan_time?: string
          user_agent?: string | null
        }
        Update: {
          converted_to_lead?: boolean | null
          id?: number
          ip_address?: string | null
          scan_time?: string
          user_agent?: string | null
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
      service_bookings: {
        Row: {
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          customer_id: string
          id: string
          labor_hours: number | null
          mechanic_id: string
          notes: string | null
          parts_used: string | null
          preferred_date: string | null
          service_id: string | null
          service_name: string
          service_price: number | null
          status: string
          updated_at: string
          vehicle_info: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          customer_id: string
          id?: string
          labor_hours?: number | null
          mechanic_id: string
          notes?: string | null
          parts_used?: string | null
          preferred_date?: string | null
          service_id?: string | null
          service_name: string
          service_price?: number | null
          status?: string
          updated_at?: string
          vehicle_info?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          labor_hours?: number | null
          mechanic_id?: string
          notes?: string | null
          parts_used?: string | null
          preferred_date?: string | null
          service_id?: string | null
          service_name?: string
          service_price?: number | null
          status?: string
          updated_at?: string
          vehicle_info?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          mechanic_avatar: string
          mechanic_hourly_rate: number
          mechanic_id: string
          mechanic_location: string
          mechanic_name: string
          mechanic_rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mechanic_avatar: string
          mechanic_hourly_rate?: number
          mechanic_id: string
          mechanic_location: string
          mechanic_name: string
          mechanic_rating?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mechanic_avatar?: string
          mechanic_hourly_rate?: number
          mechanic_id?: string
          mechanic_location?: string
          mechanic_name?: string
          mechanic_rating?: number
          user_id?: string
        }
        Relationships: []
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
      vendor_payments: {
        Row: {
          amount: number
          created_at: string
          expires_at: string | null
          id: string
          payment_type: string
          quantity: number | null
          status: string
          stripe_payment_id: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_type: string
          quantity?: number | null
          status: string
          stripe_payment_id?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_type?: string
          quantity?: number | null
          status?: string
          stripe_payment_id?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      mechanic_stats: {
        Row: {
          cancelled_bookings: number | null
          cancelled_offers: number | null
          completed_bookings: number | null
          completed_offers: number | null
          mechanic_id: string | null
          ongoing_bookings: number | null
          ongoing_offers: number | null
          rating: number | null
          review_count: number | null
          total_earnings_bookings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_profiles_id_fkey"
            columns: ["mechanic_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
