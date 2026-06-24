import "server-only";
import type { NoteRepo } from "./note.repo";
import { getSupabase } from "@/server/supabase";

// ── 인프라 어댑터 (Supabase / Postgres) ──
// 포트(NoteRepo)의 실제 저장 구현. 테이블: notes(id, text, created_at)
// 테이블 생성 SQL은 supabase/schema.sql 참고.
type NoteRow = { id: string; text: string; created_at: string };

export const supabaseNoteRepo: NoteRepo = {
  async list() {
    const { data, error } = await getSupabase()
      .from("notes")
      .select("id, text, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as NoteRow[]).map((row) => ({
      id: row.id,
      text: row.text,
      createdAt: row.created_at,
    }));
  },
  async add(note) {
    const { error } = await getSupabase().from("notes").insert({
      id: note.id,
      text: note.text,
      created_at: note.createdAt,
    });
    if (error) throw error;
  },
};
