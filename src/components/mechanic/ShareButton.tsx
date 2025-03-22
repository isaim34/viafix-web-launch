
import React from 'react';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  mechanicName: string;
}

export const ShareButton = ({ mechanicName }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShareProfile = () => {
    // Get the current URL to share
    const shareUrl = window.location.href;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Profile link has been copied to your clipboard.",
        });
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
        toast({
          title: "Failed to Copy",
          description: "Could not copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <button 
      onClick={handleShareProfile}
      className="p-2 rounded-full transition-all bg-blue-50 text-blue-500 hover:bg-blue-100"
      aria-label={`Share ${mechanicName}'s profile`}
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
};
