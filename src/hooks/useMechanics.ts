
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
      // Try a simpler query that just gets the mechanic profiles first
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
          } else {
            specialtiesArray = ['General Repairs'];
          }
          
          // Construct the name from first and last name
          const name = profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'Unknown Mechanic';

          formattedMechanics.push({
            id: mechanic.id,
            name,
            avatar: profile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            specialties: specialtiesArray,
            rating: mechanic.rating || 0,
            reviewCount: mechanic.review_count || 0,
            location: 'Location not specified', // Simplified since we don't have city/state
            hourlyRate: mechanic.hourly_rate || 0,
            zipCode: profile?.zip_code || '',
            about: mechanic.about || '',
            yearsExperience: mechanic.years_experience || 0,
            responseTime: mechanic.response_time || 'Under 1 hour'
          });
        }
      } else {
        console.log('No mechanic profiles found, using fallback data');
        // If no mechanics were found, add a fallback mechanic for development
        formattedMechanics.push({
          id: 'fallback-mechanic',
          name: 'Demo Mechanic',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
          specialties: ['General Repairs', 'Diagnostics', 'Brake Service'],
          rating: 4.7,
          reviewCount: 24,
          location: 'Austin, TX',
          hourlyRate: 75,
          zipCode: '78701',
          about: "Experienced mechanic with a focus on quality service.",
          yearsExperience: 8,
          responseTime: 'Under 1 hour'
        });
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
      
      // Even on error, set empty array to prevent app from breaking
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
