import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ZipCodeInput from './ZipCodeInput';
import CertificationSection from './CertificationSection';
import EducationSection from './EducationSection';
import ProfilePictureUploader from './ProfilePictureUploader';
import CompletedJobsTab from './CompletedJobsTab';

const basicProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least $1"),
  profileImage: z.string().url("Please enter a valid URL").optional(),
  yearsExperience: z.coerce.number().min(0, "Experience can't be negative"),
  about: z.string().min(20, "About section must be at least 20 characters"),
  specialties: z.string().min(3, "Specialties are required"),
});

type BasicProfileFormValues = z.infer<typeof basicProfileSchema>;

const sampleMechanicProfile = {
  firstName: 'Alex',
  lastName: 'Johnson',
  zipCode: '90210',
  phone: '3105550123',
  hourlyRate: 85,
  profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  yearsExperience: 8,
  about: "Certified master mechanic with over 8 years of experience specializing in German and Japanese vehicles. I take pride in providing honest, high-quality service at fair prices. My mobile setup allows me to perform most repairs and maintenance directly at your location.",
  specialties: "Engine Repair, Diagnostics, Oil Changes, Brake Replacement",
};

const ProfileEditor = () => {
  const form = useForm<BasicProfileFormValues>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: sampleMechanicProfile,
  });

  const onSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    // In a real app, this would save to a database
  };

  const handleProfileImageChange = (url: string) => {
    form.setValue('profileImage', url);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="completed-jobs">Completed Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center mb-8">
                  <ProfilePictureUploader
                    initialImageUrl={form.getValues('profileImage')}
                    onImageChange={handleProfileImageChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ZipCodeInput 
                    control={form.control}
                    description="This helps customers find you" 
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                            maxLength={10}
                          />
                        </FormControl>
                        <FormDescription>
                          10-digit number (digits only)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to your professional profile photo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialties</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        List your specialties separated by commas (e.g. "Brake Repair, Engine Diagnostics")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[150px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Tell customers about your experience, expertise and approach
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
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
    </div>
  );
};

export default ProfileEditor;
