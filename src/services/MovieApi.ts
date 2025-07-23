import {
  GenreListResponse,
  MovieDetailsResponse,
  MovieListResponse,
} from "@/types/movie.js";
import { BaseApi } from "./BaseApi.js";
import buildUrl from "@/utils/buildUrl";

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable is not set`);
  }
  return value;
};

export class MovieApi extends BaseApi {
  protected readonly genresListEndpoint: string;
  protected readonly moviesEndpoint: string;
  protected readonly movieDetailsEndpoint: string;

  constructor() {
    const apiKey = getRequiredEnv("MOVIE_API_KEY");
    const baseUrl = getRequiredEnv("MOVIE_API_BASE_URL");

    super(baseUrl, {
      authToken: apiKey,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.genresListEndpoint = getRequiredEnv("GENRES_LIST_ENDPOINT");
    this.moviesEndpoint = getRequiredEnv("MOVIES_ENDPOINT");
    this.movieDetailsEndpoint = getRequiredEnv("MOVIE_DETAILS_ENDPOINT");
  }

  async getGenresList(): Promise<GenreListResponse["genres"]> {
    const endpoint = this.genresListEndpoint;
    const data = await this.get<GenreListResponse>(endpoint);
    return data.genres ?? [];
  }

  async getMoviesByGenreId(
    genreId: number
  ): Promise<MovieListResponse["results"]> {
    const endpoint = buildUrl(this.moviesEndpoint, {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      with_genres: genreId,
      sort_by: "popularity.desc",
    });
    const data = await this.get<MovieListResponse>(endpoint);
    return data.results ?? [];
  }

  async getDetailsById(id: number): Promise<MovieDetailsResponse> {
    const endpoint = `${this.movieDetailsEndpoint}/${id}`;
    const data = await this.get<MovieDetailsResponse>(endpoint);
    return data;
  }
}

const movieApi = new MovieApi();

export default movieApi;
