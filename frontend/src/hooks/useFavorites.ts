import { useContext } from "react";
import { FavoritesContext, type FavoritesContextValue } from "../app/contexts.ts/FavoritesContext";


export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
