import "server-only";
import { createNoteService } from "./note.service";
import { memoryNoteRepo } from "./note.repo.memory";
// import { supabaseNoteRepo } from "./note.repo.supabase"; // 👈 DB 쓸 때 주석 해제

// ── 배럴(이 도메인의 공개 API) ──
export type { Note, NewNote } from "./note.model";
export type { NoteService } from "./note.service";

// 기본 배선: 메모리 어댑터 (DB 없이 바로 동작, 단 새로고침/배포 시 사라짐)
export const noteService = createNoteService(memoryNoteRepo);

// 👉 Supabase(영속 저장)로 전환하는 법 — 단 두 줄:
//   1) 위 supabaseNoteRepo import 주석 해제
//   2) 아래로 교체:  export const noteService = createNoteService(supabaseNoteRepo);
//   (사전: supabase/schema.sql 실행 + .env.local 설정. database 스킬 참고)
