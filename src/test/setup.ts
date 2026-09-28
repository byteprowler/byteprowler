import * as matchers from "@testing-library/jest-dom/matchers";
import React from "react";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Universal mock for next/image in unit/component test environment
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, priority, sizes, className, ...rest }: any) => {
    const resolvedSrc = typeof src === "object" && src !== null ? src.src : src;
    return React.createElement("img", {
      src: resolvedSrc,
      alt: alt || "",
      className,
      ...rest,
    });
  },
}));
