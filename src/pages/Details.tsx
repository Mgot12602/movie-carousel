import { CSSProperties } from "react";
import { GenreName, MovieDetails, MovieDetailsResponse } from "@/types/movie";
import buildImageUrl from "@/utils/buildImageUrl";
import "./Details.scss"; // Import the SCSS file from the same directory
import Layout from "@/components/UI/Layout/Layout";
import useInitialData from "@/hooks/useInitialData";
import useFavoriteMoviesStore from "@/stores/useFavoriteMoviesStore";

type FontFamily = "Segoe UI" | "Roboto" | "Oxygen";

const detailsFontsConfig: Record<string, FontFamily> = {
  Action: "Segoe UI",
  Comedy: "Roboto",
  Drama: "Oxygen",
};

interface DetailsProps {
  initialData?: InitialData;
}
interface InitialData {
  movieDetails: MovieDetails;
  error?: string;
  [key: string]: unknown;
}

const Details = ({ initialData }: DetailsProps) => {
  const { initialDataState } = useInitialData<InitialData>(initialData);
  const movieDetails = initialDataState?.movieDetails;
  const { getOne, favorite, unfavorite } = useFavoriteMoviesStore();

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  const isFavorite = !!getOne(movieDetails.id);
  const fontFamily = detailsFontsConfig[movieDetails.carouselGenre];
  console.log("fontFamily", fontFamily);

  const toggleFavorite = () => {
    if (isFavorite) {
      unfavorite(movieDetails.id);
    } else {
      favorite(movieDetails);
    }
  };

  return (
    <Layout>
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
    </Layout>
  );
};

export default Details;

const fetchDetailsData = async (
  url: string
): Promise<{ movieDetails?: MovieDetails; error?: string }> => {
  try {
    console.log("Fetching details data for URL:", url);
    const { movieApi } = await import("@/services/index");

    const newUrl = new URL(url, "http://localhost");
    const id = newUrl.searchParams.get("id");
    const genre = newUrl.searchParams.get("genre") as GenreName;

    if (!id) {
      console.error("id or genre is not defined");
      return {
        error: "id or genre is not defined",
      };
    }

    const movieDetailsResponse = await movieApi.getDetailsById(Number(id));
    console.log("movie Details", movieDetailsResponse);

    const movieDetailsToDomainMapper = (
      movieDetailsResponse: MovieDetailsResponse
    ): MovieDetails => {
      return {
        id: movieDetailsResponse.id,
        title: movieDetailsResponse.title,
        description: movieDetailsResponse.overview ?? "",
        image: buildImageUrl(movieDetailsResponse.poster_path, "w500"),
        carouselGenre: genre ?? "Action",
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
