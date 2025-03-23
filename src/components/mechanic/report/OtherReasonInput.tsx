
import React from 'react';
import { Input } from '@/components/ui/input';

interface OtherReasonInputProps {
  otherReasonText: string;
  onChange: (value: string) => void;
}

export const OtherReasonInput: React.FC<OtherReasonInputProps> = ({
  otherReasonText,
  onChange,
}) => {
  return (
    <div className="mt-3">
      <label htmlFor="other-reason" className="text-sm font-medium block mb-1.5">
        Please specify other reason:
      </label>
      <Input
        id="other-reason"
        value={otherReasonText}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        placeholder="Describe the reason"
      />
    </div>
  );
};
