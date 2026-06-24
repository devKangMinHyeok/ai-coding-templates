import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase 클라이언트 (서버 전용).
// service_role 키를 쓰므로 절대 클라이언트 번들로 새면 안 된다 → server-only 가드.
// 지연 생성 + 캐시 (let 금지 규칙 때문에 객체 캐시 사용).
const cache: { client: SupabaseClient | null } = { client: null };

export function getSupabase(): SupabaseClient {
  if (!cache.client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 없습니다. .env.local 을 설정하세요 (database 스킬 참고).",
      );
    }
    cache.client = createClient(url, key, { auth: { persistSession: false } });
  }
  return cache.client;
}
