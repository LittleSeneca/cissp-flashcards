---
tier: 3
domain: Security and Risk Management (Domain 1)
exam_weight: ~3-5% within Domain 1
status: built
---

# Personnel Security for the CISSP Exam

A study-oriented overview of the personnel security question family on the CISSP. Personnel security lives in Domain 1 (Security and Risk Management) under "Contribute to and enforce personnel security policies and procedures." Use alongside `personnel-security.tsv` in this folder.

## Where This Family Sits in the Exam

Personnel security is a smaller portion of Domain 1 than risk management, BCP, or governance, but it appears reliably on the exam — typically two or three questions on a CAT exam. The high-frequency content centers on the separation-of-duties / job-rotation / mandatory-vacation triad, termination procedures (especially the friendly-vs-hostile distinction), the security purpose of pre-employment background checks and NDAs, and the ISC2 Code of Ethics. The 2024 outline explicitly emphasizes coverage of vendor and contractor personnel and ongoing security awareness training.

## The Question Patterns That Actually Show Up

### Separation of duties vs. job rotation vs. mandatory vacation

The single most predictable pattern in this family. These three controls are conceptually adjacent but distinct, and exam writers love to ask which control fits a given scenario. **Separation of duties** divides a single critical task across multiple people simultaneously — the person who initiates a wire transfer cannot also approve it; the person who codes a deployment cannot also push to production. Prevents fraud and unilateral action. **Job rotation** moves one person through different roles over time — disrupts collusion opportunities, surfaces fraud hidden in normal workflows, and builds organizational resilience by spreading critical knowledge. **Mandatory vacation** forces an employee to take time off so a peer can review their work and pending transactions; the security purpose is detection of fraud, not employee wellness. The trap is treating these as interchangeable when each addresses a different threat vector.

### Friendly vs. hostile termination

A reliably tested scenario pattern. **Friendly termination** is voluntary departure (resignation, retirement) or amicable involuntary departure (layoff, end-of-contract); IT and HR coordinate access removal, equipment recovery, and an exit interview, typically over a planned timeline. **Hostile termination** is high-risk (disgruntled employee, security or compliance violation, fraud or theft suspected); requires legal/HR/security pre-coordination, simultaneous credential revocation across all systems before the meeting begins, security personnel present for the termination meeting, immediate equipment recovery under supervision, and rotation of any shared secrets the employee knew. The trap is treating termination as an IT-only activity — it requires HR, legal, security, and facilities working together.

### Background checks and pre-employment due diligence

A definitional pattern. Standard background checks include criminal history, employment history verification, education verification, professional reference checks, and identity verification. Credit checks are common for high-trust roles (financial roles, security investigators, certain executives). Drug screening varies by jurisdiction and policy. Social media review is increasingly common but legally constrained. Polygraph use is rare and restricted by federal law (limited to specific roles in specific industries). For roles requiring U.S. government clearance, the background investigation is far more extensive — current employment, residences, foreign contacts, financial history, character references — and tied to the clearance level requested.

### NDAs and pre-employment documentation

A definitional pattern. Before access to non-public information, employees sign **Non-Disclosure Agreements (NDAs)** committing them to confidentiality. Other pre-employment documents include security policy acknowledgments, acceptable use policies, code of conduct attestations, and employment agreements. Vendors and contractors sign equivalent agreements (NDAs, Master Services Agreements with security clauses, often background-check requirements via the contracting party). The NDA must be in place before any sensitive information is shared — not after.

### Security awareness training

A topical pattern. Annual general awareness training is mandatory for all personnel; **role-based training** provides additional content for specific high-risk functions (developers learn secure coding, finance learns wire-transfer fraud, executives learn social engineering and travel security). Training effectiveness is measured through metrics — phishing simulation click rates and report rates, incident reduction, attestation completion rates. The exam emphasizes that training is a continuous program, not an annual checkbox, and that role-based training is required for high-risk roles.

