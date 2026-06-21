/**
 * import_us_au_health.mjs
 * Imports the Group-0 (no-website) US/AU health practice leads from the
 * scored pipeline output into Supabase as "US-AU Health — Jun 2026".
 *
 * Source: outputs/us_au_health_leads/us_au_health_scored.json (9,929 scored;
 * this imports priority_group === 0 only — the no-website cohort).
 *
 * Run: set -a; source .env.local; set +a; node scripts/import_us_au_health.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const SCORED = "/Users/rishav/Downloads/codex/outputs/us_au_health_leads/us_au_health_scored.json";
const TODAY = new Date().toISOString().slice(0, 10);
const LIST = "US-AU Health — Jun 2026";

const PITCH = {
  SOCIAL_AS_WEBSITE:
    "CONFIRMED no real website — business uses Facebook/Instagram as its web home. Pitch: practice website with online booking, live in 2-3 weeks ($2.5-4.5k). Use 'deserves more than a Facebook page' opener from international-email-sequences.md.",
  NO_WEBSITE_LISTED:
    "No website on record (machine-checked; CONFIRM with 30-sec search before sending — small chance of data gap). Pitch: 'couldn't find a website for {Practice}' opener + free homepage concept.",
};

const all = JSON.parse(readFileSync(SCORED, "utf8"));
const group0 = all.filter((l) => l.priority_group === 0);
console.log(`Importing ${group0.length} no-website leads...`);

const rows = group0.map((l, i) => {
  const email = (l.emails || [])[0] || "";
  const phone = (l.phones || [])[0] || "";
  const social = (l.socials || [])[0] || "";
  const site = (l.websites || [])[0] || "";
  return {
    id: `usau-health-${String(i + 1).padStart(4, "0")}`,
    source_id: l.id,
    name: l.name,
    list: LIST,
    niche: l.category,
    location: `${l.city || ""}${l.region ? ", " + l.region : ""} (${l.metro})`,
    address: l.address || "",
    phone,
    alternate_phone: (l.phones || [])[1] || "",
    email,
    website_status:
      l.web_verdict === "SOCIAL_AS_WEBSITE"
        ? `VERIFIED ${TODAY}: NO real website — ${l.web_evidence}`
        : `VERIFIED ${TODAY}: no website on record (confirm via search before send)`,
    rating: "",
    reviews: "",
    source_link: social,
    other_link: site,
    lead_reason: `Machine-verified ${TODAY} (Overture + website checker). Score ${l.score}. ${email ? "PUBLIC EMAIL available — free contact channel." : "No public email — use contact form/socials/phone."}`,
    pitch: PITCH[l.web_verdict] || "",
    decision_maker: "",
    opening_hours: "",
    notes: `Priority Group 0 (no website). Verdict: ${l.web_verdict}. Evidence: ${l.web_evidence}. Email sequence: see pixelorcode-ops/outreach/international-email-sequences.md. Deep-verify (agents) before first send if in Sniper 50.`,
    status: "Not Contacted",
    owner: "Rishav",
    last_action: `Imported from US-AU health pipeline ${TODAY}`,
    whatsapp_sent: false,
    whatsapp_replied: false,
    email_sent: false,
    next_follow_up: null,
    proposal_status: "None",
    client_value: "",
    created_at: TODAY,
    updated_at: TODAY,
  };
});

for (let i = 0; i < rows.length; i += 100) {
  const chunk = rows.slice(i, i + 100);
  const { error } = await supabase.from("leads").upsert(chunk, { onConflict: "id" });
  if (error) {
    console.error(`❌ chunk ${i}: ${error.message}`);
    process.exit(1);
  }
  console.log(`  ✅ ${Math.min(i + 100, rows.length)}/${rows.length}`);
}
console.log(`🎉 Done — ${rows.length} leads imported as "${LIST}".`);
