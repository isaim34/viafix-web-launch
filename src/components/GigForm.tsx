
import React, { useState } from 'react';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Image, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

// Updated schema to make image truly optional
const gigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  duration: z.string().min(1, "Duration is required"),
  image: z.union([
    z.instanceof(File).optional(),
    z.string().optional()
  ]).optional(),
});

type GigFormValues = z.infer<typeof gigSchema>;

interface GigFormProps {
  gig?: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    status: string;
  } | null;
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

  const handleSubmit = (values: GigFormValues) => {
    onSubmit({ 
      ...values, 
      id: gig?.id,
      status: gig?.status
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Set preview image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Set form value
      onChange(file);
      setIsUploading(false);
    }
  };

  const clearImage = (onChange: (value: any) => void) => {
    setPreviewImage(null);
    onChange('');
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engine Diagnostic Service" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, specific title for your service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service in detail..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Explain what's included, your process, and what customers can expect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1 hour, 30 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image <span className="text-muted-foreground">(optional)</span></FormLabel>
                  
                  {previewImage ? (
                    <div className="relative border rounded-md overflow-hidden aspect-video">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => clearImage(onChange)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <FormControl>
                      <div 
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <div className="flex flex-col items-center justify-center gap-1 text-center">
                          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Upload className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-sm font-medium">
                            Click to upload image
                          </div>
                          <div className="text-xs text-muted-foreground">
                            JPG, PNG or GIF (max. 5MB)
                          </div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e, onChange)}
                            disabled={isUploading}
                            {...field}
                          />
                        </div>
                      </div>
                    </FormControl>
                  )}
                  <FormDescription>
                    Optional: Use a high-quality image that represents your service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
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
