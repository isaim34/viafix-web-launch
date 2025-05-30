
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Eye, Download, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceImage, deleteMaintenanceImage } from '@/services/maintenance/imageService';

interface ImageGalleryProps {
  images: MaintenanceImage[];
  onImageDeleted: (imageId: string) => void;
  allowDelete?: boolean;
}

export const ImageGallery = ({ images, onImageDeleted, allowDelete = false }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<MaintenanceImage | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImageId(imageId);
    
    try {
      const success = await deleteMaintenanceImage(imageId);
      
      if (success) {
        onImageDeleted(imageId);
        toast({
          title: "Image deleted",
          description: "The image has been removed from the maintenance record",
        });
      } else {
        toast({
          title: "Delete failed",
          description: "There was an error deleting the image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the image",
        variant: "destructive"
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  const getImageTypeColor = (type: MaintenanceImage['image_type']) => {
    switch (type) {
      case 'before': return 'bg-blue-100 text-blue-800';
      case 'after': return 'bg-green-100 text-green-800';
      case 'parts': return 'bg-yellow-100 text-yellow-800';
      case 'damage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageTypeLabel = (type: MaintenanceImage['image_type']) => {
    switch (type) {
      case 'before': return 'Before';
      case 'after': return 'After';
      case 'parts': return 'Parts';
      case 'damage': return 'Damage';
      default: return 'General';
    }
  };

  const handleDownload = async (image: MaintenanceImage) => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance-image-${image.id}.${image.mime_type?.split('/')[1] || 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the image",
        variant: "destructive"
      });
    }
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No images available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Maintenance Images ({images.length})
        </CardTitle>
      </CardHeader>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={image.image_url}
                alt={image.description || 'Maintenance image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge className={`text-xs ${getImageTypeColor(image.image_type)}`}>
                  {getImageTypeLabel(image.image_type)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-3">
              {image.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {image.description}
                </p>
              )}
              
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Badge className={getImageTypeColor(image.image_type)}>
                          {getImageTypeLabel(image.image_type)}
                        </Badge>
                        Maintenance Image
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img
                        src={image.image_url}
                        alt={image.description || 'Maintenance image'}
                        className="w-full max-h-96 object-contain rounded-md"
                      />
                      {image.description && (
                        <p className="text-sm text-muted-foreground">{image.description}</p>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => handleDownload(image)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(image)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                
                {allowDelete && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deletingImageId === image.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
