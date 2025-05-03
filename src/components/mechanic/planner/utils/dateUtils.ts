
import { format, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE, MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Alias for formatDate to maintain backward compatibility
export const formatDisplayDate = formatDate;
