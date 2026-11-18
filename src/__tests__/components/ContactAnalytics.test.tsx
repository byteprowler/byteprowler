import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Contact from "../../components/sections/Contact";
import { capturePortfolioEvent } from "../../lib/posthog";
vi.mock("../../lib/posthog", () => ({ capturePortfolioEvent: vi.fn(), captureResumeEvent: vi.fn() }));

function completeForm() {
  fireEvent.change(screen.getByLabelText(/SENDER_IDENTITY/), { target: { value: "Test Visitor" } });
  fireEvent.change(screen.getByLabelText(/RETURN_ADDRESS/), { target: { value: "visitor@example.com" } });
  fireEvent.change(screen.getByLabelText(/ROUTE_SIGNATURE_SUBJECT/), { target: { value: "Private subject" } });
  fireEvent.change(screen.getByLabelText(/INTEL_TRANSMISSION_PAYLOAD/), { target: { value: "Private message" } });
  fireEvent.click(screen.getByRole("button", { name: /EXECUTE_SECURE_TRANSMIT/ }));
}

describe("contact analytics", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  it("records start once and accepted submission without any form properties", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }));
    render(<Contact />);
    const name = screen.getByLabelText(/SENDER_IDENTITY/);
    fireEvent.focus(name);
    fireEvent.focus(screen.getByLabelText(/RETURN_ADDRESS/));
    expect(capturePortfolioEvent).toHaveBeenCalledTimes(1);
    expect(capturePortfolioEvent).toHaveBeenCalledWith("portfolio_contact_started");
    completeForm();
    await waitFor(() => expect(capturePortfolioEvent).toHaveBeenCalledWith("portfolio_contact_submitted"));
    for (const call of vi.mocked(capturePortfolioEvent).mock.calls) expect(call).toHaveLength(1);
  });
  it("does not record submission when the endpoint rejects the message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false }) }));
    render(<Contact />);
    completeForm();
    await screen.findByText(/Message could not be sent/);
    expect(capturePortfolioEvent).not.toHaveBeenCalledWith("portfolio_contact_submitted");
  });
});
