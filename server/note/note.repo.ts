import type { Note } from "./note.model";

// ── 포트(인터페이스) ──
// "저장"을 추상화한다. 구현(어댑터)은 메모리·Prisma 등으로 갈아끼울 수 있다.
// 애플리케이션 레이어는 이 포트에만 의존하므로, 저장 방식을 바꿔도 로직은 그대로다.
export interface NoteRepo {
  list(): Promise<Note[]>;
  add(note: Note): Promise<void>;
}
