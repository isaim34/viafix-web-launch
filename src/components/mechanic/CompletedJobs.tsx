
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, ImageIcon, X, Camera, Calendar, FileText, Clipboard, CheckCircle } from 'lucide-react';
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
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceRecord } from '@/types/customer';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export interface CompletedJob {
  id: string;
  title: string;
  description: string;
  vehicleType: string;
  completionDate: string;
  imageUrls: string[];
  customerName?: string;
  customerMaintenanceRecord?: MaintenanceRecord;
}

interface CompletedJobsProps {
  jobs?: CompletedJob[];
  mechanicId: string;
}

export const CompletedJobs = ({ jobs = [], mechanicId }: CompletedJobsProps) => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>(jobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<CompletedJob>>({
    title: '',
    description: '',
    vehicleType: '',
    completionDate: new Date().toISOString().split('T')[0],
    imageUrls: [],
  });
  const [imageUrl, setImageUrl] = useState('');
  const [showMaintenanceRecord, setShowMaintenanceRecord] = useState<string | null>(null);
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

    setCompletedJobs([job, ...completedJobs]);
    setNewJob({
      title: '',
      description: '',
      vehicleType: '',
      completionDate: new Date().toISOString().split('T')[0],
      imageUrls: [],
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Job Added",
      description: "Your completed job has been added to your profile",
    });
  };

  return (
    <>
      <motion.div 
        className="glass-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Completed Jobs</h2>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Job
          </Button>
        </div>

        {completedJobs.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No completed jobs yet</p>
            <p className="text-sm text-muted-foreground mb-4">Showcase your best work to attract more customers</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-4 w-4" />
              Add Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedJobs.map((job) => (
              <div key={job.id} className="border rounded-lg overflow-hidden bg-white">
                <div className="relative h-48">
                  <img 
                    src={job.imageUrls[0]} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  {job.imageUrls.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      +{job.imageUrls.length - 1}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{job.vehicleType}</p>
                  <p className="text-sm mb-2">{job.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(job.completionDate).toLocaleDateString()}
                    </span>
                    {job.customerName && (
                      <span>Customer: {job.customerName}</span>
                    )}
                  </div>
                  
                  {job.customerMaintenanceRecord && (
                    <div className="mt-3 pt-3 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-1 flex items-center gap-2 text-xs"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View Customer Maintenance Record
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>FixIQ Maintenance Record</DialogTitle>
                            <DialogDescription>
                              Service details documented in customer's FixIQ maintenance log
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="bg-muted/30 p-3 rounded-md border">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Signed Off
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(job.customerMaintenanceRecord.date), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <h3 className="font-medium mb-1">{job.customerMaintenanceRecord.vehicle}</h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                {job.customerMaintenanceRecord.serviceType}
                              </p>
                              {job.customerMaintenanceRecord.vin && (
                                <p className="text-xs text-muted-foreground mb-3">
                                  VIN: {job.customerMaintenanceRecord.vin}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Service Description</h4>
                              <p className="text-sm p-3 bg-muted/20 rounded-md">
                                {job.customerMaintenanceRecord.description}
                              </p>
                            </div>
                            
                            {job.customerMaintenanceRecord.mechanicNotes && 
                             job.customerMaintenanceRecord.mechanicNotes.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Your Notes</h4>
                                <ul className="space-y-2">
                                  {job.customerMaintenanceRecord.mechanicNotes.map((note, index) => (
                                    <li key={index} className="text-sm flex gap-2">
                                      <Clipboard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span>{note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </>
  );
};
