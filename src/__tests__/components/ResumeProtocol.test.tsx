import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResumeProtocol from "../../components/ui/ResumeProtocol";

describe("ResumeProtocol Component", () => {
  it("does not render dialog when isOpen is false", () => {
    const { container } = render(<ResumeProtocol isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when isOpen is true and shows step 1 role selection", () => {
    render(<ResumeProtocol isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Resume Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/What role are you hiring for\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Frontend Developer/i).length).toBeGreaterThan(0);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ResumeProtocol isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: /close resume protocol/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it("handles keyboard accessibility: Escape closes dialog", () => {
    const onClose = vi.fn();
    render(<ResumeProtocol isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates to step 2 when Next button is clicked", () => {
    render(<ResumeProtocol isOpen={true} onClose={vi.fn()} />);

    const nextBtn = screen.getByRole("button", { name: /next: focus_matrix/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/What matters most for this role\?/i)).toBeInTheDocument();
  });
});
