export type UploadImgFormDataType = {
  file: File;
  latitude: number;
  longitude: number;
  token: string;
};

export type GetImageFormDataType = {
  imagePath: string;
};

export type GetInfoRoadsParams = {
  user_id?: number;
  id_road?: number;
  all: boolean;
};
