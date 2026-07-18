// Utility function to display "N/A" for empty values
export const displayValue = (value: string | number | undefined | null, fallback: string = 'N/A'): string => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return String(value);
};

// Format date for display
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

// Format date for display with time
export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

// Validate phone number format (enforces Indian standard starting with +91)
export const isValidPhoneNumber = (phone: string | undefined | null): boolean => {
  if (!phone) return false;
  const clean = phone.replace(/[\s-]/g, '');
  const indianRegex = /^\+91[6-9]\d{9}$/;
  return indianRegex.test(clean);
};
