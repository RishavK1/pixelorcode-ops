import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const seedPath = process.env.SEED_DATA_PATH
  || path.resolve(root, "../private-lead-data/pixelorcode-ops/seedData.json");
const proposalPdfPath = process.env.RYAN_PROPOSAL_PDF_PATH
  || path.resolve(root, "../private-lead-data/pixelorcode-ops/ryan-tuition-centre-proposal.pdf");

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function toLeadRow(lead) {
  return {
    id: lead.id,
    source_id: lead.sourceId || "",
    name: lead.name || "",
    list: lead.list || "",
    niche: lead.niche || "",
    location: lead.location || "",
    address: lead.address || "",
    phone: lead.phone || "",
    alternate_phone: lead.alternatePhone || "",
    email: lead.email || "",
    website_status: lead.websiteStatus || "",
    rating: lead.rating || "",
    reviews: lead.reviews || "",
    source_link: lead.sourceLink || "",
    other_link: lead.otherLink || "",
    lead_reason: lead.leadReason || "",
    pitch: lead.pitch || "",
    decision_maker: lead.decisionMaker || "",
    opening_hours: lead.openingHours || "",
    notes: lead.notes || "",
    status: lead.status || "Not Contacted",
    owner: lead.owner || "Unassigned",
    last_action: lead.lastAction || "Imported",
    whatsapp_sent: Boolean(lead.whatsappSent),
    whatsapp_replied: Boolean(lead.whatsappReplied),
    email_sent: Boolean(lead.emailSent),
    next_follow_up: lead.nextFollowUp || null,
    proposal_status: lead.proposalStatus || "None",
    client_value: lead.clientValue || "",
    created_at: lead.createdAt || new Date().toISOString().slice(0, 10),
    updated_at: lead.updatedAt || new Date().toISOString().slice(0, 10),
  };
}

function toProposalRow(proposal, filePath = "") {
  return {
    id: proposal.id,
    lead_name: proposal.leadName || proposal.client || "",
    client: proposal.client || "",
    status: proposal.status || "Sent",
    value: proposal.value || "",
    phone: proposal.phone || "",
    email: proposal.email || "",
    owner: proposal.owner || "Sales Team",
    service: proposal.service || "",
    sent_date: proposal.sentDate || null,
    valid_until: proposal.validUntil || null,
    next_step: proposal.nextStep || "",
    file_name: proposal.fileName || "",
    file_type: proposal.fileType || "application/pdf",
    file_path: filePath || proposal.filePath || "",
    notes: proposal.notes || "",
    created_at: proposal.createdAt || new Date().toISOString().slice(0, 10),
    updated_at: proposal.updatedAt || new Date().toISOString().slice(0, 10),
  };
}

async function upsertInChunks(table, rows, chunkSize = 100) {
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict: "id" });
    if (error) throw error;
    console.log(`Imported ${table}: ${Math.min(index + chunk.length, rows.length)}/${rows.length}`);
  }
}

const raw = await fs.readFile(seedPath, "utf8");
const seed = JSON.parse(raw);

await upsertInChunks("leads", seed.leads.map(toLeadRow));

let ryanFilePath = "";
try {
  const pdfBytes = await fs.readFile(proposalPdfPath);
  ryanFilePath = `proposal-ryan-001/${Date.now()}-ryan-tuition-centre-proposal.pdf`;
  const { error } = await supabase.storage
    .from("proposal-pdfs")
    .upload(ryanFilePath, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (error) throw error;
  console.log(`Uploaded proposal PDF: ${ryanFilePath}`);
} catch (error) {
  console.warn(`Proposal PDF upload skipped: ${error.message}`);
}

if (seed.proposals?.length) {
  const proposalRows = seed.proposals.map((proposal) => (
    proposal.id === "proposal-ryan-001"
      ? toProposalRow(proposal, ryanFilePath)
      : toProposalRow(proposal)
  ));
  await upsertInChunks("proposals", proposalRows);
}

console.log("Supabase seed import complete.");
