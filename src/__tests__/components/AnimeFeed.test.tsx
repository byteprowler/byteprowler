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

    expect(screen.getByText(/Media Signal Stream/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /force refresh anilist activity cache/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /recent_activity/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /top_favorites/i })).toBeInTheDocument();
  });

  it("renders activity feed items with badges", () => {
    renderWithClient(<AnimeFeed />);

    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });
});
