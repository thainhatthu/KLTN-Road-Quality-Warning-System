import { atom } from "recoil";
import { ProfileDataType } from "../defination/types/profile.type";

export const profileState = atom({
  key: "profileState",
  default: {
    email: "",
    username: "",
    birthday: "",
    location: "",
    phonenumber: "",
    avatar: "",
    fullname: "",
    state: "",
  } as ProfileDataType, 
});