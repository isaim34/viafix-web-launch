
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface IncidentDetailsProps {
  details: string;
  onChange: (value: string) => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  details,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="report-details" className="text-sm font-medium block">
        Details of the incident
      </label>
      <Textarea
        id="report-details"
        value={details}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] w-full"
        placeholder="Please provide specific details about what happened, including dates and any communication you had with the mechanic"
      />
    </div>
  );
};
