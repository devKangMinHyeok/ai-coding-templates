import { NextResponse } from "next/server";
import { noteService } from "@/server/note";
import { ValidationError } from "@/server/shared";

// ── 인터페이스 레이어 (얇게) ──
// 입력 파싱 → 서비스 호출 → 응답. 비즈니스 로직을 여기 두지 않는다.

export async function GET() {
  const notes = await noteService.list();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string };
  try {
    const note = await noteService.add({ text: body.text ?? "" });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "알 수 없는 오류" }, { status: 500 });
  }
}
