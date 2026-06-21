import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const jsonPath = new URL("../../outputs/us_linkedin_startup_leads/us_linkedin_startup_leads_40.crm.json", import.meta.url);

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function value(row, name) {
  return row[name] == null ? "" : String(row[name]).trim();
}

function cleanEmail(email) {
  if (!email || /not found|masked|not usable/i.test(email)) return "Not found publicly";
  return email;
}

function toDate() {
  return new Date().toISOString().slice(0, 10);
}

const today = toDate();
const rows = JSON.parse(await fs.readFile(jsonPath, "utf8"));

const leads = rows.filter((row) => value(row, "Company")).map((row, index) => {
  const leadId = value(row, "Lead ID") || `US-LI-${String(index + 1).padStart(3, "0")}`;
  const company = value(row, "Company");
  const website = value(row, "Website");
  const companyLinkedIn = value(row, "Company LinkedIn");
  const personLinkedIn = value(row, "Person LinkedIn");
  const sources = value(row, "Sources");
  const score = value(row, "Priority Score");
  const activity = value(row, "Activity Signal");
  const serviceAngle = value(row, "Best PixelOrCode Service Angle");
  const verification = value(row, "Verification Notes");

  return {
    id: `us-linkedin-startups-${String(index + 1).padStart(3, "0")}`,
    source_id: leadId,
    name: company,
    list: "US LinkedIn Startups",
    niche: value(row, "Niche"),
    location: value(row, "Location"),
    address: "",
    phone: "",
    alternate_phone: "",
    email: cleanEmail(value(row, "Email")),
    website_status: website && !/not found/i.test(website)
      ? "Has active website; LinkedIn-first outreach lead"
      : "Website not confirmed; LinkedIn-first outreach lead",
    rating: "",
    reviews: score ? `Priority score ${score}/10` : "",
    source_link: companyLinkedIn,
    other_link: website,
    lead_reason: value(row, "Why Good Lead"),
    pitch: value(row, "Suggested LinkedIn Opener"),
    decision_maker: [value(row, "Decision Maker"), value(row, "Role")].filter(Boolean).join(" - "),
    opening_hours: "",
    notes: [
      personLinkedIn ? `Person LinkedIn: ${personLinkedIn}` : "",
      activity ? `Activity signal: ${activity}` : "",
      serviceAngle ? `Service angle: ${serviceAngle}` : "",
      verification ? `Verification: ${verification}` : "",
      sources ? `Sources: ${sources}` : "",
    ].filter(Boolean).join("\n"),
    status: value(row, "Outreach Status") || "Not Contacted",
    owner: "Sales Team",
    last_action: "Imported for LinkedIn outreach review",
    whatsapp_sent: false,
    whatsapp_replied: false,
    email_sent: false,
    next_follow_up: null,
    proposal_status: "None",
    client_value: "",
    created_at: today,
    updated_at: today,
  };
});

if (leads.length !== 40) {
  console.error(`Expected 40 leads, found ${leads.length}. Import aborted.`);
  process.exit(1);
}

const { error } = await supabase.from("leads").upsert(leads, { onConflict: "id" });
if (error) throw error;

const { count, error: countError } = await supabase
  .from("leads")
  .select("*", { count: "exact", head: true })
  .eq("list", "US LinkedIn Startups");
if (countError) throw countError;

console.log(`Imported ${leads.length} US LinkedIn leads. Database now has ${count} leads in this list.`);
