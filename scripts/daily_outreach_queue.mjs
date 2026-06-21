// Daily outreach queue generator for PixelOrCode.
// Pulls live leads from Supabase, prioritizes them, pre-fills personalized
// messages from messaging-pack-v2, and writes today's action sheet.
//
// Usage:
//   set -a; source .env.local; set +a
//   node scripts/daily_outreach_queue.mjs [--new=25] [--out=outreach/queue]
//
// Output: outreach/queue/queue-YYYY-MM-DD.md  (human sheet)
//         outreach/queue/queue-YYYY-MM-DD.json (machine copy, wa.me links)

import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const NEW_PER_DAY = Number(args.new || 25);
const OUT_DIR = join(ROOT, String(args.out || "outreach/queue"));

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const today = new Date().toISOString().slice(0, 10);

// ---------- helpers ----------

function waPhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) digits = "91" + digits; // assume India for 10-digit
  if (digits.length === 11 && digits.startsWith("0")) digits = "91" + digits.slice(1);
  return digits;
}

function firstName(decisionMaker) {
  const name = String(decisionMaker || "").trim();
  if (!name || /not (found|available)/i.test(name)) return "";
  return name.replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "").split(/\s+/)[0];
}

function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then) / 86_400_000);
}

// Lead score: who gets contacted first among Not Contacted.
function score(lead) {
  let s = 0;
  const rating = parseFloat(lead.rating) || 0;
  const reviews = parseInt(String(lead.reviews).replace(/\D/g, ""), 10) || 0;
  if (waPhone(lead.phone)) s += 40; // WhatsApp-able beats everything
  if (firstName(lead.decision_maker)) s += 20; // we know who to address
  if (rating >= 4.5) s += 15;
  else if (rating >= 4.0) s += 8;
  if (reviews >= 100) s += 10;
  else if (reviews >= 25) s += 5;
  if (/no .*website|not found/i.test(lead.website_status || "")) s += 10; // core pitch fits
  if (/clinic|education/i.test(lead.list || "")) s += 5; // proven niches first
  return s;
}

function sequenceFor(lead) {
  if (/clinic/i.test(lead.niche || "") || /clinics/i.test(lead.list || "")) return "A (Clinic WhatsApp)";
  if (/education|tuition|school|coaching|academy|training/i.test(`${lead.niche} ${lead.list}`)) return "B (Education WhatsApp)";
  if (/uae/i.test(lead.list || "")) return "C (UAE Email)";
  return "D (Intl Service Email)";
}

function fill(template, lead) {
  const fname = firstName(lead.decision_maker);
  return template
    .replaceAll("{firstName}", fname || "there")
    .replaceAll("{clinicName}", lead.name)
    .replaceAll("{centreName}", lead.name)
    .replaceAll("{specialty}", (lead.niche || "clinic").toLowerCase())
    .replaceAll("{niche}", (lead.niche || "").toLowerCase())
    .replaceAll("{locality}", lead.location || "your area")
    .replaceAll("{city}", /pune/i.test(lead.list || "") ? "Pune" : "Bangalore")
    .replaceAll("{rating}", lead.rating || "great")
    .replaceAll("{reviews}", lead.reviews || "many");
}

const OPENER_A =
  "Hi Dr. {firstName} 👋\n\nFound {clinicName} while searching for {specialty} in {locality} — {rating}★ with {reviews} reviews, but no website came up.\n\nThat usually means patients comparing clinics online can't find you. We fix exactly this for clinics. Open to seeing a quick homepage mockup for {clinicName}? Free, no strings.";
const OPENER_B =
  "Hi {firstName} 👋\n\nI was looking up {niche} options in {locality} and {centreName} kept coming up ({rating}★) — but there's no website where parents can see batches, results, and fees.\n\nParents almost always Google before calling. We're doing exactly this for Ryan's Tuition Centre right now. Want to see what their new site looks like?";
const FOLLOWUPS = {
  "A (Clinic WhatsApp)":
    "Quick one — I sketched how {clinicName}'s site could look: services, doctor profile, reviews, and a WhatsApp \"Book Appointment\" button patients tap directly.\n\nWant me to send the preview here?",
  "B (Education WhatsApp)":
    "Sharing what the Ryan's Tuition Centre package includes: website + admission enquiry form + a simple dashboard tracking every parent enquiry. ₹26,000 all-in.\n\nWorth a 10-min call this week to see if it fits {centreName}?",
};

