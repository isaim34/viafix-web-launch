
import React, { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload } from 'lucide-react';
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
  const [inputUrl, setInputUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (!inputUrl) {
      setIsEditing(false);
      return;
    }

    // Basic URL validation
    try {
      new URL(inputUrl);
      setImageUrl(inputUrl);
      onImageChange(inputUrl);
      setIsEditing(false);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
    }
  };

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
        setImageUrl(dataUrl);
        onImageChange(dataUrl);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully",
        });
      }
    };
    reader.readAsDataURL(file);
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
      
      {isEditing ? (
        <div className="flex w-full max-w-xs gap-2">
          <Input
            placeholder="Image URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleUrlSubmit} size="sm">
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={triggerFileInput}
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            Enter Image URL
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
