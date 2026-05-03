---
tier: 3
exam_weight: "~5-7% within Domain 1"
---

# Security Governance & Compliance Frameworks for the CISSP Exam


A study-oriented overview of the governance and compliance question family on the CISSP. This material lives in Domain 1 (Security and Risk Management) and is foundational connective tissue for the rest of the exam — frameworks like NIST CSF, NIST RMF, ISO 27001, and COBIT show up in scenario and definitional questions across multiple domains. Use alongside `governance-and-compliance.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 1 carries roughly 16% of the exam, and within Domain 1 the governance and compliance content is one of the larger sub-areas. The high-frequency content centers on the policy hierarchy (Policy / Standard / Baseline / Procedure / Guideline), the NIST Cybersecurity Framework functions, the NIST Risk Management Framework steps, the ISO 27001 vs. ISO 27002 distinction, the COBIT governance-vs-management framing, the major U.S. regulations (SOX, HIPAA, GLBA, FERPA, PCI-DSS, FISMA), and the due care vs. due diligence distinction. Expect at least two or three questions on this material on a CAT exam.

## The Question Patterns That Actually Show Up

### The policy hierarchy

The single most predictable pattern. The five document types form a hierarchy from high-level to detailed. **Policy** is the high-level mandatory direction from senior leadership — "We will protect customer data." **Standard** is the mandatory technical specification that implements policy — "Customer data must be encrypted with AES-256 in transit and at rest." **Baseline** is the minimum acceptable configuration for a system class — "All Linux servers shall use the CIS Level 1 hardening baseline." **Procedure** is the step-by-step how-to — "To enable disk encryption on a Linux server, run these commands in order." **Guideline** is recommended practice that is advisory rather than mandatory — "Consider using ed25519 SSH keys for new deployments." The trap is conflating policy with standard (policy is "what," standard is "how") or treating guidelines as mandatory.

### NIST Cybersecurity Framework (CSF)

A high-frequency framework pattern. CSF 1.1 (2018) had five functions: **Identify, Protect, Detect, Respond, Recover**. CSF 2.0 (released February 2024) added **Govern** as a sixth function — central, informing the other five. The 2024 CISSP outline emphasizes CSF 2.0. Within each function, categories and subcategories provide more granular outcomes. Tiers (1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive) describe the rigor of an organization's risk practices — they are NOT a maturity model and Tier 4 is not the goal for every organization. Profiles map current state and target state. The trap is treating Tiers as universally desirable maturity targets.

### NIST Risk Management Framework (RMF)

A sequencing pattern. NIST SP 800-37 Rev. 2 defines seven steps: **Prepare** (added in Rev. 2), **Categorize** (FIPS 199 impact level), **Select** (NIST SP 800-53 controls), **Implement**, **Assess** (NIST SP 800-53A), **Authorize** (ATO from authorizing official), **Monitor** (continuous). The Prepare step happens once at the organizational level and once at the system level. Steps 2–7 cycle. The trap is misordering the steps or omitting Prepare.

### ISO 27001 vs. ISO 27002

A definitional pattern. **ISO 27001** is the certifiable standard that specifies requirements for an Information Security Management System (ISMS) — what an ISMS must do. Includes Annex A with 93 control objectives (down from 114 in the 2022 revision through consolidation). Organizations can achieve formal third-party certification against 27001. **ISO 27002** is implementation guidance — how to implement the controls in 27001's Annex A. NOT certifiable. Both are part of the ISO 27000 series, which also includes 27005 (risk management), 27017 (cloud security), 27018 (PII in public clouds), and 27701 (privacy management). The trap is treating 27002 as certifiable or treating 27001 as just a list of controls (it's an ISMS standard).

### COBIT

A governance framework with a specific framing. COBIT 2019 separates **Governance** (Evaluate, Direct, Monitor — what the board and executive leadership do) from **Management** (Plan, Build, Run, Monitor — what the operational organization does). Five governance objectives in the EDM domain; thirty-five management objectives in the APO/BAI/DSS/MEA domains. Six governance principles. Used by audit committees and CIO functions. The trap is treating COBIT as an information security framework rather than an IT governance framework.

### Due care vs. due diligence

A high-yield definitional pattern. **Due diligence** is investigation, planning, and homework — understanding what should be done. Top-down. Establishes risk assessments, plans, policies, standards, compliance posture. Precedes due care. **Due care** is implementation — doing what reasonable, prudent organizations would do. Bottom-up execution of the plan due diligence produced. Both are required for liability defense; the failure mode is doing the plan but not the execution, or implementing controls without underlying analysis. The trap is reversing the two — diligence is planning, care is doing.

### Major regulations and their scope

A definitional pattern that shows up constantly. **SOX (Sarbanes-Oxley Act)** governs financial reporting controls for U.S. publicly traded companies — Section 302 (CEO/CFO certification of financial statements) and Section 404 (annual internal control assessment). NOT a general security mandate. **GLBA (Gramm-Leach-Bliley Act)** governs financial institutions on the protection and disclosure of non-public consumer financial information. **HIPAA** governs healthcare providers, health plans, and clearinghouses (covered entities) plus their business associates on PHI. **FERPA** governs schools receiving federal funding on student education records — NOT healthcare data. **PCI-DSS** governs organizations processing, storing, or transmitting payment card data — a contractual requirement from the card networks, not a law. **FISMA** governs U.S. federal agencies and their contractors on federal information systems. **FedRAMP** standardizes cloud-service authorization for federal use. **CMMC** governs DoD defense contractors via maturity-based certification. The trap is mismatching regulation to context — "SOX requires encryption" is wrong; SOX is financial controls.

### Senior management role and tone at the top

A definitional pattern. Senior leadership (board, CEO, CISO, CIO, CFO) is ultimately accountable for security. **Tone at the top** refers to leadership's demonstrated commitment to security — what gets resourced, what gets enforced, what's said publicly and privately. When breaches go to litigation, the first question is "what did leadership know and what did they do?" Boards have specific cyber duties under SOX, SEC disclosure rules, and various regulator expectations. The trap is treating cybersecurity as an IT function with no board-level accountability.

### SLA, OLA, MOU/MOA

A definitional pattern. **SLA (Service Level Agreement)** is a formal external contract between a service provider and customer — uptime guarantees, response time commitments, performance metrics, financial remedies for breach. Customer-facing. **OLA (Operational Level Agreement)** is an internal agreement between teams within the same organization that defines how they'll support SLA delivery — typically more technical and operational than customer-facing. **MOU/MOA (Memorandum of Understanding / Agreement)** is a less formal documented agreement, often used for partnerships and non-contractual cooperation, less legally binding than an SLA. The trap is using SLA where OLA fits or vice versa.

### COSO and ERM frameworks

A Tier 2-3 pattern. **COSO Internal Control - Integrated Framework** (1992, updated 2013) defines five components of internal control: Control Environment, Risk Assessment, Control Activities, Information & Communication, Monitoring. Used as the basis for SOX Section 404 compliance. **COSO ERM** (2017 update) extends this to enterprise risk management.

## The Trap Patterns to Inoculate Against

Six traps recur. The **policy-vs-standard swap** is the highest-yield miss in this family — policy says "what" (mandatory direction); standard says "how" (mandatory technical implementation). The **NIST-CSF-tier-as-maturity** trap fails because Tiers describe risk-practice rigor, not a maturity ladder where everyone should be Tier 4. The **NIST-RMF-step-misordering** trap fails when candidates omit Prepare or scramble the order. The **ISO-27002-as-certifiable** trap fails because only 27001 is certifiable; 27002 is implementation guidance. The **SOX-as-general-security-mandate** trap fails because SOX governs financial reporting controls, not general security. The **due-diligence-vs-due-care** swap fails when candidates reverse the timeline — diligence (planning) precedes care (doing).

## A Minimal Study Priority

In priority order: the policy hierarchy and document types (Policy, Standard, Baseline, Procedure, Guideline); NIST CSF functions in CSF 2.0 (with Govern added); NIST RMF seven-step lifecycle with Prepare; ISO 27001 vs. 27002 distinction; due care vs. due diligence with the planning-vs-doing axis; the major regulations (SOX, HIPAA, GLBA, FERPA, PCI-DSS, FISMA, FedRAMP) and what each governs; senior management accountability and tone at the top; SLA vs. OLA vs. MOU/MOA; COBIT governance vs. management; and FIPS 199 impact levels.

## What Gets Less Air Time

Specific control numbers within NIST SP 800-53 (AC-2, SC-7, etc.) are not memorized for the exam. The full text of any regulation is not asked. ITIL/IT4IT process internals are not deeply tested. Specific COSO ERM components are referenced but not deeply tested at the component-name level. International privacy laws beyond GDPR (PIPEDA, LGPD, PIPL, POPIA) appear as recognition only. NERC CIP, FFIEC, and TSA pipeline rules appear as Tier 3 mentions. The procedural details of obtaining ISO 27001 certification are not tested.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapters 1 and 2 are the comprehensive references. NIST CSWP.29 (CSF 2.0) at https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf is the authoritative source for CSF 2.0. NIST SP 800-37 Rev. 2 at https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf is the authoritative source for the RMF. ISO/IEC 27001:2022 and ISO/IEC 27002:2022 are the authoritative sources for the ISMS standard. ISACA's COBIT 2019 documentation is the authoritative source for COBIT. Destination Certification's policy-hierarchy material at https://destcert.com/resources/security-policies-standards-procedures/ is the most efficient visual review. CISSPrep's policy hierarchy page at https://cissprep.net/policy-standards-procedures-guidelines/ is a clean walkthrough.

Sources used to compile this README:

- [NIST CSWP.29 — Cybersecurity Framework 2.0](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf)
- [NIST SP.1299 — CSF 2.0 Resource Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1299.pdf)
- [NIST SP 800-37 Rev. 2 — Risk Management Framework](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf)
- [Destination Certification — Domain 1 Security and Risk Management](https://destcert.com/resources/domain-1-security-and-risk-management/)
- [Destination Certification — Policy Hierarchy](https://destcert.com/resources/security-policies-standards-procedures/)
- [Infosec Institute — Security Policies, Standards, Procedures, Guidelines](https://www.infosecinstitute.com/resources/cissp/cissp-prep-security-policies-standards-procedures-guidelines/)
- [Infosec Train — CISSP Domain 1 Key Concepts](https://www.infosectrain.com/blog/cissp-domain-1-series-key-concepts-security-policy-standards-procedures-baseline-and-guidelines/)
- [CISSPrep — Policy, Standards, Procedures, Guidelines](https://cissprep.net/policy-standards-procedures-guidelines/)
- [Arctic Wolf — NIST CSF 2.0 Govern Function](https://arcticwolf.com/resources/blog/nist-csf-2-0-understanding-and-implementing-the-govern-function/)
- [MetricStream — NIST CSF Maturity Levels](https://www.metricstream.com/learn/nist-csf-maturity-levels.html)
- [IPKeys — RMF Steps](https://ipkeys.com/blog/rmf-steps/)
- [6Clicks — Understanding the NIST RMF](https://www.6clicks.com/resources/blog/understanding-the-nist-rmf-breaking-down-the-7-key-steps/)
- [Secureframe — ISO 27001 vs ISO 27002](https://secureframe.com/hub/iso-27001/vs-iso-27002)
- [ISMS.online — ISO 27001 Annex A 2022](https://www.isms.online/iso-27001/annex-a-2022/)
- [Advisera — ISO 27001 vs ISO 27002](https://advisera.com/27001academy/knowledgebase/iso-27001-vs-iso-27002/)
- [ISACA — COBIT 2019 Resources](https://www.isaca.org/resources/cobit)
- [Sharetru — Compliance Regulations Overview](https://www.sharetru.com/blog/regulatory-compliance-with-hipaa-sox-and-glba)
- [Schellman — FedRAMP vs FISMA](https://www.schellman.com/blog/federal-compliance/fedramp-vs-fisma)
- [Secureframe — FedRAMP vs CMMC](https://secureframe.com/hub/fedramp/vs-cmmc)
- [Infosec Institute — Due Care vs Due Diligence](https://www.infosecinstitute.com/resources/cissp/due-care-vs-due-diligence-cissp/)
- [Wentz Wu — Due Diligence and Due Care](https://wentzwu.com/2019/10/08/due-diligence-and-due-care-part-1/)
- [ThorTeaches — Liability, Due Diligence, and Negligence](https://thorteaches.com/cissp-liability-due-diligence-and-negligence/)
- [ConnectWise — SLA vs OLA](https://www.connectwise.com/blog/sla-vs-ola)
- [COSO — ERM Framework](https://www.coso.org/erm-framework)
