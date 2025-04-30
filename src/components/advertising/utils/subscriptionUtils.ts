
/**
 * Format a date string into a human-readable format
 */
export const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

/**
 * Format a plan type to be more readable (capitalize first letter)
 */
export const formatPlanType = (plan: string | null) => {
  if (!plan) return '';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};
