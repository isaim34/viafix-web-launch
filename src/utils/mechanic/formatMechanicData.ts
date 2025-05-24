import { MechanicDetail, Service, Review } from '@/types/mechanic';

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
 * Create a local mechanic profile (for default vendor or logged-in mechanic)
 */
export const createLocalMechanicProfile = (
  id: string,
  vendorName: string,
  vendorAvatar: string,
  mechanicProfile: Record<string, any>,
  reviews: Review[]
): MechanicDetail => {
  // Calculate rating from reviews
  let rating = 5.0;
  const reviewCount = reviews.length;
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    rating = totalRating / reviewCount;
  }

  // Use Austin, TX as the default location for test vendors
  const location = mechanicProfile.location || 'Austin, TX';
  
  return {
    id,
    name: vendorName,
    avatar: vendorAvatar,
    specialties: typeof mechanicProfile.specialties === 'string' 
      ? mechanicProfile.specialties.split(',').map((s: string) => s.trim())
      : Array.isArray(mechanicProfile.specialties) ? mechanicProfile.specialties : ['General Repairs'],
    rating,
    reviewCount,
    location, // Use the consistent location
    hourlyRate: mechanicProfile.hourlyRate ? parseInt(mechanicProfile.hourlyRate) : 85,
    responseTime: mechanicProfile.responseTime || 'Under 1 hour',
    yearsExperience: mechanicProfile.yearsExperience || 5,
    about: mechanicProfile.about || 'Certified mechanic specializing in general vehicle maintenance and repairs. I provide honest, reliable service at competitive rates.',
    services: [
      { id: 'oil-change', name: 'Oil Change', price: 50 },
      { id: 'brake-service', name: 'Brake Service', price: 150 },
      { id: 'diagnostics', name: 'Diagnostics', price: 100 }
    ],
    reviews,
    galleryImages: [
      'https://images.unsplash.com/photo-1632823471565-1ecdf7a7e9b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  };
};
