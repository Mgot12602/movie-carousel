import { jsxs, jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { Routes, Route, StaticRouter } from "react-router";
class BaseApi {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers
    };
    this.timeout = options.timeout || 1e4;
  }
  /**
   * Create fetch request with timeout
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
  /**
   * Handle HTTP response and errors
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
      }
      switch (response.status) {
        case 404:
          throw new Error(`Resource not found: ${errorMessage}`);
        case 401:
          throw new Error(`Unauthorized: ${errorMessage}`);
        case 403:
          throw new Error(`Forbidden: ${errorMessage}`);
        case 429:
          throw new Error(`Rate limit exceeded: ${errorMessage}`);
        case 500:
          throw new Error(`Server error: ${errorMessage}`);
        default:
          throw new Error(errorMessage);
      }
    }
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }
  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
      ...options
    });
    return this.handleResponse(response);
  }
  /**
   * POST request
   */
  async post(endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      ...options
    });
    return this.handleResponse(response);
  }
  /**
   * PUT request
   */
  async put(endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
      ...options
    });
    return this.handleResponse(response);
  }
  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "DELETE",
      ...options
    });
    return this.handleResponse(response);
  }
}
class MovieApi extends BaseApi {
  constructor(apiKey = null) {
    const options = {
      headers: {
        "Authorization": apiKey ? `Bearer ${apiKey}` : void 0,
        "Accept": "application/json"
      },
      timeout: 15e3
      // 15 seconds for movie API calls
    };
    super("https://api.themoviedb.org/3", options);
    this.apiKey = apiKey;
    this.imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  }
  /**
   * Get popular movies
   */
  async getPopularMovies(page = 1) {
    try {
      const data = await this.get(`/movie/popular?page=${page}`);
      return this.formatMoviesResponse(data);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error(`Failed to fetch popular movies: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Get trending movies
   */
  async getTrendingMovies(timeWindow = "day") {
    try {
      const data = await this.get(`/trending/movie/${timeWindow}`);
      return this.formatMoviesResponse(data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw new Error(`Failed to fetch trending movies: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Search movies by query
   */
  async searchMovies(query, page = 1) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const data = await this.get(`/search/movie?query=${encodedQuery}&page=${page}`);
      return this.formatMoviesResponse(data);
    } catch (error) {
      console.error("Error searching movies:", error);
      throw new Error(`Failed to search movies: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Format movies list response
   */
  formatMoviesResponse(data) {
    return {
      movies: data.results?.map((movie) => this.formatMovie(movie)) || [],
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || 0,
      currentPage: data.page || 1
    };
  }
  /**
   * Format single movie data
   */
  formatMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      posterPath: movie.poster_path ? `${this.imageBaseUrl}${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `${this.imageBaseUrl}${movie.backdrop_path}` : null,
      genreIds: movie.genre_ids || []
    };
  }
  /**
   * Fallback method for when API key is not available
   * Returns mock data for development
   */
  async getMockMovies() {
    return {
      movies: [
        {
          id: 1,
          title: "The Matrix",
          year: 1999,
          overview: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
          rating: 8.7,
          posterPath: null,
          backdropPath: null,
          releaseDate: "1999-03-31",
          voteCount: 23e3,
          popularity: 85.5,
          genreIds: [28, 878]
        },
        {
          id: 2,
          title: "Inception",
          year: 2010,
          overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          rating: 8.8,
          posterPath: null,
          backdropPath: null,
          releaseDate: "2010-07-16",
          voteCount: 31e3,
          popularity: 92.3,
          genreIds: [28, 878, 53]
        },
        {
          id: 3,
          title: "Interstellar",
          year: 2014,
          overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          rating: 8.6,
          posterPath: null,
          backdropPath: null,
          releaseDate: "2014-11-07",
          voteCount: 28e3,
          popularity: 88.1,
          genreIds: [18, 878]
        }
      ],
      totalPages: 1,
      totalResults: 3,
      currentPage: 1
    };
  }
}
const movieApi = new MovieApi(process.env.TMDB_API_KEY || null);
const Home = ({ initialData = {} }) => {
  const { movies = [], serverTime, message, error } = initialData;
  if (error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { children: "Movie App" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Error loading movies: ",
        error
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Server Time: ",
        serverTime
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Popular Movies" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Server Time: ",
      serverTime
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Message: ",
      message
    ] }),
    movies.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h2", { children: [
        "Movies (",
        movies.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("ul", { children: movies.map((movie) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: movie.title }),
        " (",
        movie.year,
        ")",
        movie.rating && /* @__PURE__ */ jsxs("span", { children: [
          " - Rating: ",
          movie.rating,
          "/10"
        ] }),
        movie.overview && /* @__PURE__ */ jsx("p", { children: movie.overview })
      ] }, movie.id)) })
    ] }) : /* @__PURE__ */ jsx("p", { children: "No movies available" })
  ] });
};
Home.getServerSideData = async () => {
  try {
    const movieData = await movieApi.getPopularMovies(1);
    return {
      movies: movieData.movies,
      serverTime: (/* @__PURE__ */ new Date()).toLocaleString(),
      message: `Loaded ${movieData.movies.length} popular movies from API`,
      totalResults: movieData.totalResults
    };
  } catch (error) {
    console.error("Failed to fetch movies from API, falling back to mock data:", error);
    const mockData = await movieApi.getMockMovies();
    return {
      movies: mockData.movies,
      serverTime: (/* @__PURE__ */ new Date()).toLocaleString(),
      message: "Using mock data (API unavailable)",
      error: `API Error: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
};
const routes = [
  {
    path: "/",
    component: Home
  }
];
function App({ initialData = {} }) {
  return /* @__PURE__ */ jsx("div", { className: "app", children: /* @__PURE__ */ jsx("main", { className: "main-content", children: /* @__PURE__ */ jsx(Routes, { children: routes.map(({ path, component: Component }) => /* @__PURE__ */ jsx(
    Route,
    {
      path,
      element: /* @__PURE__ */ jsx(Component, { initialData })
    },
    path
  )) }) }) });
}
async function fetchComponentData(Component) {
  if (Component?.getServerSideData) {
    try {
      return await Component.getServerSideData();
    } catch (error) {
      console.error(`Component data fetching error:`, error);
      return { error: "Failed to load data" };
    }
  }
  return {};
}
function getPathFromUrl(url) {
  return url.split("?")[0];
}
async function getInitialData(url) {
  try {
    const path = getPathFromUrl(url);
    const match = routes.find((r) => r.path === path);
    if (!match) {
     return null
    }
    const Component = match ? match.component : null;
    return fetchComponentData(Component);

}
async function render(url) {
  const initialData = await getInitialData(url);
  const html = renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, { initialData }) })
  );
  return { html, initialData };
}
export {
  render
};
