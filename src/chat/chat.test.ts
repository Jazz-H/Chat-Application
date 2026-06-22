import { describe, it, expect } from "vitest";
import { dmId, chatPathFor } from "./chat";

describe("dmId", () => {
  it("is deterministic regardless of argument order", () => {
    expect(dmId("alice", "bob")).toBe(dmId("bob", "alice"));
  });

  it("sorts the two uids", () => {
    expect(dmId("bob", "alice")).toBe("alice__bob");
  });
});

describe("chatPathFor", () => {
  it("maps a room to rooms/{id}", () => {
    expect(
      chatPathFor({ kind: "room", id: "general", name: "General", icon: "💬" })
    ).toEqual(["rooms", "general"]);
  });

  it("maps a dm to conversations/{id}", () => {
    expect(
      chatPathFor({ kind: "dm", id: "a__b", name: "Bob", peerUid: "b" })
    ).toEqual(["conversations", "a__b"]);
  });
});
