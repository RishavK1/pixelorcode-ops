/**
 * import_bangalore_clinics.mjs
 * Upserts all 51 Bangalore clinic WhatsApp outreach leads into Supabase.
 * ✅ 47 leads → status "WhatsApp Sent", whatsapp_sent = true
 * ⏭️  4 leads → status "Bounced" (not on WhatsApp), whatsapp_sent = false
 *
 * Run: node scripts/import_bangalore_clinics.mjs
 * Requires: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env.local
 *           OR set SUPABASE_SERVICE_ROLE_KEY for service-role access.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, "../.env.local");
let envVars = {};
try {
  readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) envVars[key.trim()] = rest.join("=").trim();
    });
} catch {}

const supabaseUrl = process.env.SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const TODAY = new Date().toISOString().slice(0, 10);

// ── The 4 numbers NOT on WhatsApp ─────────────────────────────────────────────
const NOT_ON_WHATSAPP = new Set([
  "919741388496", // Dental Essence Clinic
  "917338479826", // Bright Smile Dental Clinic
  "918105784947", // My Health World Skin, Physiotherapy and Blood Testing
  "919886856032", // Sridevi Physiotherapy Clinic
]);

// ── All 51 Leads ──────────────────────────────────────────────────────────────
const RAW_LEADS = [
  { id:"BLR-CL-001", phone:"919886766354", name:"Modi Dental Care & Implant Centre",                             locality:"BTM 2nd Stage",                  type:"Dental clinic",       rating:"4.9", reviews:"100+" },
  { id:"BLR-CL-003", phone:"919945694857", name:"Arya Dental Care",                                              locality:"Vimanapura",                     type:"Dental clinic",       rating:"4.5", reviews:"100+" },
  { id:"BLR-CL-004", phone:"919886085977", name:"Stunning Smile Dental Clinic, Orthodontic And Implant Centre",  locality:"Chinnapanna Halli / AECS Layout", type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-005", phone:"918660603183", name:"Dentessa-Dental Clinic And Implant Center",                     locality:"Rajarajeshwari Nagar",            type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-006", phone:"919739027477", name:"SB Orthodontics and Dental Clinic",                             locality:"Benson Town",                    type:"Dental clinic",       rating:"4.9", reviews:"10+" },
  { id:"BLR-CL-007", phone:"919845675482", name:"Shri Dental Clinic",                                           locality:"Konanakunte",                    type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-008", phone:"919844456567", name:"Divya Dental Clinic",                                          locality:"New Thippasandra",               type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-009", phone:"917795027477", name:"Bilal Dental Clinic",                                          locality:"Pillanna Garden / Nagawara",     type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-012", phone:"919886725671", name:"Dr. V.K Manjunath Speciality Dental Clinic",                   locality:"Kalkere",                        type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-013", phone:"919986337797", name:"Ekadantha Dental Care",                                        locality:"Kadugodi / Whitefield",          type:"Dental clinic",       rating:"4.4", reviews:"10+" },
  { id:"BLR-CL-014", phone:"919686293012", name:"Shivshankar's Dental Care",                                    locality:"Shettihalli / Mederahalli",      type:"Dental clinic",       rating:"4.9", reviews:"10+" },
  { id:"BLR-CL-015", phone:"919902109536", name:"Sri Ram Dental Care",                                          locality:"Sunkadakatte / Hegganahalli",    type:"Dental clinic",       rating:"4.9", reviews:"50+" },
  { id:"BLR-CL-016", phone:"919845581210", name:"Ravi Dental Clinic since 2003",                                locality:"Hoskote",                        type:"Dental clinic",       rating:"",    reviews:"" },
  { id:"BLR-CL-019", phone:"919964328288", name:"Jyothi Dental Architect",                                      locality:"Anekal",                         type:"Dental clinic",       rating:"4.8", reviews:"10" },
  { id:"BLR-CL-021", phone:"919535683269", name:"Your Dentist",                                                 locality:"Ramarao Layout",                 type:"Dental clinic",       rating:"4.9", reviews:"120" },
  { id:"BLR-CL-022", phone:"919448257644", name:"Dental Health Clinic - Nagarbhavi",                            locality:"Nagarbhavi",                     type:"Dental clinic",       rating:"4.9", reviews:"30" },
  { id:"BLR-CL-023", phone:"919778262675", name:"D Dental Care",                                                locality:"R.T. Nagar",                     type:"Dental clinic",       rating:"4.9", reviews:"118" },
  { id:"BLR-CL-024", phone:"919886331928", name:"Speciality Dental Clinic & Implant Centre",                    locality:"Jayanagar 4th T Block East",     type:"Dental clinic",       rating:"4.9", reviews:"51" },
  { id:"BLR-CL-025", phone:"917353810130", name:"PRODENTIST Dental Clinic",                                     locality:"KEB Colony",                     type:"Dental clinic",       rating:"4.9", reviews:"22" },
  { id:"BLR-CL-026", phone:"919008510112", name:"Complete Dental Care",                                         locality:"Bagalur / Shivpura",             type:"Dental clinic",       rating:"4.9", reviews:"238" },
  { id:"BLR-CL-027", phone:"919741388496", name:"Dental Essence Clinic",                                        locality:"28th Cross",                     type:"Dental clinic",       rating:"5.0", reviews:"35" },
  { id:"BLR-CL-028", phone:"919538633214", name:"Specialist's Dental Care and Implant Centre",                  locality:"Bengaluru",                      type:"Dental clinic",       rating:"5.0", reviews:"75" },
  { id:"BLR-CL-029", phone:"919900138215", name:"PSDC Dental Care & Implant Centre",                            locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.6", reviews:"47" },
  { id:"BLR-CL-031", phone:"919606682695", name:"Dental Clinic",                                                locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.4", reviews:"30" },
  { id:"BLR-CL-032", phone:"919845184424", name:"Dental De'Cure",                                               locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.9", reviews:"62" },
  { id:"BLR-CL-033", phone:"919880028424", name:"Dental Health Clinic - B3/B4",                                 locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.7", reviews:"26" },
  { id:"BLR-CL-034", phone:"919535264855", name:"ELV Dental Clinic",                                            locality:"Whitefield",                     type:"Dental clinic",       rating:"4.8", reviews:"35" },
  { id:"BLR-CL-035", phone:"919341239103", name:"Dental Care & Endodontic Center",                              locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.6", reviews:"12" },
  { id:"BLR-CL-037", phone:"917259906146", name:"RCT - Dental Inn",                                             locality:"Sarjapur Road / Wipro area",     type:"Dental clinic",       rating:"4.9", reviews:"260" },
  { id:"BLR-CL-038", phone:"917204390033", name:"Smile 365 Dental Clinic",                                      locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.9", reviews:"55" },
  { id:"BLR-CL-039", phone:"917338479826", name:"Bright Smile Dental Clinic",                                   locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.9", reviews:"49" },
  { id:"BLR-CL-040", phone:"919986736776", name:"Gracious Smilz Dental Clinic",                                 locality:"Bengaluru",                      type:"Dental clinic",       rating:"4.9", reviews:"215" },
  { id:"BLR-CL-042", phone:"919739683930", name:"CorpErgo Physiotherapy & Occupational Health Centre",          locality:"Whitefield / Chansandra",        type:"Physiotherapy clinic", rating:"4.9", reviews:"60" },
  { id:"BLR-CL-043", phone:"919731273126", name:"Physio Care Physiotheraphy Clinic",                            locality:"Pampa Extension",                type:"Physiotherapy clinic", rating:"4.9", reviews:"34" },
  { id:"BLR-CL-044", phone:"919731564251", name:"FisioTerapia Physiotherapy Clinic",                            locality:"AWHO / Bengaluru",               type:"Physiotherapy clinic", rating:"4.8", reviews:"107" },
  { id:"BLR-CL-045", phone:"919003390792", name:"Active Physiotherapy Clinic",                                  locality:"Electronic City area",           type:"Physiotherapy clinic", rating:"5.0", reviews:"33" },
  { id:"BLR-CL-046", phone:"917975762994", name:"Synergy Physiotherapy @ Home Physiotherapy",                  locality:"Bengaluru",                      type:"Physiotherapy clinic", rating:"4.9", reviews:"40" },
  { id:"BLR-CL-047", phone:"919606400244", name:"SYNAPSE Neuro, Physiotherapy & Orthopaedic Clinic",           locality:"Bengaluru",                      type:"Physiotherapy clinic", rating:"4.9", reviews:"15" },
  { id:"BLR-CL-048", phone:"919581773888", name:"Physio Care",                                                  locality:"Jalahalli",                      type:"Physiotherapy clinic", rating:"5.0", reviews:"34" },
  { id:"BLR-CL-049", phone:"918951681928", name:"Advaith Physio - Physiotherapy @ Clinic and Home",            locality:"Sarjapur / Dommasandra",         type:"Physiotherapy clinic", rating:"4.8", reviews:"80" },
  { id:"BLR-CL-050", phone:"918105784947", name:"My Health World Skin, Physiotherapy and Blood Testing",       locality:"Doddanekundi",                   type:"Physiotherapy clinic", rating:"5.0", reviews:"33" },
  { id:"BLR-CL-051", phone:"919742839299", name:"Dr. Mousam's Physiotherapy",                                  locality:"Kodichikkanahalli",              type:"Physiotherapy clinic", rating:"4.9", reviews:"207" },
  { id:"BLR-CL-052", phone:"919941693419", name:"Sri Sai Ortho Neuro Physiotherapy Clinic",                    locality:"Mahalakshmi Layout",             type:"Physiotherapy clinic", rating:"4.8", reviews:"85" },
  { id:"BLR-CL-053", phone:"919742683388", name:"Dr. Pritha Physiotherapy Clinic",                             locality:"Sompura Gate",                   type:"Physiotherapy clinic", rating:"4.8", reviews:"96" },
  { id:"BLR-CL-054", phone:"919886856032", name:"Sridevi Physiotherapy Clinic",                                locality:"BTM 2nd Stage",                  type:"Physiotherapy clinic", rating:"",    reviews:"" },
  { id:"BLR-CL-055", phone:"919632532325", name:"Nithya Sri Physiothrapy Clinic",                              locality:"BTM 2nd Stage",                  type:"Physiotherapy clinic", rating:"",    reviews:"" },
  { id:"BLR-CL-056", phone:"919035923962", name:"AV Physiotherapy and Rehabilitation Clinic",                  locality:"Ramamurthy Nagar",               type:"Physiotherapy clinic", rating:"",    reviews:"" },
  { id:"BLR-CL-057", phone:"919108159004", name:"Kinecore Physiotherapy Clinic",                               locality:"Kadugodi / Whitefield",          type:"Physiotherapy clinic", rating:"4.7", reviews:"10+" },
  { id:"BLR-CL-058", phone:"919074143984", name:"Health Plus Physiotherapy Center",                            locality:"T.C. Palya",                     type:"Physiotherapy clinic", rating:"5.0", reviews:"7" },
  { id:"BLR-CL-059", phone:"919886563826", name:"Chaalana Physiotherapy and Rehabilitation Clinic",            locality:"Bengaluru",                      type:"Physiotherapy clinic", rating:"4.6", reviews:"14" },
  { id:"BLR-CL-060", phone:"919008844441", name:"Medex Spine Care and Physiotherapy Rehabilitation",           locality:"Herohalli / Tunganagara",        type:"Physiotherapy clinic", rating:"",    reviews:"" },
];

function buildRow(lead) {
  const notOnWA = NOT_ON_WHATSAPP.has(lead.phone);
  return {
    id:               lead.id,
    source_id:        lead.id,
    name:             lead.name,
    list:             "Bangalore Clinics — WhatsApp Outreach Jun 2026",
    niche:            lead.type,
    location:         lead.locality,
    address:          "",
    phone:            "+" + lead.phone,
    alternate_phone:  "",
    email:            "",
    website_status:   "No Website",
    rating:           lead.rating || "",
    reviews:          lead.reviews || "",
    source_link:      "",
    other_link:       "",
    lead_reason:      lead.rating
      ? `${lead.rating}★ rating with ${lead.reviews} reviews — high trust signal, no website found.`
      : "No website found — good candidate for PixelOrCode website + WhatsApp booking.",
    pitch:            "We noticed you don't have a dedicated website. We can build one with WhatsApp appointment booking and automated follow-ups.",
    decision_maker:   "",
    opening_hours:    "",
    notes:            notOnWA
      ? "Number not registered on WhatsApp — try email or phone call."
      : "WhatsApp outreach sent on 2026-06-09. Awaiting reply.",
    status:           notOnWA ? "Bounced" : "WhatsApp Sent",
    owner:            "Rishav",
    last_action:      notOnWA ? "WhatsApp — number not on WA" : "WhatsApp sent",
    whatsapp_sent:    !notOnWA,
    whatsapp_replied: false,
    email_sent:       false,
    next_follow_up:   notOnWA ? null : (() => {
      const d = new Date(); d.setDate(d.getDate() + 3);
      return d.toISOString().slice(0, 10);
    })(),
    proposal_status:  "None",
    client_value:     "",
    created_at:       TODAY,
    updated_at:       TODAY,
  };
}

async function upsertChunks(table, rows, size = 50) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error(`❌ Error upserting chunk at index ${i}:`, error.message);
      throw error;
    }
    console.log(`  ✅ Upserted ${Math.min(i + chunk.length, rows.length)}/${rows.length} rows`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("🚀 Importing Bangalore clinic leads into Supabase...\n");

const rows = RAW_LEADS.map(buildRow);

const sent    = rows.filter(r => r.status === "WhatsApp Sent");
const bounced = rows.filter(r => r.status === "Bounced");

console.log(`📊 Total:         ${rows.length}`);
console.log(`✅ WhatsApp Sent: ${sent.length}`);
console.log(`⏭️  Not on WA:     ${bounced.length}\n`);
console.log("Skipped (not on WhatsApp):");
bounced.forEach(r => console.log(`  • ${r.name} (${r.phone})`));
console.log();

await upsertChunks("leads", rows);

console.log("\n🎉 Done! All 51 Bangalore clinic leads imported.");
console.log("   Visit https://pixelorcode-ops.vercel.app → Leads → filter by 'Bangalore Clinics'");
