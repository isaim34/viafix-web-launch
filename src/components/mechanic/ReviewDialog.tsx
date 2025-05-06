
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddReviewForm } from './AddReviewForm';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mechanicId: string;
  mechanicName: string;
  onSuccess: () => void;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  mechanicId,
  mechanicName,
  onSuccess
}: ReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Leave a Review for {mechanicName}</DialogTitle>
        </DialogHeader>
        <AddReviewForm 
          mechanicId={mechanicId} 
          mechanicName={mechanicName} 
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
