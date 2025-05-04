
import React from 'react';
import { Flag } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/Button';
import { ReportReasons } from './report/ReportReasons';
import { OtherReasonInput } from './report/OtherReasonInput';
import { IncidentDetails } from './report/IncidentDetails';
import { EvidenceUpload } from './report/EvidenceUpload';
import { useReportForm } from './report/useReportForm';

interface ReportMechanicDialogProps {
  mechanicId: string;
  mechanicName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ReportMechanicDialog: React.FC<ReportMechanicDialogProps> = ({
  mechanicId,
  mechanicName,
  open,
  onOpenChange,
}) => {
  const {
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
  } = useReportForm({
    mechanicId,
    mechanicName,
    onSuccess: () => onOpenChange && onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <ReportReasons 
            selectedReasons={selectedReasons} 
            onReasonChange={handleReasonChange} 
          />

          {selectedReasons.includes('other') && (
            <OtherReasonInput 
              otherReasonText={otherReasonText} 
              onChange={setOtherReasonText} 
            />
          )}

          <IncidentDetails 
            details={details} 
            onChange={setDetails} 
          />

          <EvidenceUpload 
            files={files} 
            onFileChange={handleFileChange} 
          />
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
