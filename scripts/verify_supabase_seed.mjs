import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const [
  { count: leadCount, error: leadError },
  { count: proposalCount, error: proposalError },
  { data: storageData, error: storageError },
] = await Promise.all([
  supabase.from("leads").select("id", { count: "exact", head: true }),
  supabase.from("proposals").select("id", { count: "exact", head: true }),
  supabase.storage.from("proposal-pdfs").list("proposal-ryan-001", { limit: 10 }),
]);

if (leadError) throw leadError;
if (proposalError) throw proposalError;
if (storageError) throw storageError;

console.log(JSON.stringify({
  leads: leadCount,
  proposals: proposalCount,
  proposalPdfFiles: (storageData || []).map((item) => item.name),
}, null, 2));
