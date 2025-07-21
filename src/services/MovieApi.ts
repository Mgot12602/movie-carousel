import {
  GenreListResponse,
  MovieDetailsResponse,
  MovieListResponse,
} from "@/types/movie.js";
import { BaseApi } from "./BaseApi.js";
import buildUrl from "@/utils/buildUrl";

/**
 * TMDB API Movie object structure
 */

const movieApiConfig = {
  endpoints: {
    getGenresList: "genre/movie/list",
    getMovies: "discover/movie",
  },
};

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

  async getGenresList(): Promise<GenreListResponse["genres"]> {
    const endpoint = movieApiConfig.endpoints.getGenresList;
    const data = await this.get<GenreListResponse>(endpoint);
    return data.genres ?? [];
  }

  async getMoviesByGenreId(
    genreId: number
  ): Promise<MovieListResponse["results"]> {
    const endpoint = buildUrl(movieApiConfig.endpoints.getMovies, {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      with_genres: genreId,
      sort_by: "popularity.desc",
    });
    /* console.log("endpoint", endpoint); */
    const data = await this.get<MovieListResponse>(endpoint);
    /* console.log("data", data); */
    return data.results ?? [];
  }

  async getDetailsById(id: number): Promise<MovieDetailsResponse> {
    const endpoint = `movie/${id}`;
    const data = await this.get<MovieDetailsResponse>(endpoint);
    console.log("data", data);
    return data;
  }
}

const movieApi = new MovieApi();

export default movieApi;
