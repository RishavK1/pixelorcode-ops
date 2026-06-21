/**
 * import_karnal_education_20.mjs
 * Upserts the 20 verified Karnal (Haryana) education leads — big private schools
 * and colleges with dead/broken/outdated websites. Researched + fetch-verified
 * 2026-06-11 (6 parallel research passes, 60+ institutions assessed).
 *
 * Run: set -a; source .env.local; set +a; node scripts/import_karnal_education_20.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars — run with: set -a; source .env.local; set +a");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const TODAY = new Date().toISOString().slice(0, 10);
const LIST = "Karnal Education — Jun 2026";

// [num, name, niche, location, phone, altPhone, email, websiteStatus, deadOrLiveLink, leadReason, pitch, notes]
const RAW = [
  [1, "OPS International School", "School (CBSE, boarding)", "Kunjpura Road, Karnal", "+919896936009", "+919813873339", "info@opsschoolkarnal.in",
   "VERIFIED 2026-06-11: BROKEN — opsschoolkarnal.in is a half-built shell showing literal lorem-ipsum dummy text on the live homepage; events frozen Jun-2024.",
   "https://opsschoolkarnal.in/",
   "1,900+ students (own site claim), day-cum-boarding, est. 1999, Justdial 3.9★/97. Biggest broken-site school in district.",
   "Finish what the last vendor abandoned: real website + hostel-parent app + admission CRM. A 1,900-student boarding school showing printer's dummy text to every parent.",
   "Tier A #1. OPS GROUP BUNDLE with OPS Vidya Mandir (karnal-edu-006) — same Bansal family (OPS Group of Jewellers). Shri Lord Krishna Educational Society."],
  [2, "DAV Centenary Public School", "School (CBSE)", "Indri Road (Kurali, SH-7), Karnal", "+9101842389132", "+9101842389032", "",
   "VERIFIED 2026-06-11: DEAD (FRESH OUTAGE) — davcenkarnal.com SSL expired + HTTP 503; site was alive 14 Apr 2026 per archive. Hosting died within last ~8 weeks.",
   "",
   "~1,000 students, ~45 teachers, CBSE aff. 530711. Time-sensitive: site just died — rescue window before they re-sign old vendor.",
   "Urgent hosting-rescue + rebuild. Call NOW: 'your school website went down recently — we can have it back, better, in a week.'",
   "Tier A #2. DAV (Arya Samaj) network but locally managed. Directories mislabel as ICSE — it is CBSE 530711."],
  [3, "St. Kabir Public School", "School (CBSE)", "Sector 8, opp. Gymkhana Club, Karnal", "+919896060843", "+9101842233523", "",
   "VERIFIED 2026-06-11: DEAD — stkabirpublicschoolkarnal.com NXDOMAIN (domain expired). No replacement domain exists. stkabir.co.in is the Chandigarh school — NOT them.",
   "",
   "Est. 1977 (49 years), KG–XII, 30+ classrooms, fees ~₹65.6k, Justdial 4.2★/96. Active FB/IG + Admissions 2026-27 listing live.",
   "Ground-up website + admission CRM for a 49-year-old school with zero web presence during admission season.",
   "Tier A #3. Independent. Active socials: facebook.com/stkabirpublicschoolkarnal, @skps_karnal."],
  [4, "Jeevan Chanan (PG) Mahila Mahavidyalaya", "Women's degree college (KUK)", "Bypass College Road, Assandh, Karnal", "+919254377243", "+9101749277243", "principaljcmm@gmail.com",
   "VERIFIED 2026-06-11: DEAD/HIJACKED — jcmmassandh.in expired and now serves a GAMBLING affiliate site (Stake India review, 2026-dated). College has no working site.",
   "",
   "556 students, 11.5-acre campus, 9 courses (BA/BSc/BCom/BBA/BCA/MA/MCom), Justdial 4.3★/135. 2026 admission cycle live on directories.",
   "Their domain now shows betting content to anyone Googling the college — urgent reputation fix + new site + admission portal. Sister institution Jeevan Chanan College of Education (jcceassandh.in) is also stale → 2-college bundle.",
   "Tier A #4. 🎰 GAMBLING-HIJACK ANGLE (same as Catalyst Gorakhpur — proven message). Founder: Sh. Baldev Raj Arora. Women's college — formal tone."],
  [5, "Prakash Public School", "School (CBSE)", "Vikas Nagar, adj. Sector 6, Karnal", "+918053480808", "+9101842282200", "",
   "VERIFIED 2026-06-11: BROKEN — ppskonline.com serves a cPanel default page (hosting collapsed ~Sep 2025). ppskarnal.com is a parked lander, not theirs.",
   "",
   "Est. 1990, 4.5-acre campus, Sr. Sec. all streams, CBSE aff. 530261, Justdial 3.9★/114. FB ~2,469 likes, posting currently.",
   "Hosting collapsed mid-contract — website rescue + fee-payment portal.",
   "Tier A #5. Independent."],
  [6, "OPS Vidya Mandir", "School (CBSE)", "Sector 13 Urban Estate, Karnal", "+9101842201239", "+9101842201240", "",
   "VERIFIED 2026-06-11: BROKEN — opsvidyamandirkarnal.com returns a blank 2,934-byte shell: school name only, zero content/contact/images on every page.",
   "https://opsvidyamandirkarnal.com/",
   "Est. 2003, 125 reviews. ALREADY PAYS for a Snapcore parent app (on Play Store) — proven ed-tech budget.",
   "You already pay for a parent app but your public site is literally blank — bundle a real website with the app you have.",
   "Tier A #6. OPS GROUP BUNDLE with OPS International (karnal-edu-001). Lord Rama Education Society."],
  [7, "Doon Valley Group of Institutes", "College group (engg/pharmacy/MBA/MCA/B.Ed)", "Sector 17, outside Jundla Gate, Karnal", "+919996360000", "+919053000391", "trustdoonvalley@gmail.com",
   "VERIFIED 2026-06-11: BROKEN — doonvalleygroup.in SSL certificate expired Jul-2025 (11 months): every visitor gets a browser security warning. Content stale (newest 2023-24). B.Ed college site doonvalleycollege.in frozen at ©2021.",
   "https://doonvalleygroup.in/",
   "Multi-college trust est. 2000: engineering, pharmacy (B/M/D.Pharm ~150 seats), MCA, MBA, B.Ed. In HSTES 2026 counselling lists.",
   "One group deal = many sites: SSL fix + group platform + student/admission portals across all constituent colleges.",
   "Tier A #7. GROUP BUNDLE — biggest multi-site opportunity in the list. Admission helpline banner still live on broken site."],
  [8, "Cambridge Sr. Sec. School", "School (CBSE)", "Khidrabad Road, Assandh, Karnal", "+919050001843", "+9101749277800, +919729728720", "cambridgesrsecschool@gmail.com",
   "VERIFIED 2026-06-11: DEAD — cambridgeassandh.com DNS resolution fails entirely. No web presence beyond directories.",
   "",
   "Est. 1991 — oldest big private school in Assandh, CBSE 1–12 + pre-primary, English medium.",
   "35 years of reputation, zero Google footprint — greenfield site + fee-payment portal.",
   "Tier A #8. Principal listed: Ms. Santosh (do not use name in messages per org-greeting rule). ASSANDH BELT trip: pair with JPS Academy + Jeevan Chanan."],
  [9, "Anthem International School", "School (CBSE)", "Nigdhu (Karnal–Kaithal road), Karnal", "+919813444799", "+919355449000, +9101745267455", "",
   "VERIFIED 2026-06-11: DEAD — anthemkarnal.com parked by a Chinese domain reseller (503); antheminternationalschool.com no DNS. Only Facebook survives.",
   "",
   "CBSE aff. 531013, Pre-Nursery–XII all streams, est. 2010, 6-acre campus, 40 classrooms, swimming pool, ~387 students Nur–VIII.",
   "Lapsed domain is parked by a reseller — recover/replace before admission season and put the pool-and-6-acres campus where parents can see it.",
   "Tier A #9. Mata Om Wati Educational Society. FB: facebook.com/antheminternationalschool."],
  [10, "JPS Academy", "School (CBSE)", "Karnal Road, Assandh, Karnal", "+919896296939", "", "",
   "VERIFIED 2026-06-11: BROKEN — jpsacademy.com has NO HTTPS at all (Chrome marks Not Secure); ancient table-layout ASP.NET with template leftovers from another college. BUT footer says updated 24 May 2026 — they actively maintain it.",
   "http://jpsacademy.com/",
   "Best-reviewed school in Assandh: 4.4★/115, CBSE aff. 530643, classes 1–12, est. 2007.",
   "They update their site monthly but it's marked Not Secure and unreadable on phones — modern rebuild + admission CRM. Active maintenance = proven willingness to pay.",
   "Tier A #10. ASSANDH BELT trip with Cambridge + Jeevan Chanan. FB: facebook.com/jpsacademyasd."],
  [11, "S.M.S. Memorial Public School", "School (CBSE, hostel)", "Taraori, Karnal", "+918199941561", "+9101745241561", "",
   "VERIFIED 2026-06-11: BROKEN — smstaraori.org SSL cert-name mismatch (browser warning); plain-HTTP version shows LIVE 'Admissions Open 2026-27 Nursery–XII' banner.",
   "http://smstaraori.org/",
   "Nursery–XII all streams, est. 2002, hostel, 40 classrooms, 30 teachers, 10,121 m² campus.",
   "Parents clicking your admissions banner hit a security warning first — SSL + rebuild this week, then online admission forms.",
   "Tier A #11. S Mal Singh Educational Society. TARAORI: pair with PPS Taraori visit."],
  [12, "Shri Krishna Parnami Public School", "School (CBSE)", "Model Town, Karnal", "+9101842267645", "", "",
   "VERIFIED 2026-06-11: DEAD — skpps.in whois pendingDelete/serverHold (expired 21-Apr-2026), no DNS. Was live to Jul-2025.",
   "",
   "Est. 1982, CBSE aff. 530174, Sr. Sec., fees ~₹47k.",
   "Domain just lapsed — offer recovery/rebuild before the brand domain is squatted (genuine deadline).",
   "Tier A #12. Independent."],
  [13, "Guru Teg Bahadur Public School", "School (CBSE)", "Saini Colony, Model Town, Karnal", "+919416030956", "+9101842265532", "",
   "VERIFIED 2026-06-11: DEAD — gurutegschool.com NXDOMAIN; phantom .in also dead. Activity signal weaker (no 2025-26 posts found) — VERIFY BY PHONE before pitching.",
   "",
   "Sikh trust, est. 1983, CBSE aff. 530084, pre-nursery–XII, Justdial 4.0★/56, student-teacher 18:1.",
   "New website + basic parent-communication app.",
   "Tier A #13. ⚠️ Call to confirm school still operating normally before pitch."],
  [14, "Gandhi College of Pharmacy + Gandhi College & School of Nursing", "Pharmacy + Nursing colleges (one campus)", "GT Road Bypass, near ITI Chowk, Karnal", "+919416469340", "+9101842267357, +9101844042340", "gsnkarnal@gmail.com",
   "VERIFIED 2026-06-11: Pharmacy site gcpknl.ac.in OUTDATED — newest real notice Sep-2020. Nursing college domain gcsnknl.com NXDOMAIN-DEAD (still in Google index).",
   "https://gcpknl.ac.in/",
   "Est. 1984 (oldest pharmacy college in district). D.Pharm 120 + B.Pharm 60 + nursing ANM 30/GNM 40/Post-Basic BSc. Justdial 4.0★/105. On official HNC 2025-26 recognised lists; HSTES counselling starts late June.",
   "One campus, one owner, two broken web presences — bundle: rebuilt group site + student portal before HSTES counselling (late June). Real deadline.",
   "Tier A #14. CAMPUS BUNDLE (2 institutions). On karnal.gov.in public-utility list — established/credible."],
  [15, "Doon International School", "School (CBSE)", "Shahpur, Chirao Mor, Kaithal Road, Karnal", "+919523000003", "+9101842292025, +918222891231", "diskarnal@gmail.com",
   "VERIFIED 2026-06-11: OUTDATED — dooninternationalschool.in ©2022, contact page 404s, literal tel:123456789 placeholder link, disclosure data stops 2023-24. Old domain diskarnal.com squatted by Chinese parked page.",
   "https://dooninternationalschool.in/",
   "CBSE aff. 530912, Nursery–XII, est. 2009, 56 classrooms, fees ₹72.5k. ACTIVE: KG Admissions 2026-27 live on EzyAdmit, FB active.",
   "A squatter owns your old domain and your contact page is a 404 — domain hygiene + working enquiry funnel + admission CRM for the 2026-27 push.",
   "Tier B #15. NOT the Dehradun Doon chain — independent Karnal school (verified via on-domain CBSE disclosure)."],
  [16, "S.D. Adarsh Public School", "School (CBSE)", "Mandir Marg, Kunjpura Road, Karnal", "+919034045990", "", "",
   "VERIFIED 2026-06-11: OUTDATED — sdadarsh.in newest announcement Dec-2022, ©2023; nothing for 2024-25 onward. (sdadarsh.edu.in dead.)",
   "https://www.sdadarsh.in/",
   "Sanatan Dharam Sabha, est. 1990, CBSE aff. 530112, 10+2. Justdial 4.1★/131 — among best-reviewed city schools. Already has ERP/online-payment links on site.",
   "Site rebuild + parent app — they already pay for an ERP, so the app/portal upsell is natural.",
   "Tier B #16."],
  [17, "Pratap Public School — Taraori + Kunjpura (PPS group)", "Schools (CBSE, group)", "Taraori + Kunjpura, Karnal", "+919215534467", "+919996240400, +9101745242433", "ppstaraori2003@gmail.com",
   "VERIFIED 2026-06-11: OUTDATED — ppstaraori.in footer ©2018 with dead links; ppskunjpura.com ©2024 but homepage STILL shows a COVID-19 closure notice + 'Image Caption Here' placeholders. Their own Sector-6 campus (ppskarnal6.com) is modern with May-2026 news — internal benchmark.",
   "http://ppstaraori.in/",
   "PPS/Darshan Education Foundation network: 8,000+ students across campuses. Taraori CBSE aff. 530547; Kunjpura 685 students/41 teachers. Active socials.",
   "Group-standard pitch: 'Your Sector-6 campus has a 2026 website; Taraori says 2018 and Kunjpura still shows a COVID notice — one CMS for all branches.' Their own benchmark sells it.",
   "Tier B #17. GROUP BUNDLE (2 stale campuses; use Sector-6 as the standard)."],
  [18, "S.S. International School", "School (CBSE)", "Kunjpura Road, near Aviation Club, Karnal", "+919215844023", "+9101842006642, +919215844021", "",
   "VERIFIED 2026-06-11: OUTDATED — ssinternationalschool.com ©2018, early-2010s template, empty gallery; freshest content = hosting CBSE National Volleyball (Girls) 2024.",
   "http://ssinternationalschool.com/",
   "CBSE aff. 530992, Sr. Sec., est. 2008. Justdial 3.8★/165 — largest review count outside city core. Linked to Green Land Schools (Ludhiana regional chain).",
   "You hosted a CBSE national tournament and your website couldn't even announce it — events-driven site + admission CRM.",
   "Tier B #18."],
  [19, "Vinayak Group of Institutions (Management + Polytechnic)", "Colleges (MBA/BBA + diploma)", "Near Bus Stand, Kachhwa, Patiala Road, Karnal", "+919215060456", "+917206533540", "vcpknl@gmail.com",
   "VERIFIED 2026-06-11: OUTDATED — management site frozen at ©2010, polytechnic page ©2017, .org mirror dead. 15-year-frozen group web presence.",
   "https://www.vipmknl.com/",
   "5-acre campus, est. 2008-10: MBA/BBA 180 seats + polytechnic 270 seats across 5 branches, ~39 faculty. Justdial 3.9★/45. Live 2025-26 admission profiles on directories.",
   "Whole-group rebuild: a college asking students to trust it with their careers, showing them a 2010 website. Admission-season urgency (HSTES + KUK cycles).",
   "Tier B #19. GROUP BUNDLE (management + polytechnic + ITI on one campus)."],
  [20, "Dr. Ganesh Dass DAV College of Education for Women", "B.Ed/M.Ed college (KUK, NAAC B++)", "Railway Road, Karnal", "", "", "dgd_dav_edn@yahoo.co.in",
   "VERIFIED 2026-06-11: BROKEN — gddaveducationknl.org serves invalid SSL cert; HTTP page footer ©2012. Separate live LMS exists (newest notice Oct-2024).",
   "http://gddaveducationknl.org/",
   "Est. 1968, NAAC B++ (88%), B.Ed 100 + M.Ed 50 seats, ~273 students, DAV-managed women's college.",
   "A 58-year NAAC B++ institution on a ©2012 site with a broken certificate — heritage-worthy rebuild + integrate their existing LMS.",
   "Tier B #20. ⚠️ No phone surfaced — contact via email or DAV management; aided college, budget approval may be slower."],
];

function buildRow([num, name, niche, location, phone, altPhone, email, websiteStatus, link, leadReason, pitch, notes]) {
  const id = `karnal-edu-${String(num).padStart(3, "0")}`;
  return {
    id,
    source_id: `KNL-${String(num).padStart(3, "0")}`,
    name,
    list: LIST,
    niche,
    location,
    address: `${location}, Haryana`,
    phone,
    alternate_phone: altPhone,
    email,
    website_status: websiteStatus,
    rating: "",
    reviews: "",
    source_link: "",
    other_link: link,
    lead_reason: leadReason,
    pitch,
    decision_maker: "",
    opening_hours: "",
    notes,
    status: "Not Contacted",
    owner: "Rishav",
    last_action: "Imported from Karnal education research (fetch-verified 2026-06-11)",
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

const rows = RAW.map(buildRow);
console.log(`🚀 Importing ${rows.length} Karnal education leads...`);
const { error } = await supabase.from("leads").upsert(rows, { onConflict: "id" });
if (error) {
  console.error("❌", error.message);
  process.exit(1);
}
console.log(`🎉 Done! ${rows.length} leads imported as "${LIST}".`);
