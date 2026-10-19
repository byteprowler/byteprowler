import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import ViewCounter from "../../components/ui/ViewCounter";
vi.mock("next/router", () => ({ useRouter: () => ({ pathname: "/" }) }));
describe("view visit lifecycle", () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  it("records a first visit then reads on refresh without another increment", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 10, counted: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const view = render(<ViewCounter />);
    await screen.findByText("000010");
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    const token = JSON.parse(fetchMock.mock.calls[0][1].body).visitorId;
    view.unmount();
    render(<ViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][1].method).toBe("GET");
    expect(localStorage.getItem("byteprowler_anon_visitor_id")).toBe(token);
  });
  it("keeps the retry token when a request fails and shows unavailable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);
    const view = render(<ViewCounter />);
    await screen.findByText("LINK_ERR");
    const token = JSON.parse(fetchMock.mock.calls[0][1].body).visitorId;
    view.unmount();
    render(<ViewCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).visitorId).toBe(token);
  });
});
