
import React from 'react';

interface CostSummaryProps {
  estimatedCount: number;
  messagesAvailable: number;
  canAffordMessage: boolean;
}

export const CostSummary: React.FC<CostSummaryProps> = ({
  estimatedCount,
  messagesAvailable,
  canAffordMessage
}) => {
  if (estimatedCount === 0) return null;

  return (
    <div className={`p-4 rounded-lg border ${canAffordMessage ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Cost Summary</span>
        <div className={`px-2 py-1 rounded text-xs font-medium ${canAffordMessage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {canAffordMessage ? 'Affordable' : 'Insufficient Credits'}
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Target customers:</span>
          <span className="font-medium">{estimatedCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Credits required:</span>
          <span className="font-medium">{estimatedCount} credits</span>
        </div>
        <div className="flex justify-between">
          <span>Your balance:</span>
          <span className={`font-medium ${canAffordMessage ? 'text-green-600' : 'text-red-600'}`}>
            {messagesAvailable} credits
          </span>
        </div>
      </div>
    </div>
  );
};
