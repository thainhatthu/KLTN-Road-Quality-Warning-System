const api_url = import.meta.env.VITE_BASE_URL;
export const generateImageDomain = (path: string) => {
  return `${api_url}${path}`;
};
