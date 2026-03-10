# VERDICT — Seed Data & Indian Legal Context

## Characters (Consistent across all seeds)

| Name | Role | Email | Status |
|------|------|-------|--------|
| Adv. Prit Thacker | Senior Partner | prit@verdictlaw.in | online |
| Adv. Meera Shah | Associate | meera@verdictlaw.in | online |
| Ravi Kumar | Paralegal | ravi@verdictlaw.in | online |
| Adv. Rohan Iyer | Associate | rohan@verdictlaw.in | away |
| Adv. Priya Desai | Associate | priya@verdictlaw.in | offline |

**Password for all seeded users:** `password123` (hashed with bcryptjs)

---

## Cases (Consistent references)

| Case ID | Name | Type | Status | Lead |
|---------|------|------|--------|------|
| VDT-2024-001 | Sharma v. State of Maharashtra | Criminal Defense | discovery | Adv. Prit Thacker |
| VDT-2024-002 | Nexus Technologies IP Dispute | Intellectual Property | motion | Adv. Meera Shah |
| VDT-2024-003 | DEF Corp Trade Secret | Corporate Litigation | trial | Adv. Prit Thacker |
| VDT-2024-004 | Horizon Corp Merger Review | Mergers & Acquisitions | intake | Adv. Rohan Iyer |
| VDT-2024-005 | Gupta Family Estate | Estate Planning | discovery | Adv. Priya Desai |
| VDT-2024-006 | CloudNet Breach Liability | Cyber Law | intake | Adv. Meera Shah |

---

## Courts Referenced

- Bombay High Court
- Supreme Court of India
- City Civil Court, Mumbai
- Sessions Court, Mumbai
- NCLT Mumbai Bench
- District Court, Pune

---

## Chat Threads

- `# General` — firm-wide announcements
- `# Sharma v. State` — case-specific discussion
- `# Nexus IP` — case-specific discussion
- `# Horizon Corp` — case-specific discussion
- `# DEF Corp` — case-specific discussion
- `# CloudNet` — case-specific discussion

---

## Rules for New Seed Data

1. Must use characters from the table above
2. Must reference existing case IDs where applicable
3. Must use Indian legal terminology (FIR, Chargesheet, Bail, IPC/BNS, CrPC/BNSS)
4. Dates should be in 2024-2025 range
5. Billing in ₹ (store as paise integers)
6. Hours stored as cents (350 = 3.50h)
7. Court names must be real Indian courts
8. Case names follow `[Plaintiff] v. [Defendant]` or `State v. [Accused]`
9. Advocate names prefixed with `Adv.`
