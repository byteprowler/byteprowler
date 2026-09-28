import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BootSequence from "../../components/ui/BootSequence";

describe("BootSequence Component", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("renders correctly with terminal header and initial boot status", () => {
    render(<BootSequence enabled={true} />);

    expect(screen.getAllByText(/BYTEPROWLER/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/SYSTEM_BOOT/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /skip boot/i })).toBeInTheDocument();
  });

  it("allows user to skip boot sequence by clicking button", () => {
    const onComplete = vi.fn();
    render(<BootSequence enabled={true} onComplete={onComplete} />);

    const skipButton = screen.getByRole("button", { name: /skip boot/i });
    fireEvent.click(skipButton);

    expect(onComplete).toHaveBeenCalledWith({ userInitiated: true });
    expect(window.sessionStorage.getItem("byteprowler_boot_sequence_seen")).toBe("true");
  });

  it("handles keyboard accessibility - pressing Escape triggers onComplete", () => {
    const onComplete = vi.fn();
    render(<BootSequence enabled={true} onComplete={onComplete} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onComplete).toHaveBeenCalledWith({ userInitiated: true });
  });

  it("handles keyboard accessibility - pressing Enter triggers onComplete", () => {
    const onComplete = vi.fn();
    render(<BootSequence enabled={true} onComplete={onComplete} />);

    fireEvent.keyDown(window, { key: "Enter" });
    expect(onComplete).toHaveBeenCalledWith({ userInitiated: true });
  });
});
