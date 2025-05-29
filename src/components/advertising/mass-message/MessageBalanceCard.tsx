
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface MessageBalanceCardProps {
  messagesAvailable: number;
  estimatedCount: number;
  isCountLoading: boolean;
  canAffordMessage: boolean;
}

export const MessageBalanceCard: React.FC<MessageBalanceCardProps> = ({
  messagesAvailable,
  estimatedCount,
  isCountLoading,
  canAffordMessage
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Message Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{messagesAvailable}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isCountLoading ? '...' : estimatedCount}
              </div>
              <div className="text-sm text-gray-600">Required</div>
            </div>
          </div>
          {!canAffordMessage && estimatedCount > 0 && (
            <div className="text-right">
              <div className="text-sm text-red-600 font-medium">
                Need {estimatedCount - messagesAvailable} more credits
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
