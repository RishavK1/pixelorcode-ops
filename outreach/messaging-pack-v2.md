# PixelOrCode Outreach Messaging Pack v2
_Replaces the v1 single-touch templates. Built 2026-06-11._

## Why v1 underperformed (83 sends → 2 replies)
1. **Too long.** Cold WhatsApp must read like a human typed it on a phone. 2–4 short lines.
2. **No name.** "Hi {Business} team" when the CRM has `decisionMaker`. Names ~2x reply rates.
3. **Link in message 1.** Hurts WhatsApp deliverability + screams broadcast. Link only after a reply.
4. **Pitch before permission.** v1 explained PixelOrCode's services before they cared.
5. **No follow-ups.** Most cold replies come on touch 2–4. v1 stopped at touch 1.
6. **Weak CTA.** "Worth sharing?" → replace with a question that's *easier to answer than ignore*.

## Rules for every send
- Personalize 2 fields minimum: name/locality + one specific observation (rating, reviews, "no website found").
- One idea per message. One question per message.
- Send window: 10:30 AM–1 PM or 4–7 PM local time. Never Sunday morning.
- WhatsApp: max 25–30 NEW conversations/day per number (warm number first week: 10/day) to avoid bans.
- Log every send + reply in CRM same day. Status flow: WhatsApp Sent → (no reply 3d) Follow Up → Replied/Interested.

---

# SEQUENCE A — Clinics (Bangalore / Pune), WhatsApp

### A1 — Opener (Day 0)
> Hi Dr. {firstName} 👋
>
> Found {clinicName} while searching for {specialty} in {locality} — {rating}★ with {reviews} reviews, but no website came up.
>
> That usually means patients comparing clinics online can't find you. We fix exactly this for clinics. Open to seeing a quick homepage mockup for {clinicName}? Free, no strings.

*If no doctor name → "Hi, is this the right number for {clinicName}?" as line 1 (gets a reply by itself).*

### A2 — Follow-up 1 (Day 3) — add value, don't nag
> Quick one — I sketched how {clinicName}'s site could look: services, doctor profile, reviews, and a WhatsApp "Book Appointment" button patients tap directly.
>
> Want me to send the preview here?

### A3 — Follow-up 2 (Day 7) — social proof + scarcity
> Last note from my side 🙂 We're building a site right now for a {city} education centre (₹26k full package — site + enquiry tracking).
>
> Taking 2 more {specialty} clinics this month. Should I hold a slot for {clinicName}?

### A4 — Breakup (Day 12)
> No worries if timing's off, Dr. {firstName}. I'll leave it here — if patients finding you online becomes a priority, just reply "site" and I'll share the mockup. All the best with {clinicName} 🙏

---

# SEQUENCE B — Education / Tuition (Bangalore / Pune), WhatsApp

### B1 — Opener (Day 0)
> Hi {firstName} 👋
>
> I was looking up {niche} options in {locality} and {centreName} kept coming up ({rating}★) — but there's no website where parents can see batches, results, and fees.
>
> Parents almost always Google before calling. We're doing exactly this for Ryan's Tuition Centre right now. Want to see what their new site looks like?

*The Ryan's case study is the weapon here — same niche, real proof. Use it in message 1.*

### B2 — Follow-up 1 (Day 3)
> Sharing what the Ryan's Tuition Centre package includes: website + admission enquiry form + a simple dashboard tracking every parent enquiry. ₹26,000 all-in.
>
> Worth a 10-min call this week to see if it fits {centreName}?

### B3 — Follow-up 2 (Day 7)
> Admission season planning happens early — centres with a proper site capture enquiries all summer.
>
> If I send a 1-page plan for {centreName} (free), will you take a look?

### B4 — Breakup (Day 12)
> Closing the loop 🙂 If you ever want parents to find {centreName} online before your competitors, reply "plan" and it's yours. Good luck with the new batch!

---

# SEQUENCE C — UAE Clinics, Email

### C1 — Opener (Day 0)
**Subject:** {clinicName} — patients drop off before booking

> Hi {firstName},
>
> I reviewed {clinicName}'s online presence this week. You're visible on Google — but the path from "found you" to "booked appointment" has friction: {specificGap, e.g. "no WhatsApp booking on the site" / "treatment pages don't show pricing clarity" / "no reviews shown at decision point"}.
>
> We rebuild that path for clinics: treatment pages → WhatsApp booking → automated follow-up. Typical result is more booked consultations from the same traffic, within 30 days.
>
> Worth 15 minutes this week? I'll bring 3 specific fixes for {clinicName} — yours to keep either way.
>
> {senderName}
> PixelOrCode — pixelorcode.com

### C2 — Follow-up 1 (Day 3)
**Subject:** Re: {clinicName} — patients drop off before booking

> Hi {firstName} — sending the first fix as a teaser:
>
> {Fix #1, one sentence, specific to their site.}
>
> Two more where that came from. 15 minutes this week or next?

### C3 — Follow-up 2 (Day 8)
**Subject:** 3 fixes for {clinicName} (attached thinking)

> {firstName}, I'll keep it simple — here are all 3 fixes: {bullet, bullet, bullet}.
>
> If implementing any of these is interesting, reply and I'll show how we'd do it. If not, no hard feelings — they're yours.

### C4 — Breakup (Day 14)
**Subject:** closing the file on {clinicName}
> Assuming the timing isn't right — I'll stop here. If the booking flow becomes a priority this quarter, you know where I am. Good luck!

**Deliverability checklist (do BEFORE next email batch):**
- [ ] Stop sending from @gmail.com → use hello@pixelorcode.com (Google Workspace, ~₹160/mo)
- [ ] Set up SPF, DKIM, DMARC on pixelorcode.com
- [ ] Warm the inbox: 10/day week 1, 20/day week 2, then 40/day max
- [ ] Plain text, no images, ONE link max (signature only)

---

# SEQUENCE D — International Service Businesses (400 leads), Email/WhatsApp
Same skeleton as C, adjusted: lead reason is usually "no/weak website."
Opener angle: "Customers in {city} are searching for {niche} — you're invisible past Google Maps. We turn the Maps listing into a site that books jobs."
CTA: free 1-page mockup. Currency in USD ($300–$800 starter sites — price anchor TBD).

---

# Objection cheat-sheet (WhatsApp replies)
| They say | You say |
|---|---|
| "How much?" | "Starter site is ₹15–25k depending on pages, with WhatsApp booking included. Want the 1-page breakdown?" |
| "We have Instagram/JustDial" | "Perfect — that's traffic. A site converts it: patients trust clinics they can read about before calling. The two work together." |
| "Not now" | "Understood 👍 When's better — after {month}? I'll ping you then." → set `nextFollowUp` in CRM |
| "Send details" | Send 1-pager PDF + 2 relevant examples. Then: "Free for a 10-min call tomorrow {time1} or {time2}?" |
| Silence after interest | Day 3: "Should I keep the slot for {name} or release it?" |

# Daily operating rhythm
- **25 new WhatsApp openers/day** (from queue, statuses updated)
- **All due follow-ups first**, before new sends — follow-ups outconvert openers 3:1
- **5 calls/day** to leads who read but didn't reply (blue-tick, no response, 48h+)
- Friday: review reply rate per sequence. Kill/rewrite anything under 5% after 100 sends.
