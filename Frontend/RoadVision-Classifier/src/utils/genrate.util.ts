const api_url = "https://b9a3-42-116-6-46.ngrok-free.app";
export const generateImageDomain = (path: string) => {
  return `${api_url}/${path}`;
};
