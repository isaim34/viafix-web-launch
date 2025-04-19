
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceTitle: string;
}

// This would come from your backend in a real application
const sampleReviews: Review[] = [
  {
    id: '1',
    customerName: 'Emily Johnson',
    rating: 5,
    comment: 'Excellent service! Very professional and thorough.',
    date: '2025-04-15',
    serviceTitle: 'Full Car Inspection'
  },
  {
    id: '2',
    customerName: 'Michael Brown',
    rating: 4,
    comment: 'Good work, would recommend.',
    date: '2025-04-10',
    serviceTitle: 'Oil Change'
  }
];

const ReviewsTab = () => {
  if (sampleReviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Star className="h-8 w-8 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No Reviews Yet</h3>
          <p className="text-muted-foreground">You haven't received any reviews yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sampleReviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{review.customerName}</h3>
                <p className="text-sm text-muted-foreground">{review.serviceTitle}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsTab;
