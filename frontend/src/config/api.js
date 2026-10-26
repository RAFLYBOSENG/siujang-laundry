export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/$/, '')}${normalizedPath}`;
};

export const assetUrl = (path = '') => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`;
};
