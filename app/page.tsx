import Link from "next/link";

export default function Home() {
  const steps = [
    { cmd: "/init", desc: "환경 정리 + 사용법 소개 + 프로젝트 방향 잡기 (처음 한 번)" },
    { cmd: "/spec", desc: "만들 기능을 질답으로 구체화한다" },
    { cmd: "/impl", desc: "스펙을 작게 나눠 구현한다 (단계마다 검증)" },
    { cmd: "/review", desc: "배포 전 전문가 관점으로 점검한다" },
    { cmd: "/ship", desc: "커밋·푸시 → Vercel 자동 배포 → 내 URL" },
  ];

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-20 dark:bg-black">
      <div className="w-full max-w-2xl">
        <p className="mb-3 text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
          AI Agent Coding Starter
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          가드레일이 깔린 채로 시작하는 AI 코딩
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          똑똑한 프롬프트가 아니라 <strong>가드레일</strong>이 결과물을 지킵니다.
          만들고 싶은 걸 말하면, 검증·구조·배포는 이 환경이 잡아줍니다.
        </p>

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            시작하려면 Claude Code에서{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              /init
            </code>{" "}
            을 입력하세요.
          </p>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s.cmd} className="flex items-baseline gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-black">
                  {i + 1}
                </span>
                <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.cmd}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</span>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/notes"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
        >
          완성 예시 보기: 노트 데모 →
        </Link>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
          이 페이지는 출발점입니다. <code className="font-mono">/init</code> 으로 시작한 뒤,
          이 화면부터 당신의 것으로 바꿔 나가세요. 언제든{" "}
          <code className="font-mono">/help</code> 로 도움을 받을 수 있습니다.
        </p>
      </div>
    </main>
  );
}
