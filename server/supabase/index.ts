import "server-only";
// server/supabase 의 공개 API (배럴). 바깥에서는 @/server/supabase 로만 import 한다.
export { getSupabase } from "./client";
