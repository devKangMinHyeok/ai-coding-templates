import { describe, it, expect } from "vitest";
import { createNoteService } from "./note.service";
import type { NoteRepo } from "./note.repo";
import type { Note } from "./note.model";

// 포트(NoteRepo)의 가짜 구현 — 저장 방식과 무관하게 유스케이스만 테스트한다.
function fakeRepo(): NoteRepo {
  const items: Note[] = [];
  return {
    async list() {
      return [...items].reverse();
    },
    async add(note) {
      items.push(note);
    },
  };
}

describe("noteService", () => {
  it("빈 노트는 ValidationError를 던진다", async () => {
    const service = createNoteService(fakeRepo());
    await expect(service.add({ text: "" })).rejects.toThrow();
  });

  it("추가하면 목록에 보인다", async () => {
    const service = createNoteService(fakeRepo());
    const note = await service.add({ text: "할 일" });
    expect(note.text).toBe("할 일");

    const list = await service.list();
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(note.id);
  });
});
