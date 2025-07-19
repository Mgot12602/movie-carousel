import React from "react";
import { CarouselSection } from "@/components/CarouselSection";

import { Genre, GenreName } from "../types/movie";
import { ICarouselItem } from "@/components/CarouselSection";

// Temporary demo data for carousel preview

const demoItems: ICarouselItem[] = Array.from({ length: 8 }, (_, idx) => ({
  image: `https://gruposese.com/wp-content/uploads/2023/07/Sese-lanzadera-electrica_3-scaled.jpg`,
}));

/**
 * Props for the Home component
 */
interface HomeProps {
  initialData?: HomeInitialData;
}

/**
 * Initial data structure for the Home component
 */
interface HomeInitialData {
  genres?: Genre[];
  serverTime?: string;
  message?: string;
  error?: string;
}

/**
 * Component with server-side data fetching capability
 */
interface ComponentWithSSR {
  getServerSideData?: () => Promise<HomeInitialData>;
}

const Home: React.FC<HomeProps> & ComponentWithSSR = ({ initialData = {} }) => {
  const { genres = [], serverTime, message, error } = initialData;

  if (error) {
    return (
      <div>
        <h1>Movie App</h1>
        <p>Error loading genres: {error}</p>
        <p>Server Time: {serverTime}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Popular Movies</h1>
      <p>Server Time: {serverTime}</p>
      <p>Message: {message}</p>

      {genres.length > 0 ? (
        <div>
          <h2>Movies ({genres.length})</h2>
          <ul>
            {genres.map((genre: Genre) => (
              <li key={genre.id}>
                <strong>{genre.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No genres available</p>
      )}
      {/* Demo carousel to preview styling */}
      <CarouselSection title="Demo Carousel" items={demoItems} />
    </div>
  );
};

Home.getServerSideData = async (): Promise<HomeInitialData> => {
  try {
    // Try to fetch real movie data first
    // Dynamically import server-only API on the server
    const { movieApi } = await import("../services/index.js");
    const genres = await movieApi.getGenresList();
    const SELECTED_GENRES: GenreName[] = ["Action", "Comedy", "Drama"];

    return {
      genres,
      serverTime: new Date().toLocaleString(),
      message: `Loaded ${genres.length} genres from API`,
    };
  } catch (error) {
    console.error(
      "Failed to fetch genres from API, falling back to mock data:",
      error
    );

    // Fallback to mock data if API fails
    return {
      genres: [],
      serverTime: new Date().toLocaleString(),
      message: "Using mock data (API unavailable)",
      error: `API Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export default Home;
