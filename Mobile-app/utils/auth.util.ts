// utils/auth.util.ts
import { LocalStorageKeyEnum } from "@/defination/enums/key.enum";
import { UserType } from "@/defination/types/user.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(LocalStorageKeyEnum.ACCESS_TOKEN, token);
  } catch (error) {
    console.error("Error saving access token:", error);
  }
};
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(LocalStorageKeyEnum.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};


export const getStoredUserInfo = async (): Promise<UserType | null> => {
  try {
    const stored = await AsyncStorage.getItem(LocalStorageKeyEnum.USER);
    if (stored) {
      return JSON.parse(stored) as UserType;
    }
    return null;
  } catch (error) {
    console.error("Failed to get stored user info:", error);
    return null;
  }
};

export const setStoredUserInfo = async (user: UserType): Promise<void> => {
  try {
    await AsyncStorage.setItem(LocalStorageKeyEnum.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user info:", error);
  }
};

export const removeStoredUserInfo = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LocalStorageKeyEnum.USER);
  } catch (error) {
    console.error("Failed to remove stored user info:", error);
  }
};
