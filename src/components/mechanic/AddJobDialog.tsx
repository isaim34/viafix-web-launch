
import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CompletedJob } from './types/completedJobTypes';

interface AddJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: CompletedJob) => void;
}

export const AddJobDialog = ({ isOpen, onOpenChange, onAddJob }: AddJobDialogProps) => {
  const [newJob, setNewJob] = useState<Partial<CompletedJob>>({
    title: '',
    description: '',
    vehicleType: '',
    completionDate: new Date().toISOString().split('T')[0],
    imageUrls: [],
  });
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const handleAddImage = () => {
    if (!imageUrl) return;
    
    // Basic URL validation
    try {
      new URL(imageUrl);
      setNewJob({
        ...newJob,
        imageUrls: [...(newJob.imageUrls || []), imageUrl]
      });
      setImageUrl('');
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(newJob.imageUrls || [])];
    updatedImages.splice(index, 1);
    setNewJob({
      ...newJob,
      imageUrls: updatedImages
    });
  };

  const handleSubmit = () => {
    if (!newJob.title || !newJob.description || !newJob.vehicleType || (newJob.imageUrls?.length === 0)) {
      toast({
        title: "Missing information",
        description: "Please fill all fields and add at least one image",
        variant: "destructive"
      });
      return;
    }

    const job: CompletedJob = {
      id: Date.now().toString(), // In a real app, this would come from the backend
      title: newJob.title || '',
      description: newJob.description || '',
      vehicleType: newJob.vehicleType || '',
      completionDate: newJob.completionDate || new Date().toISOString().split('T')[0],
      imageUrls: newJob.imageUrls || [],
      customerName: "Anonymous Customer" // In a real app, this would be the real customer name
    };

    onAddJob(job);
    
    // Reset form
    setNewJob({
      title: '',
      description: '',
      vehicleType: '',
      completionDate: new Date().toISOString().split('T')[0],
      imageUrls: [],
    });
    
    onOpenChange(false);
    
    toast({
      title: "Job Added",
      description: "Your completed job has been added to your profile",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Completed Job</DialogTitle>
          <DialogDescription>
            Showcase your work to potential customers. Add details and photos of a completed repair job.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="title" className="text-sm font-medium">
              Job Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Engine Rebuild, Brake System Replacement"
              value={newJob.title}
              onChange={(e) => setNewJob({...newJob, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="vehicleType" className="text-sm font-medium">
              Vehicle Type
            </label>
            <Input
              id="vehicleType"
              placeholder="e.g., 2018 Honda Civic, Ford F-150"
              value={newJob.vehicleType}
              onChange={(e) => setNewJob({...newJob, vehicleType: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe the work performed, challenges, and results..."
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="completionDate" className="text-sm font-medium">
              Completion Date
            </label>
            <Input
              id="completionDate"
              type="date"
              value={newJob.completionDate}
              onChange={(e) => setNewJob({...newJob, completionDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm font-medium">Job Photos</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddImage}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            
            {newJob.imageUrls && newJob.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newJob.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Job photo ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Add photos of the job before, during, and after completion
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
