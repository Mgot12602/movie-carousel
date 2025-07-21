import { GenreName, MovieDetails, MovieDetailsResponse } from "@/types/movie";
import buildImageUrl from "@/utils/buildImageUrl";
import "./Details.scss"; // Import the SCSS file from the same directory

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
}

const Details = ({ initialData }: DetailsProps) => {
  if (!initialData) {
    return <div>Loading...</div>;
  }
  const { error, movieDetails } = initialData;
  const fontFamily = detailsFontsConfig[movieDetails.carouselGenre];
  console.log("fontFamily", fontFamily);
  return (
    <div
      className="details-container"
      style={
        {
          "--details-font-family": fontFamily,
        } as React.CSSProperties
      }
    >
      <div>{movieDetails.title}</div>
      <div>
        <img src={movieDetails.image} alt={movieDetails.title} />
      </div>
      <div>{movieDetails.description}</div>
    </div>
  );
};

export default Details;

Details.getServerSideData = async (url: string): Promise<any> => {
  try {
    console.log("url in DetailsgetServerSideData", url);
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

    function movieDetailsToDomainMapper(
      movieDetailsResponse: MovieDetailsResponse
    ): MovieDetails {
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
    }
    const movieDetails = movieDetailsToDomainMapper(movieDetailsResponse);

    return {
      movieDetails,
    };
    /*  console.log("id", id);
    const movie = await movieApi.getDetailsById(id);
    console.log("movie Details", movie); */
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {
      movieDetails: [],
      error: `API Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
