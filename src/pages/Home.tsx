import React from "react";
import { CarouselSection } from "@/components/CarouselSection";

import {
  Genre,
  GenreName,
  ImageSizes,
  Movie,
  SelectedGenre,
} from "@/types/movie";
import buildImageUrl from "@/utils/buildImageUrl";

interface HomeProps {
  initialData?: InitialData;
}
interface InitialData {
  selectedGenresData?: SelectedGenre[];
  error?: string;
}

interface ComponentWithSSR {
  getServerSideData?: () => Promise<InitialData>;
}

const Home: React.FC<HomeProps> & ComponentWithSSR = ({ initialData = {} }) => {
  const { error, selectedGenresData } = initialData;

  return (
    <div>
      <h1>Popular Movies</h1>

      {selectedGenresData && selectedGenresData.length > 0 ? (
        <div>
          <h2>Movies ({selectedGenresData.length})</h2>
          <ul>
            {selectedGenresData.map((genreData) => (
              <CarouselSection
                title={genreData.genre}
                items={genreData.movies}
                key={genreData.genre}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>No movies available</p>
      )}
    </div>
  );
};

Home.getServerSideData = async (): Promise<InitialData> => {
  try {
    // Try to fetch real movie data first
    // Dynamically import server-only API on the server
    const { movieApi } = await import("@/services/index");
    const genres = await movieApi.getGenresList();
    const SELECTED_GENRES: GenreName[] = ["Action", "Comedy", "Drama"];

    // Create an array of promises using async map function
    const genrePromises = SELECTED_GENRES.map(async (genre: GenreName) => {
      const genreId = genres.find((g: Genre) => g.name === genre)?.id;
      if (!genreId) {
        console.error("Id for genre", genre, "not found");
        return {
          genre,
          movies: [],
        };
      }
      const movies = await movieApi.getMoviesByGenreId(genreId);
      if (!movies) {
        console.error("Movies for genre", genre, "not found");
        return {
          genre,
          movies: [],
        };
      }
      return {
        genre,
        movies,
      };
    });

    // Wait for all promises to resolve
    const selectedGenresResponse = await Promise.all(genrePromises);

    function selectedGenresToDomainMapper(
      selectedGenresResponse: any
    ): SelectedGenre[] {
      return selectedGenresResponse.map(
        (genreSelection: { genre: GenreName; movies: Movie[] }) => ({
          genre: genreSelection.genre,
          movies: genreSelection.movies.map((movie: Movie) => ({
            id: movie.id,
            title: movie.title,
            image: buildImageUrl(movie.poster_path, "w154"),
            posterPath: movie.poster_path,
            carouselGenre: genreSelection.genre,
          })),
        })
      );
    }

    const selectedGenresData = selectedGenresToDomainMapper(
      selectedGenresResponse
    );

    /* console.log("selectedGenresData", selectedGenresData); */

    return {
      selectedGenresData,
    };
  } catch (error) {
    console.error(
      "Failed to fetch genres from API, falling back to mock data:",
      error
    );

    // Fallback to mock data if API fails
    return {
      selectedGenresData: [],
      error: `API Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export default Home;
