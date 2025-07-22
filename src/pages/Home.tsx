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
import Layout from "@/components/UI/Layout/Layout";
import useInitialData from "@/hooks/useInitialData";

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
  const { initialDataState } = useInitialData<InitialData>(initialData);
  const { selectedGenresData } = initialDataState || {};

  return (
    <Layout>
      {selectedGenresData && selectedGenresData.length > 0 ? (
        <div>
          {selectedGenresData.map((genreData) => (
            <CarouselSection
              title={genreData.genre}
              items={genreData.movies}
              key={genreData.genre}
            />
          ))}
        </div>
      ) : (
        <p>No movies available</p>
      )}
    </Layout>
  );
};

Home.getServerSideData = async (): Promise<InitialData> => {
  try {
    const { movieApi } = await import("@/services/index");
    const genres = await movieApi.getGenresList();
    const SELECTED_GENRES: GenreName[] = ["Action", "Comedy", "Drama"];

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
