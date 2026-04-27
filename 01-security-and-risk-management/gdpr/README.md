---
tier: 1
domain: Security and Risk Management (Domain 1)
exam_weight: ~16%
status: built
---

# GDPR for the CISSP Exam

A study-oriented overview of how the General Data Protection Regulation (Regulation (EU) 2016/679) is treated on the CISSP exam, what kinds of questions are asked, and which traps the item writers consistently set. Use this alongside `gdpr.tsv` in this folder.

## Where GDPR Sits in the Exam

GDPR is tested in **Domain 1 — Security and Risk Management**, which is the highest-weighted domain on the CISSP at roughly 16% of the exam. Inside the official ISC2 exam outline (effective April 15, 2024 and still current as of 2026), GDPR appears explicitly under the sub-objective "Determine compliance and other requirements" → "Issues related to privacy," called out by name alongside the California Consumer Privacy Act, China's Personal Information Protection Law (PIPL), and South Africa's Protection of Personal Information Act (POPIA). The exam outline is the authoritative scope document — if a topic isn't on it, ISC2 cannot test it; GDPR is on it.

A small amount of GDPR-flavored material can also surface in Domain 2 (Asset Security) when the question is framed around data classification, data retention, data remanence, or cross-border data handling, and occasionally in Domain 7 (Security Operations) when the scenario is about incident response and breach notification timelines. But the center of gravity is unambiguously Domain 1.

## How Heavily GDPR Itself Is Tested

The community consensus from study guides, exam-prep providers, and candidates writing about their experience is consistent: a candidate should expect a small handful of GDPR-touching questions on a CAT exam (typically two to five out of ~125), with a small chance of a scenario question that turns entirely on a GDPR concept. You will not be expected to know article numbers, recital language, or fine schedules with legal precision. You ARE expected to know roles, the 72-hour rule, the seven principles, the major data subject rights, and territorial scope well enough to apply them to a scenario.

The 2024 outline refresh, which carries through into the 2026 exam, deliberately pushed the question pool toward scenario-based application questions ("Company Y has problem Z — what do you do?") and away from rote definitional questions. That shift matters for GDPR specifically because it means most GDPR questions you see will hinge on correctly identifying somebody's role in a fact pattern (controller vs. processor vs. data subject vs. supervisory authority) and then applying the right obligation to that role. Pure "what does Article 5 say" recall questions still appear but are the minority.

## The Question Patterns That Actually Show Up

### Role identification under a breach scenario

This is the highest-frequency pattern, and the Susan question that prompted these flashcards is a textbook example. The fact pattern describes an organization "processing data on behalf of" some larger entity, then asks who must be notified after a breach. The correct answer is always the controller, because Article 33(2) makes the processor's only direct GDPR notification obligation a notification up the chain to the controller — the processor does not call the supervisory authority and does not call data subjects. The trap answer is "the supervisory authority" or "the regulator," because that is the headline 72-hour rule everyone half-remembers. The other distractor that appears reliably is "the data owner," which is not a GDPR term at all — it comes from internal data governance frameworks like DAMA-DMBOK and is included precisely to catch candidates who haven't separated GDPR vocabulary from general InfoSec vocabulary.

### The 72-hour rule, controller side

When the scenario is written from the controller's perspective, the question is usually testing two things at once: that you know the deadline is 72 hours (not 24, not 48, not "immediately," not "within a reasonable time"), and that you know when the clock starts. The clock starts when the controller becomes "aware" of the breach with reasonable certainty — not when the breach occurred and not when forensics are complete. A common variant gives a timeline ("breach happened Monday, IT confirmed Wednesday, when must they notify?") and tests whether you anchor on awareness. A separate variant tests the secondary rule under Article 34 — that data subjects themselves must be told if the breach is likely to result in a high risk to their rights and freedoms.

### Data subject rights, especially the right to erasure

The right to erasure ("right to be forgotten") is by far the most-tested individual right because it is the most distinctive thing about GDPR compared to older US privacy frameworks. Expect a scenario where a customer asks an organization to delete their data and the question is whether the organization must comply, under what conditions, and what exceptions apply (legal obligation to retain, freedom of expression, public interest, defense of legal claims). The right of access (Article 15) and the right to data portability (Article 20) also appear, usually as distractors against erasure.

### The seven principles of Article 5

These get tested as either a recognition question ("which of the following is NOT a GDPR principle?") or as a scenario where you have to identify the principle being violated. Data minimization and purpose limitation are the two most-tested principles because they map onto practical scenarios cleanly — an organization is collecting more data than the stated purpose requires, or is reusing data for a new purpose without a new lawful basis. Storage limitation is tested when the scenario involves data retention policies. Accountability is tested as the umbrella principle that requires the organization to demonstrate compliance, not just achieve it.

### Territorial scope (Article 3)

A surprisingly common pattern: a US-only company with no European offices serves European customers via a website. Does GDPR apply? Yes, under Article 3(2), because GDPR follows the data subject, not the controller's headquarters. Item writers like this question because it tests a counterintuitive result.

### Privacy-by-design and DPIAs

Article 25 (data protection by design and by default) and Article 35 (Data Protection Impact Assessments) usually appear as scenario questions where you have to identify which control or process applies. Privacy-by-design is the answer when the scenario is about engineering or product decisions made early in the lifecycle. DPIA is the answer when the scenario describes processing that is "likely to result in a high risk" — large-scale profiling, large-scale processing of special category data, or systematic monitoring of public areas.

### Cross-framework comparison questions

