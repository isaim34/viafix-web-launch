
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Star, Award, Camera, FileText } from 'lucide-react';
import { useMechanicProgress } from './useMechanicProgress';

export const MechanicProgressTracker = () => {
  const { progress, loading, refetch } = useMechanicProgress();

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('Profile update event received, refetching progress...');
      if (refetch) {
        refetch();
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [refetch]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  const milestones = [
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add all required profile information',
      completed: progress.profileComplete,
      icon: FileText,
      points: 25
    },
    {
      id: 'verification',
      title: 'Upload Verification',
      description: 'Add certifications or gallery images',
      completed: progress.hasVerification,
      icon: Camera,
      points: 25
    },
    {
      id: 'firstLog',
      title: 'First FixIQ Log',
      description: 'Record your first maintenance entry',
      completed: progress.hasMaintenanceRecord,
      icon: Circle,
      points: 25
    },
    {
      id: 'review',
      title: 'First 5-Star Review',
      description: 'Receive your first excellent review',
      completed: progress.hasFiveStarReview,
      icon: Star,
      points: 25
    }
  ];

  const completedMilestones = milestones.filter(m => m.completed).length;
  const progressPercentage = (completedMilestones / milestones.length) * 100;

  const getBadgeLevel = () => {
    if (progressPercentage === 100) return { title: 'Elite Mechanic', color: 'bg-purple-500' };
    if (progressPercentage >= 75) return { title: 'Verified Pro', color: 'bg-blue-500' };
    if (progressPercentage >= 50) return { title: 'Rising Star', color: 'bg-green-500' };
    return { title: 'New Mechanic', color: 'bg-gray-500' };
  };

  const badge = getBadgeLevel();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Professional Progress
          </CardTitle>
          <Badge className={`${badge.color} text-white`}>
            {badge.title}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {completedMilestones}/{milestones.length} milestones</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {milestones.map((milestone) => {
            const Icon = milestone.icon;
            return (
              <div 
                key={milestone.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  milestone.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {milestone.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    milestone.completed ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {milestone.title}
                  </h4>
                  <p className={`text-xs ${
                    milestone.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {progressPercentage < 100 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Complete all milestones to unlock premium features and increase your booking rate!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
