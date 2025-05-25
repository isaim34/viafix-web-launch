
import { format, parseISO } from 'date-fns';

// Format date for display
export const formatDisplayDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE, MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};
