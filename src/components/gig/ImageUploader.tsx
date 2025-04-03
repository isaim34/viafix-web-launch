
import React, { useState } from 'react';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  previewImage: string | null;
  onImageChange: (file: File | string) => void;
  onClearImage: () => void;
  isUploading: boolean;
}

const ImageUploader = ({ 
  previewImage, 
  onImageChange, 
  onClearImage,
  isUploading 
}: ImageUploaderProps) => {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      onImageChange(file);
    }
  };

  return (
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
            onClick={onClearImage}
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
                onChange={handleImageUpload}
                disabled={isUploading}
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
  );
};

export default ImageUploader;
