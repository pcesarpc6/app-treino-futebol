import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para o banco de dados
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          age: number;
          phone: string;
          profile: 'athlete' | 'coach';
          level?: 'base' | 'amateur' | 'professional';
          position?: string;
          training_days_per_week?: number;
          time_per_training?: number;
          training_type?: 'technical' | 'physical' | 'both';
          favorite_team?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'technical' | 'physical' | 'both';
          duration: number;
          location: 'field' | 'sand' | 'court' | 'gym' | 'home';
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          description: string;
          completed: boolean;
          completed_at?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workouts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['workouts']['Insert']>;
      };
      challenges: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          progress: number;
          total: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['challenges']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['challenges']['Insert']>;
      };
      training_locations: {
        Row: {
          id: string;
          user_id: string;
          day_of_week: string;
          location: 'field' | 'sand' | 'court' | 'gym' | 'home';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['training_locations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['training_locations']['Insert']>;
      };
    };
  };
};
