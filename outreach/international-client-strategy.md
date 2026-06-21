# PixelorCode — International Client Acquisition Strategy
_Drafted 2026-06-11. Goal: land international clients (1 intl ≈ 10-15 Indian deals by value)._

## Core positioning
Design + engineering studio ("We design. We code. We automate.") — NEVER "affordable offshore agency".
Productized fixed-price packages in USD/AUD + monthly care plan (the MRR engine).

## Target definition
- **Size:** 2–15 person businesses/practices (NOT VC startups — they DIY or know designers)
- **Exclude at source:** AI companies, software companies, dev shops, marketing agencies
- **Niche order:**
  1. 🥇 Dental / health practices (dental, physio, chiro, med-spa, vet) — existing playbook from Bangalore/UAE clinic work; booking-automation recurring revenue
  2. 🥈 Small law firms (solo–10 attorneys) — highest SMB budgets; intake-CRM angle
  3. 🥉 Construction/trades (remodelers, roofers, builders)
  4. Real estate — property management first (portals), not agents
  5. Education (tutoring/private schools) — Ryan's case study fits; second wave
- **Country order:** USA + Australia first (English, timezone synergy: US ET 9am = 6:30pm IST; AU = IST morning). Germany/France = phase 3 only with localized templates/partner (language + GDPR expectations).
- **Metros:** mid-size, agency-light: Austin, Phoenix, Tampa, Charlotte, Columbus, Kansas City / Brisbane, Adelaide, Gold Coast. Avoid NYC/LA/SF saturation.

## ⚡ BOOTSTRAP MODE (current — ₹0 budget until first client funds the stack)
Decided 2026-06-11: no new spend until first client closes. Replacements:
- Email: **Zoho Mail Forever Free** on pixelorcode.com (custom domain, 5 users, DNS-only setup) + SPF/DKIM/DMARC (free DNS records)
- Warmup: manual — 5-10 normal emails/day for 2 weeks, then cold at 10/day → 20/day. High personalization = high engagement = natural warmup
- Contacts: practice emails are PUBLIC (own sites/FB/listings); owner names on the practice listing; Hunter free tier (25/mo) + LinkedIn free for gaps. Send only to publicly listed emails (= bounce protection without a paid verifier)
- Loom free tier (25 videos × 5 min) for top-15 prospects
- **"Sniper 50" play:** pipeline finds 300-500 verified leads → hand-pick 50 most-broken/best-rated → triple-touch each (email + their own website CONTACT FORM (zero spam risk, nobody does this) + Loom/LinkedIn for top tier). Precision over volume while sending capacity is warmup-limited anyway
- Free inbound in parallel: Reddit/FB groups where SMB owners ask for web help (value-first, no spam)
- Cash-flow note: Gorakhpur pipeline (16 contacted, ₹20-35k deals, WhatsApp = free) funds the paid stack on first close
- UPGRADE TRIGGER: first client closed → buy Google Workspace, Instantly ($37/mo), Apollo ($49/mo), sending domain

## Stage 0 — Infrastructure (full version, post-first-client)
- [x] Domain owned: pixelorcode.com
- [ ] Zoho Mail free → hello@pixelorcode.com (NOW, ₹0)
- [ ] SPF + DKIM + DMARC (NOW, ₹0)
- [ ] Google Workspace + separate cold-sending domain (AFTER first client)
- [ ] Instantly.ai or Smartlead warmup (AFTER first client)
- [ ] Rishav LinkedIn rebuild — niche-specific headline ("Websites & booking systems for dental practices"), case study featured, face photo (NOW, ₹0)
- [ ] Proof pack: Ryan's case study page + 2-3 spec concepts labeled "Concept — [niche], [city]" + USD pricing one-pager (NOW, ₹0 — labor only)

## Stage 1 — Lead sourcing (scripted, reuses existing assets)
- Extend Overture Maps pipeline (`outputs/international_service_business_leads/pull_overture_by_country.py` etc.) per niche × metro
- Scripted website-status verification (the Karnal method, automated): NO_SITE / DEAD / EXPIRED_SSL / FROZEN(old dates) / FREE_TEMPLATE / OK
- Score: reviews × rating × website-badness × contactability → import top batch to CRM

## Stage 2 — Contact enrichment
- Apollo.io ($49/mo): industry + 2-15 employees + geo filters; excludes software/AI; → verified emails, LinkedIn URLs, some direct dials
- Hunter.io + LinkedIn for Maps-sourced practice owners (owner = the named dentist/lawyer)
- MillionVerifier every batch (bounce >3% kills the domain)

## Stage 3 — Outreach (the proven Gorakhpur formula, localized)
- Skeleton: "Hi [Practice] team — [one verifiable broken thing]. Your [4.9★/200 reviews] deserve better. We fix exactly this. Worth a look at a concept?"
- 4-touch email sequence over 14 days; 20-40/day/inbox cap
- Loom videos for top 50 (90-sec walkthrough of THEIR broken site) — highest-converting US SMB cold asset
- LinkedIn connect 2 days after email #1; org-greeting rule applies (no guessed first names unless verified)
- Replies handled evenings IST (US) / mornings IST (AU)

## Stage 4 — Close & price
- Packages: practice site + online booking $3,500 (3 weeks) · law-firm site + intake CRM $5,000+ · care plan $200-500/mo
- ₹ anchor for sanity: one $3.5k deal ≈ ₹2.9L ≈ 11× Ryan's deal
- MRR goal: 20 care-plan clients × $250 = $5k/mo floor

## 30-day plan
- W0: Stage 0 complete, warmup running
- W1: pipeline build → 300-500 verified US/AU dental-health leads → enrich top 150 → CRM list "US Dental — Jul 2026"
- W2-3: sequences live, Looms, LinkedIn parallel
- W4: review (target 3-5% reply, 2-3 calls) → clone machine for law firms

## KPIs
- Deliverability: <3% bounce, >50% open
- Reply ≥3%, positive-reply ≥1%, call-book ≥0.5% of sends
- First intl close target: within 45 days of first send
