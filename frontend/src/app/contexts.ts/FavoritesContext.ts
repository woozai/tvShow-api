import { createContext } from "react";

export type FavoritesContextValue = {
  favorites: number[];
  toggle: (id: number) => void;
  isFav: (id: number) => boolean;
};

export const FavoritesContext = createContext<
  FavoritesContextValue | undefined
>(undefined);
