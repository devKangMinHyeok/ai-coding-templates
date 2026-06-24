-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요.
-- server/note 예시가 사용하는 notes 테이블입니다.

create table if not exists public.notes (
  id text primary key,
  text text not null,
  created_at timestamptz not null default now()
);

-- 이 데모는 서버(service_role 키)에서만 접근하므로 RLS 없이 동작합니다.
-- 브라우저에서 anon 키로 직접 접근하려면 RLS를 켜고 정책을 추가하세요:
--   alter table public.notes enable row level security;
--   create policy "notes read"  on public.notes for select using (true);
--   create policy "notes insert" on public.notes for insert with check (true);
