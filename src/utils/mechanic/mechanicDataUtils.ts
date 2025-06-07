
import { MechanicProfile } from '@/hooks/useMechanics';

export const calculateMechanicRating = (reviews: any[]) => {
  let rating = 0;
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
