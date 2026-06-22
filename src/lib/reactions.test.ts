import { describe, it, expect } from "vitest";
import { nextReactions } from "./reactions";

describe("nextReactions", () => {
  it("adds a reaction when the user hasn't reacted", () => {
    expect(nextReactions(undefined, "👍", "u1")).toEqual({ "👍": ["u1"] });
  });

  it("appends a user to an existing emoji", () => {
    expect(nextReactions({ "👍": ["u1"] }, "👍", "u2")).toEqual({
      "👍": ["u1", "u2"],
    });
  });

  it("removes the user when they already reacted", () => {
    expect(nextReactions({ "👍": ["u1", "u2"] }, "👍", "u1")).toEqual({
      "👍": ["u2"],
    });
  });

  it("drops the emoji key when the last user is removed", () => {
    expect(nextReactions({ "👍": ["u1"] }, "👍", "u1")).toEqual({});
  });

  it("does not mutate the input", () => {
    const input = { "👍": ["u1"] };
    nextReactions(input, "❤️", "u2");
    expect(input).toEqual({ "👍": ["u1"] });
  });
});
