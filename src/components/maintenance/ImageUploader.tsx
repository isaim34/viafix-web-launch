
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadMaintenanceImage, MaintenanceImage } from '@/services/maintenance/imageService';

interface ImageUploaderProps {
  maintenanceRecordId: string;
  onImageUploaded: (image: MaintenanceImage) => void;
  maxImages?: number;
  currentImageCount?: number;
}

export const ImageUploader = ({ 
  maintenanceRecordId, 
  onImageUploaded, 
  maxImages = 10,
  currentImageCount = 0 
}: ImageUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageType, setImageType] = useState<string>('general');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (currentImageCount + selectedFiles.length + validFiles.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images per maintenance record`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadPromises = selectedFiles.map(file => 
        uploadMaintenanceImage(file, maintenanceRecordId, imageType as MaintenanceImage['image_type'], description)
      );
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null) as MaintenanceImage[];
      
      if (successfulUploads.length > 0) {
        successfulUploads.forEach(image => onImageUploaded(image));
        
        toast({
          title: "Images uploaded successfully",
          description: `${successfulUploads.length} image(s) have been added to the maintenance record`,
        });
        
        // Reset form
        setSelectedFiles([]);
        setDescription('');
        setImageType('general');
      }
      
      if (results.some(result => result === null)) {
        toast({
          title: "Some uploads failed",
          description: "Please try uploading the failed images again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Add Images</h3>
            <span className="text-sm text-muted-foreground">
              ({currentImageCount}/{maxImages} images)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image-type">Image Type</Label>
              <Select value={imageType} onValueChange={setImageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before Work</SelectItem>
                  <SelectItem value="after">After Work</SelectItem>
                  <SelectItem value="parts">Parts/Components</SelectItem>
                  <SelectItem value="damage">Damage/Issues</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-input">Select Images</Label>
              <Input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what these images show..."
              rows={2}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files:</Label>
              <div className="grid grid-cols-1 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
