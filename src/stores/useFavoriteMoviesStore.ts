import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MovieDetails } from "@/types/movie";

interface FavoriteMoviesState {
  favorites: MovieDetails[];
  getAll: () => MovieDetails[];
  getOne: (id: number) => MovieDetails | undefined;
  favorite: (movie: MovieDetails) => void;
  unfavorite: (id: number) => void;
}

const useFavoriteMoviesStore = create<FavoriteMoviesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      getAll: () => {
        return get().favorites.sort((a, b) => a.title.localeCompare(b.title));
      },

      getOne: (id: number) => {
        return get().favorites.find((movie) => movie.id === id);
      },

      favorite: (movie: MovieDetails) => {
        const favorites = get().favorites;
        if (!favorites.some((favorite) => favorite.id === movie.id)) {
          set({ favorites: [...favorites, movie] });
        }
      },

      unfavorite: (id: number) => {
        set({
          favorites: get().favorites.filter((movie) => movie.id !== id),
        });
      },
    }),
    {
      name: "favorite-movies",
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useFavoriteMoviesStore;
