
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { FeaturedPlanCard } from './FeaturedPlanCard';

interface FeaturedPlansSectionProps {
  featuredDailyPrice: number;
  onPurchaseFeatured: (days: number) => void;
}

export const FeaturedPlansSection: React.FC<FeaturedPlansSectionProps> = ({
  featuredDailyPrice,
  onPurchaseFeatured
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeaturedPlanCard 
          title="1 Day Spotlight"
          price={featuredDailyPrice}
          description="Get featured in the homepage for 24 hours"
          days={1}
          onPurchase={onPurchaseFeatured}
        />
        
        <FeaturedPlanCard 
          title="Weekly Spotlight"
          price={featuredDailyPrice * 7 * 0.9}
          description="Get featured in the homepage for 7 days (10% discount)"
          days={7}
          onPurchase={onPurchaseFeatured}
          recommended
        />
        
        <FeaturedPlanCard 
          title="Monthly Spotlight"
          price={featuredDailyPrice * 30 * 0.8}
          description="Get featured in the homepage for 30 days (20% discount)"
          days={30}
          onPurchase={onPurchaseFeatured}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefits of Being Featured</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Prominent placement on the homepage</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Higher visibility in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Featured badge on your profile</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Star className="h-3 w-3 text-green-600" />
              </div>
              <span>Up to 3x more profile views</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
