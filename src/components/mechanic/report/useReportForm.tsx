
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ReportFormData {
  mechanicId: string;
  mechanicName: string;
  reasons: string[];
  otherReason: string;
  details: string;
  files: FileList | null;
}

interface UseReportFormProps {
  mechanicId: string;
  mechanicName: string;
  onSuccess: () => void;
}

export const useReportForm = ({ mechanicId, mechanicName, onSuccess }: UseReportFormProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [details, setDetails] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReasonChange = (reasonId: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons([...selectedReasons, reasonId]);
    } else {
      setSelectedReasons(selectedReasons.filter(id => id !== reasonId));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const validateForm = (): boolean => {
    if (selectedReasons.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one reason for reporting",
        variant: "destructive",
      });
      return false;
    }

    if (selectedReasons.includes('other') && !otherReasonText.trim()) {
      toast({
        title: "Error",
        description: "Please provide details for 'Other' reason",
        variant: "destructive",
      });
      return false;
    }

    if (!details.trim()) {
      toast({
        title: "Error",
        description: "Please provide details about the incident",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your backend
      console.log('Report data:', {
        mechanicId,
        mechanicName,
        reasons: selectedReasons,
        otherReason: otherReasonText,
        details,
        files,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      });

      // Reset form and signal success
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedReasons([]);
    setOtherReasonText('');
    setDetails('');
    setFiles(null);
  };

  return {
    selectedReasons,
    otherReasonText,
    details,
    files,
    isSubmitting,
    handleReasonChange,
    setOtherReasonText,
    setDetails,
    handleFileChange,
    handleSubmit,
  };
};
