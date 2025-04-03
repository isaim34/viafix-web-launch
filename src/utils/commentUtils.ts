
export const extractTaggedUsers = (content: string): string[] => {
  const matches = content.match(/@(\w+\s\w+)/g) || [];
  return matches.map(match => match.substring(1).trim());
};

export const formatContentWithTags = (content: string): string => {
  return content.replace(/@(\w+\s\w+)/g, '<span class="text-primary font-medium">@$1</span>');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