function openerFor(lead) {
  const seq = sequenceFor(lead);
  if (seq.startsWith("A")) {
    const msg = fill(OPENER_A, lead);
    return firstName(lead.decision_maker) ? msg : `Hi, is this the right number for ${lead.name}?\n\n` + msg.split("\n\n").slice(1).join("\n\n");
  }
  if (seq.startsWith("B")) return fill(OPENER_B, lead);
  return "(email sequence — see messaging-pack-v2.md section " + seq[0] + ")";
}

// ---------- fetch ----------

const { data: leads, error } = await supabase.from("leads").select("*").limit(5000);
if (error) throw error;

const contactedStatuses = ["WhatsApp Sent", "Email Sent", "Follow Up"];
const dueFollowUps = leads
  .filter((l) => {
    if (l.next_follow_up && l.next_follow_up <= today && !["Closed", "Lost"].includes(l.status)) return true;
    return contactedStatuses.includes(l.status) && daysSince(l.updated_at) >= 3 && !l.whatsapp_replied;
  })
  .sort((a, b) => daysSince(b.updated_at) - daysSince(a.updated_at));

const fresh = leads
  .filter((l) => l.status === "Not Contacted")
  .map((l) => ({ ...l, _score: score(l) }))
  .sort((a, b) => b._score - a._score)
  .slice(0, NEW_PER_DAY);

// ---------- write ----------

mkdirSync(OUT_DIR, { recursive: true });

const lines = [];
lines.push(`# Outreach Queue — ${today}`);
lines.push("");
lines.push(`**Rule: follow-ups FIRST, then new sends. Cap: ${NEW_PER_DAY} new WhatsApp openers today.**`);
lines.push("");
lines.push(`## 1. Due follow-ups (${dueFollowUps.length})`);
lines.push("");
for (const l of dueFollowUps) {
  const phone = waPhone(l.phone);
  const seq = sequenceFor(l);
  const fu = FOLLOWUPS[seq] ? fill(FOLLOWUPS[seq], l) : "(see pack)";
  lines.push(`### ${l.name} — ${l.status}, last touch ${daysSince(l.updated_at)}d ago`);
  if (phone) lines.push(`📱 https://wa.me/${phone}`);
  lines.push(`Sequence ${seq} · owner: ${l.owner}`);
  lines.push("```");
  lines.push(fu);
  lines.push("```");
  lines.push("");
}
lines.push(`## 2. New openers (top ${fresh.length} of ${leads.filter((l) => l.status === "Not Contacted").length} untouched)`);
lines.push("");
for (const l of fresh) {
  const phone = waPhone(l.phone);
  lines.push(`### ${l.name} (${l.niche}, ${l.location}) — score ${l._score}`);
  lines.push(`⭐ ${l.rating || "?"} (${l.reviews || "?"} reviews) · DM: ${l.decision_maker || "unknown"}`);
  if (phone) lines.push(`📱 https://wa.me/${phone}?text=${encodeURIComponent(openerFor(l)).slice(0, 1500)}`);
  lines.push("```");
  lines.push(openerFor(l));
  lines.push("```");
  lines.push(`→ After sending: set status "WhatsApp Sent", nextFollowUp = +3 days`);
  lines.push("");
}

const mdPath = join(OUT_DIR, `queue-${today}.md`);
writeFileSync(mdPath, lines.join("\n"));
writeFileSync(
  join(OUT_DIR, `queue-${today}.json`),
  JSON.stringify(
    {
      date: today,
      followUps: dueFollowUps.map((l) => ({ id: l.id, name: l.name, phone: waPhone(l.phone), status: l.status })),
      newLeads: fresh.map((l) => ({ id: l.id, name: l.name, phone: waPhone(l.phone), score: l._score, opener: openerFor(l) })),
    },
    null,
    2
  )
);

console.log(`Queue written: ${mdPath}`);
console.log(`Follow-ups due: ${dueFollowUps.length} | New openers: ${fresh.length}`);
