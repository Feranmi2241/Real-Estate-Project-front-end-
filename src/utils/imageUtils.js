export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${apiBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};