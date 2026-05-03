---
tier: 2
exam_weight: 13%
---

# Incident Response & Breach Handling for the CISSP Exam

> **Tier:** 1  
> **Domain:** Security Operations (Domain 7) + Security and Risk Management (Domain 1)  
> **Exam Weight:** ~13% + ~16%  
> **Status:** Built

A study-oriented overview of the incident response and breach handling question family on the CISSP. This family lives primarily in Domain 7 (Security Operations) but crosses into Domain 1 for breach notification and regulatory reporting requirements. Use alongside `incident-response.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 7 carries roughly 13% of the exam under ISC2's official outline. Within Domain 7, "Conduct incident management" is one of the largest sub-objectives, and it is where the seven-step lifecycle, the forensic process, evidence handling, and the coordination of internal and external response teams are tested. The breach notification piece — GDPR's 72-hour rule, HIPAA's 60-day rule, the SEC's 4-business-day cybersecurity disclosure rule — sits in Domain 1 under privacy and regulatory compliance but the questions read identically. Expect at least one phase-ordering question, one chain-of-custody or evidence question, and at least one breach-notification timeline question on a typical CAT exam.

## The Question Patterns That Actually Show Up

### IR phase ordering and identification

The single most common pattern. The CISSP teaches the **ISC2 seven-step lifecycle**: Detection → Response → Mitigation → Reporting → Recovery → Remediation → Lessons Learned. You will be asked which phase contains a specific activity (isolating an infected host = Mitigation; root cause analysis and patching = Remediation; updating playbooks based on findings = Lessons Learned), or which phase comes immediately before or after another. The trap is the Mitigation-vs-Remediation distinction — Mitigation is the immediate "stop the bleeding" action that removes adversarial control and isolates affected systems, while Remediation is the longer-term root-cause work that patches vulnerabilities, hardens systems, and prevents recurrence. Lessons Learned is always last.

Note that NIST SP 800-61 Rev. 2 used a different four-phase model (Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity), and SP 800-61 Rev. 3 (2025) shifted to map against NIST CSF 2.0 functions rather than discrete phases. The CISSP exam continues to test the ISC2 seven-step model. If a question references NIST language explicitly, switch to the NIST framing; otherwise default to the ISC2 model.

### Event vs. alert vs. incident vs. breach

A definitional pattern. An **event** is any observable occurrence in a system or network — they happen continuously and most are insignificant. An **alert** is a notification produced by a detection mechanism (SIEM, IDS, EDR) flagging an event for investigation. An **incident** is an event (or set of events) that violates security policy or causes harm — it has crossed the threshold from observation to consequence. A **breach** is the more severe subset of incidents in which actual loss, disclosure, or compromise of information has occurred — confidentiality, integrity, or availability has been impacted in a way that triggers regulatory reporting obligations. The trap is treating alert and incident as synonyms; an alert is a signal, an incident is a determination after triage.

### Order of volatility (RFC 3227)

A high-yield forensics topic. When collecting digital evidence, the most volatile data is collected first because it disappears fastest. The canonical RFC 3227 ordering is: CPU registers and cache; RAM and running processes; network state and routing tables; kernel statistics and modules; temporary file systems; persistent disk; remote logging and monitoring data; physical configuration and network topology; archival media. The exam tests this as a sequencing question — which goes before which — and the most reliable trap is putting disk before RAM (RAM is far more volatile).

### Chain of custody

A reliably tested topic. The chain of custody is the documented record of who handled the evidence, when, where, and for what purpose, from the moment of collection through to presentation in court. The three "C's" in the prep canon are Control (who has the evidence), Continuity (an unbroken line from collection to court), and Documentation (precise records of every transfer). Breaking the chain — gaps in documentation, evidence held by unauthorized people, missing handoff records — can render the evidence inadmissible. Forensic best practice is to work on bit-for-bit copies after hashing both the original and the copy to verify integrity.

### Evidence types and admissibility

A definitional pattern that draws on legal terminology. **Best evidence** is the original, unaltered version of a document or artifact, preferred over secondary copies. **Direct evidence** is testimony from a witness's own sensory perception (an eyewitness account). **Circumstantial evidence** infers a fact rather than proving it directly. **Documentary evidence** includes records, logs, and policies. **Corroborative evidence** supports other evidence. The **business records exception** (U.S. Federal Rule of Evidence 803(6)) allows what would otherwise be hearsay — log files, business records — to be admitted if they were made at or near the time of the event by someone with knowledge and kept in the regular course of business. For evidence to be admissible it must be relevant (related to the case), reliable (trustworthy and unaltered), and legally permissible (lawfully obtained).

### Breach notification timelines

A cross-domain pattern that draws on regulatory knowledge. **GDPR**: 72 hours from awareness, controller to supervisory authority; processor to controller "without undue delay." **HIPAA**: 60 days to affected individuals and to HHS for breaches affecting 500+ individuals; smaller breaches logged annually. **PCI-DSS**: immediate notification to card brands and the acquiring bank. **SEC** (U.S. public companies, since December 2023): 4 business days after determination of materiality (Form 8-K Item 1.05); the U.S. Attorney General can grant a delay up to 60 days for national security reasons. **U.S. state laws**: vary widely, typically 30–60 days, often phrased as "without unreasonable delay." The trap is mismatching: HIPAA's 60-day language offered for a GDPR question, or 24/48-hour distractors offered when the right answer is 72.

### Forensic process

The standard six-step process taught in CISSP material is: Identification → Preservation → Collection → Examination → Analysis → Presentation. Identification is recognizing what evidence exists. Preservation is protecting it from change (write blockers, hashing, isolation). Collection is acquiring it. Examination is technical processing (decryption, decompression, file carving). Analysis is interpretation. Presentation is reporting findings, typically in court or to leadership. The trap is reordering these — collection cannot precede preservation.

### Triage and severity classification

After detection, triage decides whether the event is an incident, what its severity is (often SEV-1 through SEV-5 or critical/high/medium/low), what its scope is, and what resources to allocate. If triage determines that the impact will exceed the Maximum Tolerable Downtime, the BCP/DR is activated and a disaster is declared. The exam tests this primarily as a sequencing topic — what triage produces and where it sits relative to declaration of disaster.

### Reporting chain

Internal first: legal, CISO, executive leadership, PR, IR team. External: law enforcement (FBI/Secret Service for federal cyber crimes; state authorities for state matters), regulators (SEC for public companies; HHS for HIPAA; payment processors and card brands for PCI), customers, and notification teams. Legal and CISO/executive review must precede external communication. The trap is "the IR team should immediately notify customers" — that bypasses required legal and executive review.

## The Trap Patterns to Inoculate Against

Six traps recur. The **Mitigation-vs-Remediation swap** is the highest-yield miss in this family — Mitigation is short-term containment, Remediation is long-term root-cause and prevention. The **Lessons Learned position** trap places it mid-sequence; it is always last. The **NIST-vs-ISC2 lifecycle** trap offers NIST language ("Containment, Eradication, Recovery") on a question that's testing the ISC2 seven-step model — read the question for which framework is named. The **HIPAA-60 vs GDPR-72** trap offers the wrong regulation's timeline. The **disk-before-RAM** trap in volatility ordering questions is reliably wrong; RAM is more volatile. The **best-evidence-equals-direct-evidence** trap conflates two independent properties — best evidence is about the form (original vs. copy), direct evidence is about the type (witness perception vs. inference).

## A Minimal Study Priority

In priority order: the ISC2 seven-step lifecycle in correct order; the Mitigation-vs-Remediation distinction; the event/alert/incident/breach definitions; the order of volatility per RFC 3227; the chain of custody and its three C's; the breach notification cheat sheet (GDPR 72, HIPAA 60, PCI immediate, SEC 4 business days); the six-step forensic process; the major evidence types (best, direct, circumstantial, documentary, corroborative, hearsay with business-records exception); the admissibility triad (relevant, reliable, legally permissible); and the internal-first reporting chain (legal, CISO, exec, PR before external).

## What Gets Less Air Time

Specific NIST publication numbers (SP 800-61, SP 800-86, SP 800-88, RFC 3227) are referenced as authoritative sources but you don't need to memorize them. The Fourth Amendment search-and-seizure framework is mentioned occasionally for law-enforcement contexts but rarely the primary subject. Specific commercial IR tools (Splunk, CrowdStrike, Mandiant) are never named. ISO 27035 is the international IR standard but does not need to be read for the exam. The MITRE ATT&CK framework is increasingly relevant in modern security operations but is currently a Tier 3 mention on the CISSP. Specific federal computer crime statutes (CFAA, ECPA) are mentioned in Domain 1 legal content but not deeply tested in the IR family.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 17 (Security Operations) is the comprehensive reference for IR. Destination Certification's Incident Response and Investigations MindMaps at https://destcert.com/resources/incident-respones-mindmap-cissp-domain-7/ and https://destcert.com/resources/investigations-mindmap-cissp-domain-7/ are the most efficient visual reviews. CISSPrep's incident management page at https://cissprep.net/incident-management-and-investigations/ is a strong free overview. NIST SP 800-61 Rev. 3 (current) replaces SP 800-61 Rev. 2 and is worth skimming for awareness of the NIST CSF 2.0 mapping, but ISC2's seven-step model remains the exam standard. RFC 3227 (Guidelines for Evidence Collection and Archiving) is the canonical source for the order of volatility. Wentz Wu's investigation/evidence series is the clearest treatment of legal evidence types from a CISSP perspective. The U.S. SEC press release on the cybersecurity disclosure rule explains the 4-business-day requirement.

Sources used to compile this README:

- [Destination Certification — Incident Response MindMap, Domain 7](https://destcert.com/resources/incident-respones-mindmap-cissp-domain-7/)
- [Destination Certification — Investigations MindMap, Domain 7](https://destcert.com/resources/investigations-mindmap-cissp-domain-7/)
- [CISSPrep — Incident Management and Investigations](https://cissprep.net/incident-management-and-investigations/)
- [Infosec Institute — CISSP Incident Management](https://www.infosecinstitute.com/resources/cissp/cissp-incident-management/)
- [Wiz Academy — CISSP Incident Response Steps](https://www.wiz.io/academy/detection-and-response/cissp-incident-response-steps)
- [Wentz Wu — Investigation, Evidence, and Forensics](https://wentzwu.com/2021/10/13/investigation-evidence-and-forensics/)
- [Wentz Wu — Legal Evidence](https://wentzwu.com/2020/12/09/legal-evidence/)
- [ThorTeaches — CISSP Evidence for Legal and Regulatory Issues](https://thorteaches.com/cissp-certification-evidence-for-legal-and-regulatory-issues/)
- [ISC2 Blog — What Are the Phases of an Incident Response Plan?](https://blog.isc2.org/isc2_blog/2021/03/what-are-the-phases-of-an-incident-response-plan.html)
- [ISC2 Community — Incident Management Steps](https://community.isc2.org/t5/CISSP-Study-Group/incident-management-steps-identified-by-ISC-2/td-p/74035)
- [RFC 3227 — Guidelines for Evidence Collection and Archiving](https://www.ietf.org/rfc/rfc3227.txt)
- [NIST SP 800-61 Rev. 3 — Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST SP 800-61 Rev. 2 (Withdrawn) — Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-61r2.pdf)
- [SWGDE — Position on MD5/SHA-1 in Forensics](https://www.swgde.org/documents/published-complete-listing/swgde-position-on-the-use-of-md5-and-sha1-hash-algorithms-in-digital-and-multimedia-forensics/)
- [SEC — Adopts Rules on Cybersecurity Disclosure (2023)](https://www.sec.gov/newsroom/press-releases/2023-139)
- [PwC — SEC Final Cybersecurity Disclosure Rules](https://www.pwc.com/us/en/services/consulting/cybersecurity-risk-regulatory/sec-final-cybersecurity-disclosure-rules.html)
- [Hawk Eye Forensic — Best Practices for Write Blockers](https://hawkeyeforensic.com/best-practices-for-using-write-blockers-in-forensic-imaging/)
- [Infosec Institute — Computer Forensics Chain of Custody](https://www.infosecinstitute.com/resources/digital-forensics/computer-forensics-chain-custody/)
- [Brian T. Carr — Order of Volatility](https://www.briancarr.org/post/order-of-volatility)
- [PagerDuty — Incident Severity Classification](https://www.pagerduty.com/resources/incident-management-response/learn/incident-severity-classification/)
- [ISMS Guy on Medium — Breach Notification Timelines](https://ismsguy.medium.com/is-breach-notification-timelines-6a579bc6117d)
