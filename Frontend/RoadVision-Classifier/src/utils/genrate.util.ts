const api_url = "https://exotic-strong-viper.ngrok-free.app";
export const generateImageDomain = (path: string) => {
  return `${api_url}/${path}`;
};
