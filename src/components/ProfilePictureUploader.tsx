
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploaderProps {
  initialImageUrl?: string;
  onImageChange: (url: string) => void;
}

const ProfilePictureUploader = ({
  initialImageUrl = '',
  onImageChange
}: ProfilePictureUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    if (initialImageUrl && initialImageUrl !== imageUrl) {
      console.log('Updating image URL from props:', initialImageUrl.substring(0, 50) + '...');
      setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl, imageUrl]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview of the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        console.log('Image selected, data URL length:', dataUrl.length);
        
        // Set the image URL in local state for display
        setImageUrl(dataUrl);
        
        // Pass to parent component immediately
        onImageChange(dataUrl);
        
        // Store in localStorage for immediate visibility
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        
        if (userRole === 'customer' && userId) {
          localStorage.setItem(`customer-${userId}-profileImage`, dataUrl);
          localStorage.setItem('customerAvatar', dataUrl);
        } else if (userRole === 'mechanic') {
          localStorage.setItem('mechanicAvatar', dataUrl);
        }
        
        toast({
          title: "Profile picture updated",
          description: "Click Save Changes to permanently save your new picture",
        });
      }
    };
    reader.readAsDataURL(file);
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-primary">
          <AvatarImage src={imageUrl} alt="Profile picture" />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
            {imageUrl ? '...' : 'ME'}
          </AvatarFallback>
        </Avatar>
        <Button 
          size="icon" 
          className="absolute bottom-0 right-0 rounded-full w-8 h-8"
          onClick={triggerFileInput}
          type="button"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={triggerFileInput}
        type="button"
      >
        Upload Photo
      </Button>
    </div>
  );
};

export default ProfilePictureUploader;
