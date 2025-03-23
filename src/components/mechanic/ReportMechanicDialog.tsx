
import React, { useState } from 'react';
import { Flag, Upload } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

// Predefined reasons for reporting
const reportReasons = [
  { id: 'no-show', label: 'Mechanic did not show up for appointment' },
  { id: 'poor-work', label: 'Poor quality of work' },
  { id: 'overcharging', label: 'Charged more than agreed upon price' },
  { id: 'unprofessional', label: 'Unprofessional behavior' },
  { id: 'misleading', label: 'Misleading information in profile' },
  { id: 'other', label: 'Other reason' },
];

interface ReportMechanicDialogProps {
  mechanicId: string;
  mechanicName: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ReportMechanicDialog: React.FC<ReportMechanicDialogProps> = ({
  mechanicId,
  mechanicName,
  isOpen,
  onOpenChange,
}) => {
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

  const handleSubmit = async () => {
    // Validate form
    if (selectedReasons.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one reason for reporting",
        variant: "destructive",
      });
      return;
    }

    if (selectedReasons.includes('other') && !otherReasonText.trim()) {
      toast({
        title: "Error",
        description: "Please provide details for 'Other' reason",
        variant: "destructive",
      });
      return;
    }

    if (!details.trim()) {
      toast({
        title: "Error",
        description: "Please provide details about the incident",
        variant: "destructive",
      });
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

      // Reset form and close dialog
      setSelectedReasons([]);
      setOtherReasonText('');
      setDetails('');
      setFiles(null);
      setIsSubmitting(false);

      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Report {mechanicName}
          </DialogTitle>
          <DialogDescription>
            Report this mechanic for violating our terms of service or engaging in bad business practices.
            Our team will review your report and take appropriate action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Reason for reporting</h4>
            <div className="grid gap-3">
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={reason.id} 
                    checked={selectedReasons.includes(reason.id)}
                    onCheckedChange={(checked) => 
                      handleReasonChange(reason.id, checked === true)
                    }
                  />
                  <label 
                    htmlFor={reason.id} 
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {reason.label}
                  </label>
                </div>
              ))}
            </div>

            {selectedReasons.includes('other') && (
              <div className="mt-3">
                <label htmlFor="other-reason" className="text-sm font-medium">
                  Please specify other reason:
                </label>
                <Input
                  id="other-reason"
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  className="mt-1"
                  placeholder="Describe the reason"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="report-details" className="text-sm font-medium">
              Details of the incident
            </label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
              placeholder="Please provide specific details about what happened, including dates and any communication you had with the mechanic"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="evidence-upload" className="text-sm font-medium">
              Upload evidence (optional)
            </label>
            <div className="border border-input rounded-md p-4">
              <Input
                id="evidence-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="evidence-upload" 
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload images or documents
                </span>
                <span className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, PDF (max 5MB each)
                </span>
              </label>
              {files && files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="text-sm text-muted-foreground">
                    {Array.from(files).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange && onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={<Flag className="w-4 h-4" />}
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportMechanicDialog;
