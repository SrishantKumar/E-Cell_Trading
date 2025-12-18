import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("[Supabase] Missing environment variables!")
    console.error("[Supabase] URL present:", !!url)
    console.error("[Supabase] Key present:", !!key)
  } else {
    console.log("[Supabase] Environment variables loaded successfully")
    console.log("[Supabase] URL:", url)
  }

  return createBrowserClient(url!, key!)
}
