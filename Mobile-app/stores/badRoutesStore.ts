import { create } from "zustand";

type BadRoutesStore = {
  badRoutes: number[][][];
  setBadRoutes: (routes: number[][][]) => void;
};

export const useBadRoutesStore = create<BadRoutesStore>((set) => ({
  badRoutes: [],
  setBadRoutes: (routes) => set({ badRoutes: routes }),
}));
