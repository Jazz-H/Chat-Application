import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("shows the uppercased first initial of the name", () => {
    render(<Avatar name="alice" uid="u1" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("falls back to '?' for a blank name", () => {
    render(<Avatar name="   " uid="u2" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("is deterministic in color for the same uid", () => {
    const { container: a } = render(<Avatar name="A" uid="same" />);
    const { container: b } = render(<Avatar name="B" uid="same" />);
    const colorA = (a.firstChild as HTMLElement).style.backgroundColor;
    const colorB = (b.firstChild as HTMLElement).style.backgroundColor;
    expect(colorA).toBe(colorB);
  });
});
