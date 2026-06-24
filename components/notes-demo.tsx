"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

// 클라이언트는 서버 코드를 직접 import하지 않는다 (서버/클라 경계).
// 초기 데이터는 서버 컴포넌트가 props로 넘겨주고, 여기서는 상호작용(추가)만 한다.
type Note = { id: string; text: string; createdAt: string };

export function NotesDemo({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = (await res.json()) as { note?: Note; error?: string };
      if (!res.ok) {
        setError(data.error ?? "추가에 실패했어요.");
        return;
      }
      setText("");
      if (data.note) {
        const created = data.note;
        setNotes((prev) => [created, ...prev]);
      }
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-6 py-16">
      <header>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">완성 예시 데모</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          노트
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          UI(클라이언트) → <code className="font-mono">/api/notes</code> → service → repo(메모리)
          전 구간을 보여주는 예시입니다. 초기 목록은 서버 컴포넌트가 직접 불러옵니다.
        </p>
      </header>

      <form onSubmit={add} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          placeholder="메모를 입력하세요"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:ring-zinc-100"
        />
        <button
          type="submit"
          disabled={submitting || text.trim().length === 0}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {submitting ? "추가 중…" : "추가"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <section>
        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            아직 메모가 없어요. 위에서 첫 메모를 추가해 보세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <p className="whitespace-pre-wrap break-words">{note.text}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(note.createdAt).toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/" className="text-sm text-zinc-500 underline dark:text-zinc-400">
        ← 시작 페이지
      </Link>
    </main>
  );
}
