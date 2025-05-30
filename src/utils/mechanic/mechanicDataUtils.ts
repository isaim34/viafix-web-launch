
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { MechanicProfile } from '@/hooks/useMechanics';

export const getVendorInfo = () => {
  const vendorName = localStorage.getItem('vendorName') || 'Isai Mercado';
  const vendorAvatar = localStorage.getItem('vendorAvatar') || 
                       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80';
  
  // Always store these values for consistency
  localStorage.setItem('vendorName', vendorName);
  localStorage.setItem('vendorAvatar', vendorAvatar);
  
  return { vendorName, vendorAvatar };
};

export const getLocalMechanicReviews = (mechanicId: string) => {
  const localReviews = JSON.parse(localStorage.getItem('special_mechanic_reviews') || '[]');
  return localReviews.filter((review: any) => review.mechanic_id === mechanicId);
};

export const calculateMechanicRating = (reviews: any[]) => {
  let rating = 5.0;
  const reviewCount = reviews.length;
  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    rating = totalRating / reviewCount;
  }
  return { rating, reviewCount };
};

export const formatSpecialties = (specialties: string | string[] | undefined): string[] => {
  if (typeof specialties === 'string') {
    return specialties.split(',').map(s => s.trim());
  }
  if (Array.isArray(specialties)) {
    return specialties;
  }
  return [];
};

export const createLocalMechanicProfile = (
  localMechanicProfile: BasicProfileFormValues,
  locationName: string,
  userRole: string
): MechanicProfile => {
  const localUserName = localStorage.getItem('userName');
  const userAvatar = localStorage.getItem('mechanicAvatar') || 
                     localStorage.getItem('mechanic-avatar') || 
                     localMechanicProfile.profileImage;
  
  const reviews = getLocalMechanicReviews('local-mechanic');
  const { rating, reviewCount } = calculateMechanicRating(reviews);
  const specialtiesArray = formatSpecialties(localMechanicProfile.specialties);
  
  const localMechanic = {
    id: 'local-mechanic',
    name: localUserName || `${localMechanicProfile.firstName} ${localMechanicProfile.lastName}`,
    avatar: userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    specialties: specialtiesArray,
    rating: rating,
    reviewCount: reviewCount,
    location: locationName || 'Worcester, MA',
    hourlyRate: localMechanicProfile.hourlyRate || 75,
    zipCode: localMechanicProfile.zipCode || '01605'
  };
  
  // Store consistent vendor information
  const { vendorName, vendorAvatar } = getVendorInfo();
  localStorage.setItem('vendorName', localMechanic.name);
  localStorage.setItem('vendorAvatar', localMechanic.avatar);
  
  return localMechanic;
};

export const createDefaultVendorMechanic = (
  locationName: string,
  zipCode: string
): MechanicProfile => {
  const { vendorName, vendorAvatar } = getVendorInfo();
  const reviews = getLocalMechanicReviews('default-vendor');
  const { rating, reviewCount } = calculateMechanicRating(reviews);
  
  return {
    id: 'local-mechanic',
    name: vendorName,
    avatar: vendorAvatar,
    specialties: ['General Repairs', 'Diagnostics', 'Oil Changes'],
    rating: rating,
    reviewCount: reviewCount,
    location: locationName || 'Worcester, MA',
    hourlyRate: 75,
    zipCode: zipCode || '01605'
  };
};
