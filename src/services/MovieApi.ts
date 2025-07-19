import { BaseApi } from "./BaseApi.js";

/**
 * TMDB API Movie object structure
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

const movieApiConfig = {
  endpoints: {
    getGenresList: "/genre/movie/list",
    getMovies: "https://api.themoviedb.org/3/discover/movie",
  },
};

function buildUrl(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): string {
  const url = new URL(endpoint); // handles trailing slashes
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value))
  );
  return url.toString();
}

export class MovieApi extends BaseApi {
  constructor() {
    // Validate required environment variables
    const apiKey = process.env.MOVIE_API_KEY;
    const baseUrl = process.env.MOVIE_API_BASE_URL;

    if (!apiKey) {
      throw new Error("MOVIE_API_KEY environment variable is not set");
    }

    if (!baseUrl) {
      throw new Error("MOVIE_API_BASE_URL environment variable is not set");
    }

    // Initialize parent class with base URL and headers
    super(baseUrl, {
      authToken: apiKey,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async getGenresList(): Promise<Genre[]> {
    const endpoint = movieApiConfig.endpoints.getGenresList;
    const data = await this.get<{ genres: Genre[] }>(endpoint);
    return data.genres ?? [];
  }

  async getMoviesByGenre(genreId: number): Promise<Genre[]> {
    const endpoint = buildUrl(movieApiConfig.endpoints.getMovies, {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      with_genres: genreId,
      sort_by: "popularity.desc",
    });
    const data = await this.get<{ genres: Genre[] }>(endpoint);
    return data.genres ?? [];
  }
}

const movieApi = new MovieApi();

export default movieApi;
