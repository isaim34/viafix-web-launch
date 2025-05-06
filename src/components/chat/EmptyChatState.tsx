
import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Select a conversation to start chatting</p>
      </div>
    </div>
  );
};

export default EmptyChatState;
