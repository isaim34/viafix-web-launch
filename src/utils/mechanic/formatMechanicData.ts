
import { MechanicDetail } from '@/types/mechanic';

/**
 * Format mechanic data from Supabase into a MechanicDetail object
 */
export const formatMechanicProfile = (
  mechanicProfile: any,
  profile: any,
  services: any[] = [],
  reviews: any[] = [],
  gallery: any[] = []
): MechanicDetail => {
  // Handle specialties
  let specialties: string[] = ['General Repairs'];
  if (typeof mechanicProfile.specialties === 'string') {
    specialties = mechanicProfile.specialties.split(',').map((s: string) => s.trim());
  } else if (Array.isArray(mechanicProfile.specialties)) {
    specialties = mechanicProfile.specialties;
  }
  
  // Format the mechanic detail object
  return {
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
};

/**
 * Create a custom mechanic object for local/default mechanic
 */
export const createLocalMechanicProfile = (
  id: string,
  vendorName: string, 
  vendorAvatar: string,
  mechanicProfile: Record<string, any>,
  reviews: any[] = []
): MechanicDetail => {
  // Handle specialties based on its type
  let specialties: string[] = ['General Repairs', 'Diagnostics']; // Default specialties
  
  if (mechanicProfile.specialties !== undefined) {
    const specialtiesValue = mechanicProfile.specialties;
    
    if (typeof specialtiesValue === 'string') {
      // If it's a string, split it by commas
      specialties = specialtiesValue.split(',').map(s => s.trim());
    } else if (Array.isArray(specialtiesValue)) {
      // If it's already an array, use it directly but ensure it's string[]
      specialties = specialtiesValue.map(s => String(s));
    }
  }

  return {
    id: id || 'local-mechanic',
    name: vendorName,
    avatar: vendorAvatar,
    specialties: specialties,
    rating: 5.0,
    reviewCount: reviews?.length || 0,
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
    reviews: reviews?.map(r => ({
      author: r.author,
      rating: r.rating,
      text: r.text
    })) || [],
    galleryImages: [
      'https://images.unsplash.com/photo-1632931612869-c1a971a02054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ]
  };
};
