
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
      console.log('Fetching mechanic profiles...');
      
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
          featured_until
        `);

      if (mechanicError) {
        console.error('Error fetching mechanic profiles:', mechanicError);
        throw mechanicError;
      }
      
      console.log('Mechanic profiles fetched:', mechanicProfiles?.length || 0);

      // If we got mechanic profiles, now fetch the related profile data
      const formattedMechanics: MechanicProfile[] = [];
      
      if (mechanicProfiles && mechanicProfiles.length > 0) {
        for (const mechanic of mechanicProfiles) {
          // For each mechanic, get their profile information
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, profile_image, zip_code')
            .eq('id', mechanic.id)
            .maybeSingle();
            
          if (profileError) {
            console.warn(`Error fetching profile for mechanic ${mechanic.id}:`, profileError);
          }
          
          // Format specialties as array
          let specialtiesArray: string[] = [];
          if (typeof mechanic.specialties === 'string') {
            specialtiesArray = mechanic.specialties.split(',').map(s => s.trim());
          } else if (Array.isArray(mechanic.specialties)) {
            specialtiesArray = mechanic.specialties;
          }
          
          // Construct the name from first and last name
          const name = profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : '';

          formattedMechanics.push({
            id: mechanic.id,
            name: name || 'Unknown Mechanic',
            avatar: profile?.profile_image || '',
            specialties: specialtiesArray.length > 0 ? specialtiesArray : ['General Repairs'],
            rating: mechanic.rating || 0,
            reviewCount: mechanic.review_count || 0,
            location: 'Location based on zip code', // Could be improved with zip code lookup
            hourlyRate: mechanic.hourly_rate || 0,
            zipCode: profile?.zip_code || '',
            about: mechanic.about || '',
            years_experience: mechanic.years_experience || 0,
            response_time: mechanic.response_time || 'Under 1 hour'
          });
        }
      }

      console.log('Formatted mechanics data:', formattedMechanics.length);
      setMechanics(formattedMechanics);
    } catch (err: any) {
      console.error('Error in useMechanics:', err);
      setError(err.message || 'Failed to load mechanics');
      // Show toast but prevent it from blocking UI rendering
      setTimeout(() => {
        toast({
          title: 'Error',
          description: `Failed to load mechanics: ${err.message}`,
          variant: 'destructive',
        });
      }, 0);
      
      // Set empty array on error to prevent app from breaking
      setMechanics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  return { mechanics, loading, error, refetch: fetchMechanics };
};
