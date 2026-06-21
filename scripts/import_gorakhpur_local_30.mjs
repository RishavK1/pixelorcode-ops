/**
 * import_gorakhpur_local_30.mjs
 * Upserts the 30 verified Gorakhpur local leads (sprint list, prepared 2026-06-10)
 * into Supabase. Source: "PixelorCode – 30 Verified Local Leads" doc.
 *
 * All leads start as "Not Contacted". Tier + 7-day-plan guidance lives in notes.
 * Anchor offer: ₹20,000–₹35,000 website / website + automation.
 *
 * Run: node scripts/import_gorakhpur_local_30.mjs
 * Requires: VITE_SUPABASE_URL + key in .env.local (same as other imports).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const LIST = "Gorakhpur Local Sprint — Jun 2026";

// tier guidance from the 7-day conversion plan
const TIER_NOTES = {
  t1: "Tier 1 — Coaching (Day 1–2 blitz). CALL first, then WhatsApp a 60-sec mock homepage video with their name on it. All 7 compete with each other — first signing becomes FOMO for the rest.",
  t2: "Tier 2 — Dental/diagnostics (Day 2–3). Lead with AUTOMATION, not websites: reception answers 'report ready hai kya?' 50x/day. Doctors pay for time saved.",
  t3a: "Tier 3a — Interiors (Day 3–5). Visit Taramandal cluster in person. Portfolio website IS their product brochure.",
  t3b: "Tier 3b — Gyms (Day 3–5). Membership site + automated renewal/payment reminders on WhatsApp.",
  t3c: "Tier 3c — Cafes/restaurants (Day 3–5). Menu/QR ordering/booking pitch. Taramandal ones: visit in person.",
  t3d: "Tier 3d — Real estate/hotels (Day 3–5). Lead-capture / direct-booking to cut OTA commission.",
};

// #, name, phone (digits), area, rating, reviews, niche, tier, pitch, decisionMaker, extraNote
const RAW = [
  [1,  "Abhyaas Classes (NEET/JEE)",                 "919792905333", "Golghar",            "4.9", "431",  "Coaching institute",   "t1",  "Admission landing page + WhatsApp enquiry bot for the July admission rush. Growing local NEET brand competing with PW/ALLEN.", "", ""],
  [2,  "MOMENTUM (Chatrasangh campus)",              "916390903201", "Bansgaon Colony",    "4.8", "767",  "Coaching institute",   "t1",  "One site covering both campuses + automated fee reminders and test-result SMS/WhatsApp.", "", "Multi-campus local coaching."],
  [3,  "Parakram Academy (Defence/NDA)",             "919455050673", "Bakshipur",          "4.8", "892",  "Coaching institute",   "t1",  "Results showcase site + lead form for SSB interview batch enquiries.", "", "Niche defence-exam academy."],
  [4,  "SKR Gurukul Pathshala (NEET)",               "919118273334", "Bank Road",          "5.0", "48",   "Coaching institute",   "t1",  "Real website to match their ambition — keyword-stuffed Google listing shows they want visibility but lack a site.", "", "⭐ EASIEST CONVERT in Tier 1 per sprint doc."],
  [5,  "R.N.S Career Institute",                     "919598715998", "Kunraghat",          "4.8", "249",  "Coaching institute",   "t1",  "Affordable starter site + Google Business optimisation.", "", "Budget coaching with loyal students."],
  [6,  "Saraswati IAS Coaching",                     "919559970002", "Paidleganj",         "4.4", "227",  "Coaching institute",   "t1",  "Site with toppers list + enrolment form + automated study-material delivery.", "", "UPSC/PCS coaching."],
  [7,  "Catalyst (JEE/NEET)",                        "919335656500", "Civil Lines",        "4.5", "565",  "Coaching institute",   "t1",  "Credibility site so they stop losing students to branded chains.", "", "Established faculty-led institute."],
  [8,  "Dr. Sanjiv Gulati Dental Clinic Premier",    "917860966444", "Bank Road",          "4.8", "276",  "Dental clinic",        "t2",  "Appointment-booking site + WhatsApp reminder automation.", "Dr. Sanjiv Gulati", "Premium clinic; patients travel from Lucknow."],
  [9,  "Dr Vikash Dental",                           "917897777223", "Khajanchi Chauraha", "4.9", "102",  "Dental clinic",        "t2",  "Online booking to cut phone-call chaos.", "Dr. Vikash", "Open 7 days 9am–10pm = volume practice."],
  [10, "Priya Dental Hospital & Maxillofacial Centre","919936593214","Kunraghat",          "4.8", "309",  "Dental clinic",        "t2",  "Authority website (procedures, before/after) + Google review automation.", "", "Specialist trauma centre."],
  [11, "K-Shekhar Dentals",                          "919648644400", "Asuran Chowk",       "4.9", "286",  "Dental clinic",        "t2",  "Booking + reminders.", "Dr. Abhishek Kumar Singh", "Highly rated; draws patients from other cities."],
  [12, "Dr. Lal Multispeciality Advance Dental",     "919455038019", "Medical College Rd", "4.9", "380",  "Dental clinic",        "t2",  "Site that converts out-of-town searches.", "Dr. Lal", "Gets patients from as far as Hyderabad per reviews."],
  [13, "Diagnodrugs Diagnostics (Path + Ultrasound)","919140303398", "Medical College Rd", "4.9", "188",  "Diagnostic lab",       "t2",  "Online test booking + automated WhatsApp report delivery — huge daily time-saver.", "", "24x7 lab."],
  [14, "A-One Diagnostic Centre",                    "919389917993", "Shatabdipuram",      "4.8", "1134", "Diagnostic lab",       "t2",  "Report-delivery + home-collection booking automation.", "", "Large 24x7 centre; already does tele-collection."],
  [15, "Medline Path Lab & Diagnostic Centre",       "919839051374", "Taramandal",         "4.7", "532",  "Diagnostic lab",       "t2",  "Same automation pitch — 24x7 ops mean staff drowning in calls.", "", "Taramandal cluster."],
  [16, "Grace Interior Hub",                         "919451122411", "Taramandal",         "4.9", "432",  "Interior designer",    "t3a", "Portfolio website with project galleries + lead-capture. SEO-stuffed Google name = they crave visibility.", "", "⚠️ Same building as Gorakhpur Interior World (#17) — sign one, FOMO the other."],
  [17, "Gorakhpur Interior World",                   "919451117883", "Taramandal",         "4.9", "370",  "Interior designer",    "t3a", "Portfolio website — direct competitor of Grace Interior Hub.", "", "⚠️ Same building as Grace Interior Hub (#16) — sign one, FOMO the other."],
  [18, "Castle Group of Interior",                   "917525872999", "Taramandal",         "5.0", "414",  "Interior designer",    "t3a", "Premium website is literally part of their 'luxury' brand promise — easy story to sell.", "", "Taramandal cluster."],
  [19, "Gorakhpur Interior Decor",                   "918840774021", "Karim Nagar",        "4.9", "143",  "Interior designer",    "t3a", "Website as the equaliser vs bigger names.", "", "Smaller player fighting the Taramandal trio."],
  [20, "A3 Interior Designer & Builder",             "919451546780", "Taramandal",         "4.8", "177",  "Interior designer",    "t3a", "Project showcase + enquiry automation.", "", "Builder + designer combo. Taramandal cluster."],
  [21, "Fitness Garage (Unisex Gym)",                "918840476092", "Ashok Nagar",        "4.6", "220",  "Gym",                  "t3b", "Membership site + automated renewal/payment reminders on WhatsApp.", "", "Independent gym vs Anytime Fitness chains."],
  [22, "Fitness Xpress (FXG)",                       "919807676976", "Padri Bazar",        "4.6", "521",  "Gym",                  "t3b", "Membership + renewal automation — owner is an engineer, will get the pitch instantly.", "Er Shivam", "Owner named in Google reviews."],
  [23, "Force Fitness Gym",                          "918355066535", "Krishna Nagar",      "4.9", "191",  "Gym",                  "t3b", "Membership + renewal automation.", "", "24-hr independent gym."],
  [24, "Brewerz Cafe",                               "918573000316", "Taramandal",         "4.7", "3041", "Cafe",                 "t3c", "Menu site with QR ordering + table reservation.", "", "Big footfall. Taramandal cluster."],
  [25, "Baati Chokha Restaurant",                    "918881019990", "Taramandal",         "4.8", "4642", "Restaurant",           "t3c", "Brand website + party/group booking form — they likely lose catering leads daily.", "", "Iconic local brand. Taramandal cluster."],
  [26, "The Three Stories by Aama Cafe",             "918009256475", "Vijay Chowk",        "4.6", "66",   "Cafe",                 "t3c", "Instagram-linked site — young owners building a brand, receptive.", "", "New aesthetic cafe."],
  [27, "KaaFee Break",                               "917727070874", "Asuran Chowk",       "4.8", "837",  "Cafe",                 "t3c", "Starter site + Google profile cleanup.", "", "Budget cafe with strong reviews."],
  [28, "Skyably Property Group",                     "916391000414", "Azad Nagar",         "4.8", "26",   "Real estate",          "t3d", "Listings website + lead CRM with auto follow-up — every lost enquiry = lost lakhs for them.", "", ""],
  [29, "Hotel Pradeep Star Inn",                     "917518600445", "Mohaddipur",         "4.8", "5123", "Hotel",                "t3d", "Direct-booking website to cut OTA commissions + banquet enquiry automation.", "", "3-star hotel + banquet."],
  [30, "Hotel Uma Palace",                           "919956411114", "Bargadwa",           "4.2", "220",  "Hotel",                "t3d", "Booking site + WhatsApp enquiry bot.", "", "Weakest digital presence in this tier."],
];

function buildRow([num, name, phone, area, rating, reviews, niche, tier, pitch, dm, extra]) {
  const id = `gorakhpur-local-${String(num).padStart(3, "0")}`;
  return {
    id,
    source_id: `GKP-${String(num).padStart(3, "0")}`,
    name,
    list: LIST,
    niche,
    location: area,
    address: `${area}, Gorakhpur, Uttar Pradesh`,
    phone: "+" + phone,
    alternate_phone: "",
    email: "",
    website_status: "Likely none/thin — VERIFY with 30-sec Google check right before the call",
    rating,
    reviews,
    source_link: "",
    other_link: "",
    lead_reason: `Verified on Google Maps 2026-06-10: ${rating}★ (${reviews} reviews). Local — can demo on WhatsApp in Hindi and meet in person. Pre-qualified for ₹20k–35k budget.`,
    pitch,
    decision_maker: dm,
    opening_hours: "",
    notes: [TIER_NOTES[tier], extra].filter(Boolean).join(" "),
    status: "Not Contacted",
    owner: "Rishav",
    last_action: "Imported from Gorakhpur 30-lead sprint doc (prepared 2026-06-10)",
    whatsapp_sent: false,
    whatsapp_replied: false,
    email_sent: false,
    next_follow_up: null,
    proposal_status: "None",
    client_value: "",
    created_at: TODAY,
    updated_at: TODAY,
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

console.log("🚀 Importing Gorakhpur Local Sprint leads into Supabase...\n");

const rows = RAW.map(buildRow);
const byTier = rows.reduce((acc, r) => {
  const t = r.notes.split(" — ")[0];
  acc[t] = (acc[t] || 0) + 1;
  return acc;
}, {});

console.log(`📊 Total: ${rows.length}`);
Object.entries(byTier).forEach(([t, n]) => console.log(`   ${t}: ${n}`));
console.log();

await upsertChunks("leads", rows);

console.log(`\n🎉 Done! All ${rows.length} Gorakhpur leads imported as "${LIST}".`);
console.log("   Visit https://pixelorcode-ops.vercel.app → Leads → filter the new list.");
