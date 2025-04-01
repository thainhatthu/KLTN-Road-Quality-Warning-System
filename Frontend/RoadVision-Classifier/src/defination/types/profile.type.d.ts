import { UserType } from "./user.type";

//Define type data of API respone
export type ProfileDataType = {
  user_id: int;
  avatar: string;
  username: string;
  email: string;
  location: string;
  birthday: string;
  phonenumber: string;
  avatar: string;
  fullname: string;
  gender: string;
  state: string;
  contribution: int;
};

export type EditProfileDataType = {
  username: string;
  fullname: string;
  phonenumber: string;
  birthday: string; 
  gender: string;
  location: string;
  state: string;
}
export type UploadAvatarType = {  
  file: File;
}

export type ChangePasswordDataType = {
  current_password: string;
  new_password: string;
  confirm_password: string;
}