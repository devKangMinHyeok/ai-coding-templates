import "server-only";
import { randomUUID } from "node:crypto";
import { validateNewNote, type NewNote, type Note } from "./note.model";
import type { NoteRepo } from "./note.repo";
import { ValidationError } from "@/server/shared";

// ── 애플리케이션 레이어 ──
// 유스케이스(하고 싶은 일)를 조립한다. 저장 방식(포트)에만 의존한다.
export function createNoteService(repo: NoteRepo) {
  return {
    list(): Promise<Note[]> {
      return repo.list();
    },
    async add(input: NewNote): Promise<Note> {
      const check = validateNewNote(input);
      if (!check.ok) throw new ValidationError(check.reason);
      const note: Note = {
        id: randomUUID(),
        text: input.text.trim(),
        createdAt: new Date().toISOString(),
      };
      await repo.add(note);
      return note;
    },
  };
}

export type NoteService = ReturnType<typeof createNoteService>;
