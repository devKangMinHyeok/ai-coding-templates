import { describe, it, expect } from "vitest";
import { validateNewNote } from "./note.model";

describe("validateNewNote", () => {
  it("빈 내용은 거부한다", () => {
    expect(validateNewNote({ text: "   " })).toEqual({
      ok: false,
      reason: "내용이 비어 있어요.",
    });
  });

  it("280자를 넘으면 거부한다", () => {
    expect(validateNewNote({ text: "a".repeat(281) })).toEqual({
      ok: false,
      reason: "280자를 넘을 수 없어요.",
    });
  });

  it("정상 입력은 통과한다", () => {
    expect(validateNewNote({ text: "안녕" })).toEqual({ ok: true });
  });
});
