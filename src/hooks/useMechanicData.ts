
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MechanicDetail } from '@/types/mechanic';
import { mechanicsDetailedData } from '@/data/mechanicsData';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook to fetch and prepare mechanic data based on ID
 */
export const useMechanicData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mechanic, setMechanic] = useState<MechanicDetail | null>(null);
  
  useEffect(() => {
    // Check if user is logged in as a mechanic
    const userRole = localStorage.getItem('userRole');
    const isLoggedInMechanic = userRole === 'mechanic';
    
    // If the user is a mechanic and trying to view a mechanic profile,
    // redirect them to their dashboard if it's their own profile (local-mechanic)
    if (isLoggedInMechanic && id === 'local-mechanic') {
      navigate('/mechanic-dashboard');
      return;
    }
    
    const fetchMechanicData = async () => {
      setLoading(true);
      
      // Handle special cases: default-vendor or local-mechanic
      if ((id === 'default-vendor' || id === 'local-mechanic')) {
        const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
        const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
        
        // Get mechanic profile from localStorage if available
        const storedProfile = localStorage.getItem('mechanicProfile');
        let mechanicProfile: Record<string, any> = {};
        
        if (storedProfile) {
          try {
            mechanicProfile = JSON.parse(storedProfile);
          } catch (error) {
            console.error('Error parsing mechanic profile:', error);
          }
        }
        
        // Handle specialties based on its type
        let specialties: string[] = ['General Repairs', 'Diagnostics']; // Default specialties
        
        if (mechanicProfile.specialties !== undefined) {
          const specialtiesValue = mechanicProfile.specialties;
          
          // Fix TypeScript error by properly handling the specialties type
          if (typeof specialtiesValue === 'string') {
            // If it's a string, split it by commas
            specialties = specialtiesValue.split(',').map(s => s.trim());
          } else if (Array.isArray(specialtiesValue)) {
            // If it's already an array, use it directly but ensure it's string[]
            specialties = specialtiesValue.map(s => String(s));
          }
        }
        
        // Create custom mechanic data for the local/default mechanic
        setMechanic({
          id: id || 'local-mechanic',
          name: vendorName,
          avatar: vendorAvatar,
          specialties: specialties,
          rating: 5.0,
          reviewCount: 12,
          location: mechanicProfile.location || 'Worcester, MA',
          hourlyRate: mechanicProfile.hourlyRate || 75,
          yearsExperience: mechanicProfile.yearsExperience || 5,
          about: mechanicProfile.about || "Certified mechanic specializing in general vehicle maintenance and repairs. I provide honest, reliable service at competitive rates.",
          responseTime: "Under 1 hour",
          services: [
            { name: "Diagnostic Scan", price: 75 },
            { name: "Oil Change", price: 65 },
            { name: "Brake Inspection", price: 45 },
            { name: "General Tune-Up", price: 120 }
          ],
          reviews: [
            { author: "Customer", rating: 5, text: "Very professional and knowledgeable. Highly recommended!" }
          ],
          galleryImages: [
            'https://images.unsplash.com/photo-1632931612869-c1a971a02054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
          ]
        });
        setLoading(false);
        return;
      }
      
      try {
        // For other mechanics, fetch from the database
        const { data: mechanicProfile, error: mechanicError } = await supabase
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
          `)
          .eq('id', id)
          .single();
          
        if (mechanicError) {
          throw mechanicError;
        }
        
        if (!mechanicProfile) {
          // If no mechanic was found, use fallback data
          if (id && mechanicsDetailedData[id]) {
            setMechanic(mechanicsDetailedData[id]);
            console.log('Using fallback data for mechanic:', id);
          } else {
            // No data available, set default
            setMechanic(mechanicsDetailedData['1']);
            console.log('Using default fallback data for mechanic');
          }
          setLoading(false);
          return;
        }
        
        // Get services
        const { data: services, error: servicesError } = await supabase
          .from('mechanic_services')
          .select('id, name, price')
          .eq('mechanic_id', id);
          
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
        }
        
        // Get reviews
        const { data: reviews, error: reviewsError } = await supabase
          .from('mechanic_reviews')
          .select('id, author, rating, text, created_at')
          .eq('mechanic_id', id);
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        
        // Get gallery images
        const { data: gallery, error: galleryError } = await supabase
          .from('mechanic_gallery')
          .select('id, image_url')
          .eq('mechanic_id', id);
          
        if (galleryError) {
          console.error('Error fetching gallery:', galleryError);
        }
        
        // Format the mechanic data
        const profile = mechanicProfile.profiles as any;
        
        // Handle specialties
        let specialties: string[] = ['General Repairs'];
        if (typeof mechanicProfile.specialties === 'string') {
          specialties = mechanicProfile.specialties.split(',').map(s => s.trim());
        } else if (Array.isArray(mechanicProfile.specialties)) {
          specialties = mechanicProfile.specialties;
        }
        
        // Format the mechanic detail object
        const fullMechanic: MechanicDetail = {
          id: mechanicProfile.id,
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown Mechanic',
          avatar: profile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
          specialties,
          rating: mechanicProfile.rating || 0,
          reviewCount: mechanicProfile.review_count || 0,
          location: profile?.city ? `${profile.city}, ${profile.state}` : 'Location not specified',
          hourlyRate: mechanicProfile.hourly_rate || 0,
          yearsExperience: mechanicProfile.years_experience || 0,
          about: mechanicProfile.about || "No information provided",
          responseTime: mechanicProfile.response_time || 'Under 1 hour',
          services: services?.map(s => ({ 
            name: s.name,
            price: s.price
          })) || [
            { name: "Diagnostic Scan", price: 75 },
            { name: "Oil Change", price: 65 },
            { name: "Brake Inspection", price: 45 }
          ],
          reviews: reviews?.map(r => ({
            author: r.author,
            rating: r.rating,
            text: r.text
          })) || [],
          galleryImages: gallery?.map(g => g.image_url) || []
        };
        
        setMechanic(fullMechanic);
      } catch (error) {
        console.error('Error fetching mechanic data:', error);
        
        // Fallback to mock data if available
        if (id && mechanicsDetailedData[id]) {
          setMechanic(mechanicsDetailedData[id]);
        } else {
          setMechanic(mechanicsDetailedData['1']);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMechanicData();
  }, [id, navigate]);

  // Log the selected mechanic for debugging
  useEffect(() => {
    if (mechanic) {
      console.log('Selected mechanic profile:', {
        id: id,
        mechanicId: mechanic.id,
        mechanicName: mechanic.name
      });
    }
  }, [id, mechanic]);
  
  return { mechanic: mechanic as MechanicDetail, id, loading };
};
