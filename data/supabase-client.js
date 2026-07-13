// ============================================================================
//  Supabase client — connects this app to your Supabase project.
// ----------------------------------------------------------------------------
//  SAFE TO COMMIT: the Project URL and the "anon public" key are DESIGNED to be
//  exposed in frontend code. Row-Level Security (the policies you set up) is what
//  actually protects your data — a logged-out request returns nothing.
//
//  NEVER put your database password or a `service_role` key in this file.
// ----------------------------------------------------------------------------
//  HOW TO FILL THIS IN:
//    Supabase dashboard → Project Settings → API
//      • "Project URL"      → paste into SUPABASE_URL below
//      • "anon public" key  → paste into SUPABASE_ANON_KEY below
//    (Replace the PASTE_... placeholders, keep the quotes.)
// ============================================================================

const SUPABASE_URL = "https://xhatyapslpxsembgwbdt.supabase.co";          // e.g. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoYXR5YXBzbHB4c2VtYmd3YmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NDI4NjMsImV4cCI6MjA5ODAxODg2M30.Ub9rdOnDgLb4TojtP1IF-5krUbNzyADEhhfUmI4Oovw"; // long string starting with eyJ...

// Creates the shared client. Requires the @supabase/supabase-js CDN <script> to be
// loaded BEFORE this file in index.html (I'll add that in Stage 1).
// Note: the CDN library is the global `supabase`; our client is named `sb` to avoid
// shadowing it. The rest of the app will use `sb` for all database/auth/storage calls.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
