import { create } from 'zustand';

type UserInfo = {
  username: string;
  avatar?: string;
  email?: string;
};

type AccountStore = {
  account: UserInfo | null;
  setAccount: (user: UserInfo) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  setAccount: (user) => set({ account: user }),
}));
