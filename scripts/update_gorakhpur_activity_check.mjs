/**
 * update_gorakhpur_activity_check.mjs
 * Appends 2026-06-11 business-activity verification results to the notes of
 * the 5 "dead website" Gorakhpur leads (007, 012, 014, 020, 024).
 *
 * Run: set -a; source .env.local; set +a; node scripts/update_gorakhpur_activity_check.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const FINDINGS = {
  "gorakhpur-local-007":
    "ACTIVITY CHECK 2026-06-11: LIKELY ACTIVE (medium). Newest evidence: FB post 2 Jan 2026; NEET-2025 toppers + admission posts Jun–Jul 2025; no closure markers on any listing. BUT no visible 2026-27 admission marketing yet, and even their NEWER site (catalystiitneet.com, built Aug 2024) has lapsed — they lost TWO domains. Verify alive with a phone call first, then pitch.",
  "gorakhpur-local-012":
    "ACTIVITY CHECK 2026-06-11: LIKELY ACTIVE (medium). Patient reviews through ~Dec 2025; listing shows Open, Mon–Sat 9–9 with a live 'Free Dental Checkup' offer; Dr. Manish Lal has not relocated (no profile in any other city); socials live. No closure markers anywhere.",
  "gorakhpur-local-014":
    "ACTIVITY CHECK 2026-06-11: LIKELY ACTIVE (medium). Google reviews growing 1,134 → 1,150 (4.9★) with newest visible review 4 Aug 2025 (mirror crawl ceiling, likely still growing); listed Open 24 hours; no closure markers or news. Formal name at address per Justdial: 'A One Care Hospital and Diagnostic Centre' (alt phone +91 99365 97515).",
  "gorakhpur-local-020":
    "ACTIVITY CHECK 2026-06-11: ⚠️ SISTER BRAND of Gorakhpur Interior World (#017) — same owner (Ajit), same building (Ajit/Azeet Plaza, Budhvihar, Taramandal), shared phone. A3's Instagram still posts under its own name (latest 4 Mar 2026, festival greetings only); real project marketing flows through GIW, which HAS a website and posted 8 Jun 2026. Pitching A3 standalone = pitching Ajit, who already has a site for his main brand. DEMOTED — fold into a single Ajit/GIW conversation, don't burn it with a 'you have no website' opener.",
  "gorakhpur-local-024":
    "ACTIVITY CHECK 2026-06-11: ✅ ACTIVE (strongest of the 5). Zomato shows Open/not-closed TODAY; Restaurant Guru hours synced 9 Jun 2026; parent co Wrappy Frappy Hospitality Pvt Ltd is MCA-ACTIVE with ₹35.2L FY25 revenue; Google reviews into Jan 2026. Note: 'two locations' is really ONE flagship (Tej Plaza/Buddh Vihar = Deoria Bypass Taramandal address) + a Golghar/Park Road branch on Zomato/Swiggy.",
};

const TODAY = new Date().toISOString().slice(0, 10);

for (const [id, finding] of Object.entries(FINDINGS)) {
  const { data, error } = await supabase.from("leads").select("notes").eq("id", id).single();
  if (error) {
    console.error(`❌ read ${id}: ${error.message}`);
    process.exit(1);
  }
  const notes = [data.notes, finding].filter(Boolean).join("\n\n");
  const { error: upErr } = await supabase
    .from("leads")
    .update({ notes, updated_at: TODAY, last_action: "Activity verified (web research)" })
    .eq("id", id);
  if (upErr) {
    console.error(`❌ update ${id}: ${upErr.message}`);
    process.exit(1);
  }
  console.log(`✅ ${id}`);
}
console.log("Done — activity findings appended to all 5 leads.");
