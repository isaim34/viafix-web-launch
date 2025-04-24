
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { gigSchema, GigFormValues, Gig } from '@/components/gig/types';
import TitleAndDescriptionFields from '@/components/gig/TitleAndDescriptionFields';
import PriceAndDurationFields from '@/components/gig/PriceAndDurationFields';
import ImageUploader from '@/components/gig/ImageUploader';

interface GigFormProps {
  gig?: Gig | null;
  onSubmit: (values: GigFormValues & { id?: string; status?: string }) => void;
  onCancel: () => void;
}

const GigForm = ({ gig, onSubmit, onCancel }: GigFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(gig?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      title: gig?.title || '',
      description: gig?.description || '',
      price: gig?.price || 0,
      duration: gig?.duration || '',
      image: gig?.image || '',
    },
  });

  // Reset form values when the gig prop changes
  useEffect(() => {
    if (gig) {
      console.log("Editing gig:", gig);
      form.reset({
        title: gig.title,
        description: gig.description,
        price: gig.price,
        duration: gig.duration,
        image: gig.image,
      });
      setPreviewImage(gig.image);
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        duration: '',
        image: '',
      });
      setPreviewImage(null);
    }
  }, [gig, form]);

  const handleSubmit = (values: GigFormValues) => {
    // Pass existing id and status when editing
    const submissionData = {
      ...values,
      id: gig?.id,
      status: gig?.status
    };
    
    console.log("Submitting gig data:", submissionData);
    onSubmit(submissionData);
  };

  const handleImageChange = (file: File | string) => {
    if (file instanceof File) {
      setIsUploading(true);
      // Set preview image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
      // Set form value
      form.setValue('image', file);
    } else {
      setPreviewImage(file || null);
      form.setValue('image', file);
    }
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    form.setValue('image', '');
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {gig ? 'Edit Service Gig' : 'Create New Service Gig'}
        </h3>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <TitleAndDescriptionFields form={form} />
            <PriceAndDurationFields form={form} />
            
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <ImageUploader 
                  previewImage={previewImage}
                  onImageChange={handleImageChange}
                  onClearImage={handleClearImage}
                  isUploading={isUploading}
                />
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {gig ? 'Update' : 'Create'} Gig
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GigForm;
