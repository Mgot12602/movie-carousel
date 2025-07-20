/**
 * Movie-related type definitions
 * These types can be safely imported on both client and server
 */

export type GenreName =
  | "Action"
  | "Adventure"
  | "Animation"
  | "Comedy"
  | "Crime"
  | "Documentary"
  | "Drama"
  | "Family"
  | "Fantasy"
  | "History"
  | "Horror"
  | "Music"
  | "Mystery"
  | "Science Fiction"
  | "TV Movie"
  | "Thriller"
  | "War"
  | "Western";

export interface Genre {
  id: number;
  name: GenreName;
}
export interface GenreListResponse {
  genres: Genre[];
}

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface MovieItem {
  id: number;
  title: string;
  image: string;
}
export interface SelectedGenre {
  genre: GenreName;
  movies: MovieItem[];
}

export type ImageSizes =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";