### Insider threat

A growing topical area. Insider threats are categorized as **unintentional** (negligent or careless behavior — clicking phishing links, sending data to the wrong recipient, mishandling sensitive information) or **malicious** (deliberate harm — fraud, theft, sabotage). Behavioral indicators include working unusual hours, attempting to access data outside their role, financial distress, expressed disgruntlement, and policy violations. Detection technologies include UEBA (User and Entity Behavior Analytics), DLP, and audit log correlation. The trap is treating insider threats as only malicious — unintentional insiders cause significant losses and require different controls (training, technical safeguards, communication).

### Privileged user requirements

A specific high-frequency point. Privileged users (administrators, root account holders, security operators, executives with broad access) require enhanced controls beyond standard employees: deeper background checks (credit, criminal, sometimes clearance), separate privileged accounts (not used for daily work), enrollment in PAM (Privileged Access Management) systems with session recording, more frequent recertification, additional security training. The principle is that the consequences of compromise scale with privilege level, so the controls must too.

### ISC2 Code of Ethics

A near-certain question for ISC2 candidates. The four canons in order: (I) Protect society, the common good, necessary public trust and confidence, and the infrastructure; (II) Act honorably, honestly, justly, responsibly, and legally; (III) Provide diligent and competent service to principals; (IV) Advance and protect the profession. The order matters — when canons conflict, earlier canons take precedence. Violations are reported to ISC2 and can result in certification revocation. The exam tests both the canons themselves and the ordering.

### Vendor / contractor / third-party personnel

A topical pattern emphasized in the 2024 outline. Vendor personnel must meet the hiring organization's security expectations — background checks, NDAs, training requirements, access reviews — typically enforced through contractual security clauses and a Vendor Security Agreement. Independent verification of vendor-provided clearances is required (do not assume the staffing agency or subcontractor has verified). Periodic access reviews and offboarding procedures apply equally to contractors. Acquisition (M&A) personnel security adds another layer — newly acquired employees may need re-baselined background checks and re-provisioning into the acquiring organization's systems.

### Security clearances (US government context)

A Tier 3 topical area. The U.S. clearance levels are **Confidential** (15-year reinvestigation), **Secret** (10-year reinvestigation), **Top Secret** (5-year reinvestigation), with **SCI (Sensitive Compartmented Information)** as an add-on designation rather than a standalone level. TS/SCI is "Top Secret with SCI eligibility." Clearances are sponsored by an employer with a need; they are not personal credentials. Continuous evaluation has replaced periodic reinvestigation in many cases.

## The Trap Patterns to Inoculate Against

Five traps recur. The **separation-of-duties-vs-job-rotation** swap is the highest-yield miss in this family — read for whether the scenario describes splitting a single task (SoD) or moving a person through multiple roles over time (rotation). The **mandatory-vacation-as-wellness-benefit** trap fails because the security purpose is fraud detection, not employee wellbeing. The **termination-is-IT-only** trap fails because effective termination requires HR, legal, security, and facilities coordination. The **insider-threat-equals-malicious** trap fails because unintentional insiders cause significant losses and require different controls. The **NDA-after-the-fact** trap fails because NDAs must be signed before sensitive information is shared, not after.

## A Minimal Study Priority

In priority order: separation of duties, job rotation, and mandatory vacation with one-line distinctions and the threat each addresses; the friendly-vs-hostile termination distinction with procedural differences; standard background check elements and which roles require enhanced screening; the NDA's role and timing in pre-employment; the ISC2 Code of Ethics canons in order; security awareness training as a continuous program with role-based components; the unintentional vs. malicious insider threat distinction; privileged user enhanced controls (separate accounts, PAM, more frequent recertification); vendor and contractor personnel security through contractual security clauses; and U.S. clearance levels and reinvestigation cycles.

## What Gets Less Air Time

