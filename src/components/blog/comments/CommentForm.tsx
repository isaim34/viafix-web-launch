
import React, { useRef, useState } from 'react';
import { AtSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/Button';
import { UserTagSelector } from '../UserTagSelector';

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTagUser: (userId: string, userName: string) => void;
  availableUsers: Array<{ id: string; name: string }>;
  placeholder?: string;
}

export const CommentForm = ({
  value,
  onChange,
  onSubmit,
  onTagUser,
  availableUsers,
  placeholder = "Share your thoughts... Use @ to tag other users"
}: CommentFormProps) => {
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [tagSelectorPosition, setTagSelectorPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    
    const caretPosition = e.target.selectionStart || 0;
    const textUpToCaret = text.substring(0, caretPosition);
    const lastAtSymbolIndex = textUpToCaret.lastIndexOf('@');
    
    if (lastAtSymbolIndex !== -1 && 
        (lastAtSymbolIndex === 0 || text[lastAtSymbolIndex - 1] === ' ') && 
        caretPosition > lastAtSymbolIndex) {
      
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        setTagSelectorPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left
        });
      }
      
      setShowTagSelector(true);
    } else {
      setShowTagSelector(false);
    }
  };

  const handleTagUser = (userId: string, userName: string) => {
    const currentText = value;
    let updatedText = currentText;
    
    const lastAtSymbolIndex = updatedText.lastIndexOf('@');
    if (lastAtSymbolIndex !== -1) {
      const input = textareaRef.current;
      const caretPosition = input?.selectionStart || updatedText.length;
      const textBeforeTag = updatedText.substring(0, lastAtSymbolIndex);
      const textAfterTag = updatedText.substring(caretPosition);
      
      updatedText = `${textBeforeTag}@${userName} ${textAfterTag}`;
      onChange(updatedText);
    }
    
    setShowTagSelector(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPosition = lastAtSymbolIndex + userName.length + 2;
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleAtButtonClick = () => {
    textareaRef.current?.focus();
    const currentValue = value;
    const newValue = currentValue + '@';
    onChange(newValue);
    
    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect();
      setTagSelectorPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left
      });
      setShowTagSelector(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="mb-3"
        />
        <button
          type="button"
          onClick={handleAtButtonClick}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          title="Tag a user"
        >
          <AtSign size={16} />
        </button>
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={onSubmit}
          disabled={!value.trim()}
        >
          Post Comment
        </Button>
      </div>
      
      {showTagSelector && (
        <UserTagSelector
          users={availableUsers}
          position={tagSelectorPosition}
          onSelectUser={handleTagUser}
        />
      )}
    </div>
  );
};
