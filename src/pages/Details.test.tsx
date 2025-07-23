import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Details, { InitialData } from "./Details";
import { GenreName } from "@/types/movie";

const mockGetOne = vi.fn();
const mockFavorite = vi.fn();
const mockUnfavorite = vi.fn();
let mockInitialDataState: InitialData | null = null;

vi.mock("@/hooks/useInitialData", () => {
  return {
    __esModule: true,
    default: () => ({ initialDataState: mockInitialDataState }),
  };
});

vi.mock("@/components/UI/Layout/Layout", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="layout">{children}</div>
    ),
  };
});

vi.mock("@/stores/useFavoriteMoviesStore", () => {
  return {
    __esModule: true,
    default: () => ({
      getOne: mockGetOne,
      favorite: mockFavorite,
      unfavorite: mockUnfavorite,
    }),
  };
});

const mockInitialData = {
  movieDetails: {
    id: 1,
    title: "Test movie title",
    description: "Test movie description",
    image: "https://example.com/poster.jpg",
    carouselGenre: "Action" as GenreName,
    additionalInfo: {
      releaseDate: "2025-07-25",
      status: "Released",
    },
  },
};

describe("Details component", () => {
  beforeEach(() => {
    mockGetOne.mockReset();
    mockFavorite.mockReset();
    mockUnfavorite.mockReset();
  });

  it("renders loading state when no movie details are provided", () => {
    mockInitialDataState = null;
    render(<Details />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders movie details when initial data is available", () => {
    mockInitialDataState = mockInitialData;
    mockGetOne.mockReturnValue(undefined);

    render(<Details initialData={mockInitialData} />);

    expect(screen.getByText("Test movie title")).toBeInTheDocument();
    expect(screen.getByText("Test movie description")).toBeInTheDocument();
    expect(screen.getByText("2025-07-25")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Test movie title/i })
    ).toBeInTheDocument();
  });

  it("calls favorite / unfavorite actions", async () => {
    mockInitialDataState = mockInitialData;
    mockGetOne.mockReturnValue(undefined);

    render(<Details initialData={mockInitialData} />);

    const addButton = screen.getByRole("button", {
      name: /Add to favorites/i,
    });
    await userEvent.click(addButton);
    const { movieDetails } = mockInitialData;
    expect(mockFavorite).toHaveBeenCalledWith(movieDetails);

    mockGetOne.mockReturnValue(movieDetails);

    render(<Details initialData={mockInitialData} />);

    const removeButton = screen.getByRole("button", {
      name: /Remove from favorites/i,
    });
    await userEvent.click(removeButton);
    expect(mockUnfavorite).toHaveBeenCalledWith(movieDetails.id);
  });
});
