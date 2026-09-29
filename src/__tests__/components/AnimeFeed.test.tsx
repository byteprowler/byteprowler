import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnimeFeed from "../../components/sections/AnimeFeed";

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("AnimeFeed Component", () => {
  it("renders section header and sync button", () => {
    renderWithClient(<AnimeFeed />);

    expect(screen.getByText("AnimeFeed")).toBeInTheDocument();
    expect(screen.getByText(/Personal media cache: favorite anime entries detected/i)).toBeInTheDocument();
  });

  it("renders fallback anime cards with status badges", () => {
    renderWithClient(<AnimeFeed />);

    expect(
      screen.getByRole("heading", { name: "Attack on Titan Final Season" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("COMPLETED", { exact: true })).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: "ANILIST_LOG" })).toHaveLength(4);
  });
});
