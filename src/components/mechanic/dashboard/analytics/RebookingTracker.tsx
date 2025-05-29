
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { useRebookingAnalytics } from './useRebookingAnalytics';

export const RebookingTracker = () => {
  const { analytics, followUpSuggestions, loading } = useRebookingAnalytics();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Rebooking Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.rebookingRate}%
            </div>
            <div className="text-sm text-blue-700">Rebooking Rate</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analytics.repeatCustomers}
            </div>
            <div className="text-sm text-green-700">Repeat Customers</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <TrendingUp className="h-5 w-5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <strong>Industry Average:</strong> 35% rebooking rate. You're {analytics.rebookingRate >= 35 ? 'above' : 'below'} average!
          </div>
        </div>

        {followUpSuggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Follow-up Suggestions:</h4>
            {followUpSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    Customer <strong>{suggestion.customerName}</strong> hasn't rebooked in {suggestion.daysSince} days
                  </span>
                </div>
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-100">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
        )}

        {analytics.rebookingRate < 35 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Regular FixIQ maintenance logging increases customer trust and rebooking rates by up to 40%!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
