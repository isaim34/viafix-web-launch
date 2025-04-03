
import React from 'react';
import { ArrowDownAZ, ArrowUpAZ, ThumbsUp } from 'lucide-react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';

export type CommentSortOption = 'newest' | 'oldest' | 'popular';

interface CommentFilterProps {
  currentFilter: CommentSortOption;
  onFilterChange: (value: CommentSortOption) => void;
}

export const CommentFilter = ({ currentFilter, onFilterChange }: CommentFilterProps) => {
  const handleValueChange = (value: string) => {
    if (value) {
      onFilterChange(value as CommentSortOption);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
        <ToggleGroup 
          type="single" 
          value={currentFilter}
          onValueChange={handleValueChange}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="newest" aria-label="Sort by newest">
            <ArrowDownAZ className="h-4 w-4 mr-1" />
            <span className="text-xs sm:inline">Newest</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="oldest" aria-label="Sort by oldest">
            <ArrowUpAZ className="h-4 w-4 mr-1" />
            <span className="text-xs sm:inline">Oldest</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="popular" aria-label="Sort by most likes">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs sm:inline">Most Likes</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
