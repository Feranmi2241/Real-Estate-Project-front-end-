export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (starts with http), check if it's localhost and replace
  if (imagePath.startsWith('http')) {
    if (imagePath.includes('localhost:3000')) {
      // Replace localhost with the deployed backend URL
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      return imagePath.replace('http://localhost:3000', apiBaseUrl);
    }
    return imagePath;
  }
  
  // If it's a relative path, prepend the API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${apiBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};