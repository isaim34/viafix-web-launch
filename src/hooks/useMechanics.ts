
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MechanicProfile {
  id: string;
  name?: string;
  avatar?: string;
  specialties?: string[] | string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  hourlyRate?: number;
  zipCode?: string;
  firstName?: string;
  lastName?: string;
  profile_image?: string;
  about?: string;
  years_experience?: number;
  response_time?: string;
}

export const useMechanics = () => {
  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMechanics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Query for mechanic profiles with their basic profile info
      const { data: mechanicProfiles, error: mechanicError } = await supabase
        .from('mechanic_profiles')
        .select(`
          id,
          hourly_rate,
          years_experience,
          specialties,
          rating,
          review_count,
          about,
          response_time,
          is_featured,
          featured_until,
          profiles:id(
            id,
            first_name,
            last_name,
            profile_image,
            zip_code,
            phone
          )
        `);

      if (mechanicError) {
        throw mechanicError;
      }

      // Format the mechanics data
      const formattedMechanics = mechanicProfiles.map(mechanic => {
        // Extract profile data
        const profile = mechanic.profiles as any;
        
        // Construct the name from first and last name
        const name = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : 'Unknown Mechanic';
        
        // Format specialties as array
        let specialtiesArray: string[] = [];
        if (typeof mechanic.specialties === 'string') {
          specialtiesArray = mechanic.specialties.split(',').map(s => s.trim());
        } else if (Array.isArray(mechanic.specialties)) {
          specialtiesArray = mechanic.specialties;
        } else {
          specialtiesArray = ['General Repairs'];
        }

        return {
          id: mechanic.id,
          name,
          avatar: profile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
          specialties: specialtiesArray,
          rating: mechanic.rating || 0,
          reviewCount: mechanic.review_count || 0,
          location: profile?.city ? `${profile.city}, ${profile.state}` : 'Location not specified',
          hourlyRate: mechanic.hourly_rate || 0,
          zipCode: profile?.zip_code || '',
          about: mechanic.about || '',
          yearsExperience: mechanic.years_experience || 0,
          responseTime: mechanic.response_time || 'Under 1 hour',
          isFeatured: mechanic.is_featured || false,
          featuredUntil: mechanic.featured_until || null
        };
      });

      setMechanics(formattedMechanics);
    } catch (err: any) {
      console.error('Error fetching mechanics:', err);
      setError(err.message || 'Failed to load mechanics');
      toast({
        title: 'Error',
        description: `Failed to load mechanics: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  return { mechanics, loading, error, refetch: fetchMechanics };
};
