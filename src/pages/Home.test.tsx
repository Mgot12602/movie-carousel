import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Home from "./Home";

let mockInitialData: any = null;

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

vi.mock("@/components/CarouselSection", () => {
  return {
    __esModule: true,
    CarouselSection: ({ title }: { title: string }) => (
      <div data-testid="carousel-section">{title}</div>
    ),
  };
});

describe("Home component", () => {
  beforeEach(() => {
    mockInitialData = null;
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
});