Specific federal background check forms (SF-86) are not asked. The detailed contents of an exit interview are not tested. Specific PAM products (CyberArk, BeyondTrust) are never named. Polygraph procedure details are not tested. Specific union contract language is not in scope. Detailed M&A integration timelines are not tested. The HR-side details of progressive discipline are referenced but not deeply tested.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 2 is the comprehensive reference. The ISC2 Code of Ethics at https://www.isc2.org/ethics is the authoritative source for the canons. Destination Certification's personnel security material at https://destcert.com/resources/personnel-security-controls/ is the most efficient visual review. CISSPrep's Personnel Security page at https://cissprep.net/personnel-security/ is a strong free overview. CISA's insider threat resources at https://www.cisa.gov/topics/physical-security/insider-threat-mitigation are the authoritative source for insider threat indicators. NIST SP 800-181 (NICE Workforce Framework) is referenced for cybersecurity role definitions.

Sources used to compile this README:

- [ISC2 — Code of Ethics](https://www.isc2.org/ethics)
- [Destination Certification — Personnel Security Controls](https://destcert.com/resources/personnel-security-controls/)
- [CISSPrep — Personnel Security](https://cissprep.net/personnel-security/)
- [Info-Savvy — CISSP Candidate Screening and Hiring](https://info-savvy.com/cissp-candidate-screening-and-hiring-bk1d1t1st2/)
- [Info-Savvy — CISSP Onboarding and Termination Processes](https://info-savvy.com/cissp-onboarding-and-termination-processes-bk1d1t8st3/)
- [Info-Savvy — CISSP Personnel Security Policies](https://info-savvy.com/cissp-personnel-security-policies-and-procedures-bk2d1t7)
- [Info-Savvy — CISSP Vendor and Third-Party Controls](https://info-savvy.com/cissp-vendor-consultant-and-contractor-agreements-and-controls-bk1d1t8st4/)
- [TrustEd Institute — Job Rotation and Separation of Duties](https://trustedinstitute.com/concept/cissp/personnel-security/job-rotation-separation-of-duties/)
- [TrustEd Institute — Background Checks](https://trustedinstitute.com/concept/cissp/personnel-security/background-checks/)
- [Threat on the Wire — CISSP Insider Threat Lifecycle](https://www.threatonthewire.com/cissp-insider-threat-lifecycle-personnel-security/)
- [Study Notes and Theory — Job Rotation and Mandatory Vacation](https://www.studynotesandtheory.com/single-post/cissp-study-plan-day-16-job-rotation-mandatory-vacation)
- [Training Camp — Mandatory Vacation](https://trainingcamp.com/glossary/mandatory-vacation/)
- [Endsight — IT Security for Employee Termination](https://www.endsight.net/blog/it-security-employee-termination)
- [NIST SP 800-53 PS-4 — Personnel Termination](https://csf.tools/reference/nist-sp-800-53/r5/ps/ps-4/)
- [Hoxhunt — Security Awareness Training Metrics](https://hoxhunt.com/guide/security-awareness-training)
- [SANS — Phishing Awareness Training Solutions](https://www.sans.org/security-awareness-training/products/security-awareness-solutions/phishing/)
- [CISA — Detecting and Identifying Insider Threats](https://www.cisa.gov/topics/physical-security/insider-threat-mitigation/detecting-and-identifying-insider-threats)
- [CISA — Defining Insider Threats](https://www.cisa.gov/topics/physical-security/insider-threat-mitigation/defining-insider-threats)
- [Infosec Institute — ISC2 Code of Ethics](https://www.infosecinstitute.com/resources/cissp/the-isc2-code-of-ethics-a-binding-requirement-for-certification/)
- [ThorTeaches — ISC2 Code of Ethics](https://thorteaches.com/cissp-codeofethics/)
- [ClearedJobs — Security Clearance Levels Explained](https://clearedjobs.net/resources/levels-security-clearance-confidential-secret-top-secret-explained/)