Because the ISC2 outline lists GDPR alongside CCPA, PIPL, and POPIA, expect at least one question that asks you to recognize a parallel concept across frameworks. The most common pairing is GDPR's controller/processor against HIPAA's covered entity / business associate. The CCPA/CPRA equivalents are "business" and "service provider," which also appear. You do not need encyclopedic knowledge of every framework; you need to recognize that "the entity that decides why and how data is processed" maps to controller, covered entity, or business depending on which regime is named.

## The Trap Patterns to Inoculate Against

The exam consistently uses three traps around GDPR. The first is the **role swap**: the question is written as if it's about a controller's obligation but the actor in the scenario is actually a processor (or vice versa). Always identify the role first; the obligation follows from the role. The second is the **vocabulary leak**: distractors borrow from internal data governance frameworks ("data owner," "data steward," "data custodian") that are real concepts but are NOT GDPR terms — if the question is explicitly about GDPR, those answers are essentially always wrong. The third is the **timeline distractor**: the 72-hour rule gets mixed into option lists with 24 hours, 48 hours, and "without unreasonable delay" — the last one is HIPAA's language, not GDPR's, and is included to confuse candidates who study both regimes simultaneously.

## A Minimal Study Priority

If you only have time to memorize ten things about GDPR for the exam, in priority order: first, the controller/processor distinction and what each owes the supervisory authority (Article 33 and 33(2)); second, the 72-hour rule and when the clock starts; third, the seven principles of Article 5; fourth, the right to erasure and the other major data subject rights in Articles 15–22; fifth, territorial scope under Article 3; sixth, what triggers a DPIA under Article 35; seventh, what privacy by design means under Article 25; eighth, when a DPO is mandatory under Articles 37–39; ninth, the cross-framework analogs (controller ≈ covered entity ≈ business); and tenth, the maximum administrative fines (€20 million or 4% of global turnover, whichever is higher, under Article 83(5)). The 35 cards in `gdpr.tsv` cover all of the above with the controller/processor cards weighted most heavily because that's what the exam weights most heavily.

## What You Do NOT Need to Memorize

Article numbers themselves (the test will describe the rule, not name the article); recital text; specific fine amounts levied in real cases (Meta, Amazon, etc.); the names and addresses of national supervisory authorities beyond the obvious examples (ICO, CNIL); the full text of Standard Contractual Clauses; the post-Schrems II EU-US data transfer history. These show up on CIPP/E and CIPM exams, not CISSP.

## Authoritative Sources

The official ISC2 CISSP exam outline at https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline is the source of truth for what is and isn't testable. The outline PDF (April 2024 effective date) is the document that explicitly names GDPR.

For the regulation itself, https://gdpr-info.eu/ is the most readable mirror of the consolidated text and is what most CISSP study guides cite. Articles 4 (definitions), 5 (principles), 6 (lawful bases), 15–22 (subject rights), 25 (by design), 33–34 (breach notification), 35 (DPIAs), 37–39 (DPO), and 83 (fines) cover virtually everything CISSP can test.

For plain-English walkthroughs the UK Information Commissioner's Office guide at https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/ is excellent (note that the UK has its own UK GDPR post-Brexit, but the substantive rules are essentially identical to the EU GDPR for exam purposes). The European Data Protection Board guidelines at https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en are the authoritative regulator-side interpretations and worth skimming for the breach notification topic specifically (Guidelines 9/2022).

For exam-specific framing the most useful third-party references are Destination Certification's Domain 1 material, the ThorTeaches CISSP Domain 1 GDPR preview at https://thorteaches.com/cissp-d1-preview-general-data-protection-regulation-gdpr/, and the privacy section at https://cissprep.net/privacy/. The free practice question banks at ExamTopics and Wentz Wu's blog include real-world question patterns that demonstrate the role-identification trap repeatedly.

Sources used to compile this README:

- [ISC2 CISSP Certification Exam Outline](https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline)
- [CISSP Exam Outline PDF (April 2024)](https://assets.ctfassets.net/82ripq7fjls2/2D57uYE9A4MhPVAV3SBJLk/8389a0d0386c5c2814b52df9ab1603a8/CISSP-Exam-Outline-April-2024-English.pdf)
- [ThorTeaches — CISSP Domain 1 GDPR Preview](https://thorteaches.com/cissp-d1-preview-general-data-protection-regulation-gdpr/)
- [CISSPrep — Privacy](https://cissprep.net/privacy/)
- [Destination Certification — Privacy Laws and Global Standards](https://destcert.com/resources/cybersecurity-compliance-privacy-laws/)
- [Destination Certification — Privacy & Intellectual Property MindMap](https://destcert.com/resources/privacy-and-intellectual-property-mindmap/)
- [Dummies — Privacy Requirements Compliance and the CISSP Exam](https://www.dummies.com/article/academics-the-arts/study-skills-test-prep/cissp/privacy-requirements-compliance-cissp-exam-254853/)
- [GDPR-Info — Article 33 (breach notification to supervisory authority)](https://gdpr-info.eu/art-33-gdpr/)
- [GDPR-Info — Article 4 (definitions)](https://gdpr-info.eu/art-4-gdpr/)
- [ICO — Personal data breaches: a guide](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/)
- [EDPB — Guidelines 9/2022 on personal data breach notification](https://www.edpb.europa.eu/system/files/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf)
- [BalancedSec — Understanding CISSP Domain 1](https://blog.balancedsec.com/p/understanding-cissp-domain-1-security)
- [ExamCert — How to Pass CISSP in 2026](https://www.examcert.app/blog/how-to-pass-cissp-2026/)
