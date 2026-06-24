import "server-only";

// ── 도메인 레이어 ──
// 순수한 타입과 규칙만. 프레임워크도, DB도 모른다. (테스트하기 가장 쉬운 곳)

export type Note = {
  id: string;
  text: string;
  createdAt: string; // ISO 문자열
};

export type NewNote = {
  text: string;
};

// 도메인 규칙(순수 함수): 새 노트 입력 검증
export function validateNewNote(input: NewNote): { ok: true } | { ok: false; reason: string } {
  const text = input.text.trim();
  if (text.length === 0) return { ok: false, reason: "내용이 비어 있어요." };
  if (text.length > 280) return { ok: false, reason: "280자를 넘을 수 없어요." };
  return { ok: true };
}
