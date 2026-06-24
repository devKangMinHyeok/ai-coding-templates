import "server-only";
import type { Note } from "./note.model";
import type { NoteRepo } from "./note.repo";

// ── 인프라 어댑터 (메모리) ──
// 데모용. ⚠️ 서버 재시작/배포 환경에서는 유지되지 않는다.
// 실제 저장이 필요해지면 Prisma 어댑터로 교체한다(server-architecture 스킬 참고).
const store: Note[] = [];

export const memoryNoteRepo: NoteRepo = {
  async list() {
    return [...store].reverse();
  },
  async add(note) {
    store.push(note);
  },
};
