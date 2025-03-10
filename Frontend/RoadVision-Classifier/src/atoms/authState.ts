// atoms.js use to store Auth data state, similar to redux
import { atom } from "recoil";
import { UserType } from "../defination/types/user.type";
import { VerifyFormDataType } from "../defination/types/auth.type";
import { getStoredUserInfo } from "../utils/local-storage.util";

export const verifyEmailState = atom({
  key: "verifyEmailState",
  default: {
    email: "",
    username: "",
    password: "",
  } as VerifyFormDataType, // default value
});

// store username
export const accountState = atom({
  key: "accountState",
 default: getStoredUserInfo() as UserType // default value
});
