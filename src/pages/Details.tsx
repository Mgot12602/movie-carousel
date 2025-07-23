import { CSSProperties } from "react";
import { GenreName, MovieDetails, MovieDetailsResponse } from "@/types/movie";
import buildImageUrl from "@/utils/buildImageUrl";
import Layout from "@/components/UI/Layout/Layout";
import useInitialData from "@/hooks/useInitialData";
import useFavoriteMoviesStore from "@/stores/useFavoriteMoviesStore";
import "./Details.scss";

type FontFamily = "Merriweather" | "Roboto" | "Pacifico";

const detailsFontsConfig: Record<string, FontFamily> = {
  Action: "Merriweather",
  Comedy: "Roboto",
  Drama: "Pacifico",
};

interface DetailsProps {
  initialData?: InitialData;
}
export interface InitialData {
  movieDetails: MovieDetails;
  error?: string;
  [key: string]: unknown;
}

const Details = ({ initialData }: DetailsProps) => {
  const { initialDataState } = useInitialData<InitialData>(initialData);
  const { getOne, favorite, unfavorite } = useFavoriteMoviesStore();
  const movieDetails = initialDataState?.movieDetails;

  const isFavorite = movieDetails ? !!getOne(movieDetails.id) : false;

  const fontFamily = movieDetails
    ? detailsFontsConfig[movieDetails.carouselGenre]
    : "";

  const toggleFavorite = () => {
    if (movieDetails) {
      return isFavorite ? unfavorite(movieDetails.id) : favorite(movieDetails);
    }
  };

  return (
    <Layout>
      {movieDetails ? (
        <div
          className="details-container"
          style={
            {
              "--details-font-family": fontFamily,
            } as CSSProperties
          }
        >
          <div className="details-container__image-description-box">
            <section className="details-container__image details-container__box">
              <img src={movieDetails.image} alt={movieDetails.title} />
            </section>
            <section className="details-container__description details-container__box">
              <h1>{movieDetails.title}</h1>
              <p>{movieDetails.description}</p>
              <button
                className="favorite-button"
                onClick={toggleFavorite}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <span className="heart-icon">{isFavorite ? "♥" : "♡"}</span>
              </button>
            </section>
          </div>
          <section className="details-container__box">
            <h2>Additional Information</h2>
            <p>
              <span className="font-bold">Release Date: </span>
              {movieDetails.additionalInfo.releaseDate}
            </p>
            <p>
              <span className="font-bold">Status: </span>
              {movieDetails.additionalInfo.status}
            </p>
          </section>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
};

export default Details;

const fetchDetailsData = async (
  url: string
): Promise<{ movieDetails?: MovieDetails; error?: string }> => {
  try {
    const { movieApi } = await import("@/services/index");

    const newUrl = new URL(url, "http://localhost");
    const id = newUrl.searchParams.get("id");
    const genre = newUrl.searchParams.get("genre") as GenreName;

    if (!id || !genre) {
      throw new Error("id or genre is not defined");
    }

    const movieDetailsResponse = await movieApi.getDetailsById(Number(id));

    const movieDetailsToDomainMapper = (
      movieDetailsResponse: MovieDetailsResponse
    ): MovieDetails => {
      return {
        id: movieDetailsResponse.id,
        title: movieDetailsResponse.title,
        description: movieDetailsResponse.overview ?? "",
        image: buildImageUrl(movieDetailsResponse.poster_path, "w500"),
        carouselGenre: genre,
        additionalInfo: {
          releaseDate: movieDetailsResponse.release_date,
          status: movieDetailsResponse.status,
        },
      };
    };

    const movieDetails = movieDetailsToDomainMapper(movieDetailsResponse);

    return {
      movieDetails,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {
      error: `API Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

Details.getServerSideData = async (
  url: string
): Promise<Record<string, unknown>> => {
  return await fetchDetailsData(url);
};
