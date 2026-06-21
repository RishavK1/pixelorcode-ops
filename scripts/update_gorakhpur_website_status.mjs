/**
 * update_gorakhpur_website_status.mjs
 * Writes web-verified website status (researched 2026-06-11) onto the 30
 * "Gorakhpur Local Sprint — Jun 2026" leads. Sites were confirmed by fetching
 * them and matching phone/address; dead domains checked via DNS + whois.
 *
 * Run: set -a; source .env.local; set +a; node scripts/update_gorakhpur_website_status.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

// id suffix → [website_status, other_link]
const VERIFIED = {
  "001": ["VERIFIED 2026-06-11: HAS website", "https://abhyaasgkp.com/"],
  "002": ["VERIFIED 2026-06-11: HAS website", "https://www.momentum.ac.in/"],
  "003": ["VERIFIED 2026-06-11: HAS website", "https://www.parakramacademy.com/"],
  "004": ["VERIFIED 2026-06-11: NO website — Facebook/YouTube + Justdial only", ""],
  "005": ["VERIFIED 2026-06-11: HAS website (as RNS Coaching Center)", "https://rnscoachingcenter.com/"],
  "006": ["VERIFIED 2026-06-11: HAS website", "https://saraswatiias.in/"],
  "007": ["VERIFIED 2026-06-11: NO working website — old domain catalystiitpmt.com expired and now redirects to a gambling spam site; catalystiitneet.com unregistered. URGENT angle.", ""],
  "008": ["VERIFIED 2026-06-11: HAS website", "https://gulatidentalclinic.com/"],
  "009": ["VERIFIED 2026-06-11: HAS website", "https://www.drvikashdental.com/"],
  "010": ["VERIFIED 2026-06-11: HAS website (under doctor's name)", "https://dransharma.com/"],
  "011": ["VERIFIED 2026-06-11: NO website — Facebook + Justdial/Practo only", ""],
  "012": ["VERIFIED 2026-06-11: NO working website — their old drlaldentalclinic.com EXPIRED ~Apr 2026 (in redemptionPeriod). They already paid for a site once. Strong angle.", ""],
  "013": ["VERIFIED 2026-06-11: HAS website", "https://www.diagnodrugs.com/"],
  "014": ["VERIFIED 2026-06-11: NO working website — their aonediagnosticcentre.com (reg. Jun 2025) is suspended/dead. They wanted one. Strong angle.", ""],
  "015": ["VERIFIED 2026-06-11: HAS thin auto-built Justdial site, HTTPS cert EXPIRED (only loads over http). Upgrade angle, not no-website.", "http://www.medlinegorakhpur.in/"],
  "016": ["VERIFIED 2026-06-11: HAS website", "https://graceinteriorhub.com/"],
  "017": ["VERIFIED 2026-06-11: HAS website", "https://gorakhpurinterior-world.com/"],
  "018": ["VERIFIED 2026-06-11: HAS website", "https://castleinterior.in/"],
  "019": ["VERIFIED 2026-06-11: NO website — Justdial + Facebook page only", ""],
  "020": ["VERIFIED 2026-06-11: NO working website — old a3interiordesigner.com expired/unregistered (last live Nov 2024). They already valued a site once. Strong angle.", ""],
  "021": ["VERIFIED 2026-06-11: NO website — Facebook + Justdial only (fitnessgarage.co.in is a Bhubaneswar gym, NOT them)", ""],
  "022": ["VERIFIED 2026-06-11: NO website — Facebook (FXG1111) + Justdial only; old Google business.site retired (404)", ""],
  "023": ["VERIFIED 2026-06-11: NO website — Justdial only (forcefitness.pages.dev belongs to a DIFFERENT Force Fitness at Ramjanki Nagar — competitor has a site, they don't!)", ""],
  "024": ["VERIFIED 2026-06-11: NO working website — their brewerzcafe.com is DEAD (domain lapsed, last live Jul 2024). Facebook/Zomato only now. Strong angle.", ""],
  "025": ["VERIFIED 2026-06-11: NO website — Facebook/Instagram/Zomato only (baatichokha.com is the Varanasi chain, NOT them)", ""],
  "026": ["VERIFIED 2026-06-11: NO website — Justdial/Zomato + Facebook/Instagram only (aamacafe.in dead)", ""],
  "027": ["VERIFIED 2026-06-11: NO website — Instagram + Justdial/Zomato/Tripadvisor only", ""],
  "028": ["VERIFIED 2026-06-11: HAS website", "https://skyablypropertygroup.com/"],
  "029": ["VERIFIED 2026-06-11: HAS website with own booking", "https://www.pradeepgroupofhotels.com/hotel-pradeep-star-inn.html"],
  "030": ["VERIFIED 2026-06-11: HAS website", "https://hotelumapalace.in/"],
};

const TODAY = new Date().toISOString().slice(0, 10);
let updated = 0;
for (const [suffix, [status, link]] of Object.entries(VERIFIED)) {
  const id = `gorakhpur-local-${suffix}`;
  const patch = { website_status: status, updated_at: TODAY };
  if (link) patch.other_link = link;
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) {
    console.error(`❌ ${id}: ${error.message}`);
    process.exit(1);
  }
  updated++;
}
console.log(`✅ Updated website_status on ${updated}/30 Gorakhpur leads.`);
