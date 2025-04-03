
import React from 'react';
import { MessageCircle } from 'lucide-react';

export const EmptyComments = () => {
  return (
    <div className="text-center py-8">
      <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
    </div>
  );
};
