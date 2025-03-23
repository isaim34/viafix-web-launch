
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

// Predefined reasons for reporting
export const reportReasons = [
  { id: 'no-show', label: 'Mechanic did not show up for appointment' },
  { id: 'poor-work', label: 'Poor quality of work' },
  { id: 'overcharging', label: 'Charged more than agreed upon price' },
  { id: 'unprofessional', label: 'Unprofessional behavior' },
  { id: 'misleading', label: 'Misleading information in profile' },
  { id: 'other', label: 'Other reason' },
];

interface ReportReasonsProps {
  selectedReasons: string[];
  onReasonChange: (reasonId: string, checked: boolean) => void;
}

export const ReportReasons: React.FC<ReportReasonsProps> = ({
  selectedReasons,
  onReasonChange,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-base sm:text-lg">Reason for reporting</h4>
      <div className="grid gap-3">
        {reportReasons.map((reason) => (
          <div key={reason.id} className="flex items-start space-x-3">
            <Checkbox 
              id={reason.id} 
              checked={selectedReasons.includes(reason.id)}
              onCheckedChange={(checked) => 
                onReasonChange(reason.id, checked === true)
              }
              className="mt-0.5"
            />
            <label 
              htmlFor={reason.id} 
              className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {reason.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
