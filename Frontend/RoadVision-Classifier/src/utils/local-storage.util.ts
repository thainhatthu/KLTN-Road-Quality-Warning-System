import { LocalStorageKeyEnum } from "../defination/enums/key.enum";
import { UserType } from "../defination/types/user.type";

export const getStoredUserInfo = () => {
  const storedUserInfo = localStorage.getItem(LocalStorageKeyEnum.USER);
  if (storedUserInfo) {
    const data: UserType = JSON.parse(storedUserInfo);
    return data;
  }
  return null; // return null if can not fine user info
};

export const setStoredUserInfo = (user: UserType): void => {
  localStorage.setItem(LocalStorageKeyEnum.USER, JSON.stringify(user));
  //   localStorage.setItem("token", token);
};

export const removeStoredUserInfo = (): void => {
  localStorage.removeItem(LocalStorageKeyEnum.USER);
  //   localStorage.removeItem("token");
};

export const setStoredAdminInfo = (admin: UserType): void => {
  localStorage.setItem(LocalStorageKeyEnum.ADMIN, JSON.stringify(admin));
  //   localStorage.setItem("token", token);
};

export const removeStoredAdminInfo = (): void => {
  localStorage.removeItem(LocalStorageKeyEnum.ADMIN);
  //   localStorage.removeItem("token");
};


export const setStoredTechnicianInfo = (technical: UserType): void => {
  localStorage.setItem(LocalStorageKeyEnum.TECHNICIAN, JSON.stringify(technical));
  //   localStorage.setItem("token", token);
};

export const removeStoredTechnicianInfo = (): void => {
  localStorage.removeItem(LocalStorageKeyEnum.TECHNICIAN);
  //   localStorage.removeItem("token");
};