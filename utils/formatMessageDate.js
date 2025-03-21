/**
 * Formats a date into user-friendly message groups
 * Returns "Today", "Yesterday", or the actual date
 */
const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is today
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return 'Today';
  }
  
  // Check if date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  
  // Check if date is within the last 7 days
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 6);
  
  if (date >= lastWeek) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
  
  // Format date as "Month Day, Year"
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default formatMessageDate; 