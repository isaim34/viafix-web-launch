
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicProfileForm from './BasicProfileForm';
import CertificationSection from '@/components/certifications/CertificationSection';
import EducationSection from '@/components/education/EducationSection';
import CompletedJobsTab from '@/components/CompletedJobsTab';
import { BasicProfileFormValues } from '@/schemas/profileSchema';

interface ProfileTabsProps {
  onProfileSubmit?: (data: BasicProfileFormValues) => void;
  initialProfileData?: BasicProfileFormValues;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ onProfileSubmit, initialProfileData }) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="completed-jobs">Completed Jobs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <Card className="p-6">
          <BasicProfileForm onSubmit={onProfileSubmit} initialData={initialProfileData} />
        </Card>
      </TabsContent>
      
      <TabsContent value="certifications">
        <CertificationSection />
      </TabsContent>
      
      <TabsContent value="education">
        <EducationSection />
      </TabsContent>
      
      <TabsContent value="completed-jobs">
        <CompletedJobsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
