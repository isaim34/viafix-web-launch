
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CompletedJob, CompletedJobsProps } from './types/completedJobTypes';
import { JobCard } from './JobCard';
import { AddJobDialog } from './AddJobDialog';
import { EmptyJobsState } from './EmptyJobsState';

export const CompletedJobs = ({ jobs = [], mechanicId }: CompletedJobsProps) => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>(jobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddJob = (job: CompletedJob) => {
    setCompletedJobs([job, ...completedJobs]);
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
          <EmptyJobsState onAddJobClick={() => setIsDialogOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </motion.div>

      <AddJobDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddJob={handleAddJob}
      />
    </>
  );
};
