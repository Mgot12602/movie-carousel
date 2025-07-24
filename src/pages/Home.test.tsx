import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Home, { InitialData } from "./Home";
import { Movie } from "@/types/movie";

let mockInitialData: InitialData | undefined = undefined;

vi.mock("@/hooks/useInitialData", () => {
  return {
    __esModule: true,
    default: () => ({ initialDataState: mockInitialData }),
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

vi.mock("@/components/common/CarouselSection", () => {
  return {
    __esModule: true,
    CarouselSection: ({ title, items }: { title: string; items: Movie[] }) => (
      <div data-testid="carousel-section">
        <h3>{title}</h3>
        {items?.map((item) => (
          <p key={item.id}>{item.title}</p>
        ))}
      </div>
    ),
  };
});

describe("Home component", () => {
  beforeEach(() => {
    mockInitialData = undefined;
    vi.clearAllMocks();
  });

  it("renders loading state when no initial data is provided", () => {
    render(<Home />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders carousel sections for each selected genre", () => {
    mockInitialData = {
      selectedGenresData: [
        { genre: "Action", movies: [] },
        { genre: "Comedy", movies: [] },
        { genre: "Drama", movies: [] },
      ],
    };

    render(<Home initialData={mockInitialData} />);

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Comedy")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();

    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("renders movie titles within each carousel section", () => {
    mockInitialData = {
      selectedGenresData: [
        {
          genre: "Action",
          movies: [
            {
              id: 1,
              title: "Action Movie 1",
              image: "/path/to/image1.jpg",
              posterPath: "/path/to/poster1.jpg",
              carouselGenre: "Action",
            },
            {
              id: 2,
              title: "Action Movie 2",
              image: "/path/to/image2.jpg",
              posterPath: "/path/to/poster2.jpg",
              carouselGenre: "Action",
            },
          ],
        },
        {
          genre: "Comedy",
          movies: [
            {
              id: 3,
              title: "Comedy Movie 1",
              image: "/path/to/image3.jpg",
              posterPath: "/path/to/poster3.jpg",
              carouselGenre: "Comedy",
            },
          ],
        },
        {
          genre: "Drama",
          movies: [
            {
              id: 4,
              title: "Drama Movie 1",
              image: "/path/to/image4.jpg",
              posterPath: "/path/to/poster4.jpg",
              carouselGenre: "Drama",
            },
          ],
        },
      ],
    };

    render(<Home initialData={mockInitialData} />);

    expect(screen.getByText("Action Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Action Movie 2")).toBeInTheDocument();
    expect(screen.getByText("Comedy Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Drama Movie 1")).toBeInTheDocument();
  });
});
