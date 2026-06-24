import type { Metadata } from "next";
import { noteService } from "@/server/note";
import { NotesDemo } from "@/components/notes-demo";

export const metadata: Metadata = {
  title: "노트 데모 · AI Agent Coding Starter",
};

// 서버 컴포넌트: 초기 데이터는 여기서 service로 직접 가져와 props로 넘긴다.
// (인터페이스 레이어는 API 라우트뿐 아니라 서버 컴포넌트도 될 수 있다.)
export default async function NotesPage() {
  const initialNotes = await noteService.list();
  return <NotesDemo initialNotes={initialNotes} />;
}
