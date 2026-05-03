---
tier: 1
exam_weight: "12%"
---

# Security Testing Methodologies for the CISSP Exam

> **Tier:** 2  
> **Domain:** Security Assessment and Testing (Domain 6)  
> **Exam Weight:** ~12%  
> **Status:** Built

A study-oriented overview of the security testing question family on the CISSP. This is Domain 6 (Security Assessment and Testing), weighted at roughly 12% of the exam. Use alongside `security-testing.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 6 carries roughly 12% of the exam. The question pool centers on five high-frequency areas: the SAST/DAST/IAST/RASP testing family, the black-box/gray-box/white-box penetration testing distinction, vulnerability assessment vs. penetration testing, the SOC 1/SOC 2/SOC 3 reporting hierarchy with Type I/Type II distinction, and the audit type taxonomy (first-party, second-party, third-party). Code review types and threat-modeling cross-references appear as Tier 2 content. Specific NIST SP 800-115 phase ordering and red/blue/purple team distinctions round out the Tier 2 set.

## The Question Patterns That Actually Show Up

### SAST vs. DAST vs. IAST vs. RASP

The most predictable pattern. **SAST** (Static Application Security Testing) analyzes source code or binaries WITHOUT executing the application — a white-box approach run during development that catches coding flaws like SQL injection, hardcoded secrets, and insecure APIs early. **DAST** (Dynamic Application Security Testing) tests the RUNNING application from the outside without code access — a black-box approach that finds runtime and configuration issues SAST cannot see. **IAST** (Interactive Application Security Testing) instruments the running application with sensors that combine SAST and DAST signals — a hybrid that gives both code context and runtime behavior, with low false-positive rates. **RASP** (Runtime Application Self-Protection) is NOT a testing method — it's a runtime defense that detects and blocks attacks against a deployed application, often grouped alongside the testing methods but conceptually different.

The trap is choosing the wrong tool for the wrong SDLC phase. SAST runs early (development); DAST runs in QA before production; IAST runs alongside functional testing; RASP runs in production.

### Black-box / gray-box / white-box

A definitional pattern for penetration testing perspectives. **Black-box** assumes zero knowledge — the tester has no source code, no architecture diagrams, no credentials. Simulates an external adversary. **White-box** (also called crystal-box or clear-box) provides full disclosure: source code, architecture, credentials, infrastructure access. Most thorough but unrealistic as an attack model. **Gray-box** is the middle ground — partial knowledge, often with low-privileged credentials or limited architecture documentation. The trap is calling white-box "the most realistic" — it's the most thorough, but black-box is the most realistic adversary simulation.

### Vulnerability assessment vs. penetration testing

A definitional pattern that's tested constantly. **Vulnerability assessment** is broad and automated — uses scanners (Nessus, Qualys, OpenVAS) to identify known vulnerabilities across many systems quickly. Generates many false positives. Identifies but does not exploit. **Penetration testing** is deep and manual — exploits vulnerabilities to confirm impact, often uses a vulnerability scan as its starting point. Slower, narrower, more rigorous. A pentest CONTAINS a vulnerability assessment, but a vulnerability assessment is not a pentest. The trap is choosing one when the scenario calls for the other — emphasize the scope and the depth.

### SOC reports — SOC 1, SOC 2, SOC 3, Type I, Type II

A high-frequency definitional pattern. **SOC 1** addresses controls relevant to financial reporting (governed by SSAE 18). Used by service organizations whose services affect customer financial statements. **SOC 2** addresses controls over the AICPA Trust Services Criteria — Security (mandatory), Availability, Processing Integrity, Confidentiality, Privacy. The standard report for cloud and SaaS security audits. **SOC 3** is a public-facing redacted summary of a SOC 2 report, suitable for marketing.

Within SOC 1 and SOC 2, the Type distinction matters. **Type I** evaluates the DESIGN of controls at a specific point in time — does the system have the right controls in place on this date? **Type II** evaluates the OPERATING EFFECTIVENESS of controls over a period (typically 6–12 months) — did the controls actually work consistently? Type II is more rigorous and more commonly required.

The trap is mismatching Type I (point in time) with Type II (over a period), or selecting SOC 1 when the question is about cloud security (that's SOC 2).

### NIST SP 800-115 penetration testing phases

A sequencing pattern. NIST SP 800-115 defines four primary phases: (1) **Planning** (rules of engagement, scope, authorization), (2) **Discovery** (reconnaissance and scanning), (3) **Attack** (gaining access, escalating, maintaining), (4) **Reporting** (findings, recommendations, evidence). Older NIST and EC-Council frameworks sometimes phrase phases differently — Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks. Both phrasings appear in CISSP material. The trap is misordering the phases or skipping planning.

### Code review types

A Tier 2 pattern. **Fagan inspection** is the formal six-step process (Planning, Overview, Preparation, Inspection Meeting, Rework, Follow-up); slow but high-defect-detection (60–65%). **Walkthrough** is structured but informal — the author leads reviewers through the code. **Peer review** is the casual modern equivalent — pull request review, over-the-shoulder, tool-assisted. **Pair programming** is real-time review during development. The trap is selecting peer review when the question emphasizes "highest defect detection" — Fagan inspection is the most rigorous.

### Audit type taxonomy

A definitional pattern. **First-party (internal)** audits are conducted by the organization's own audit team — comprehensive but lacks independence. **Second-party (external)** audits are conducted by a customer or contracting partner exercising audit rights — supply chain audits. **Third-party (external)** audits are conducted by independent auditors with no relationship to the auditee — Big Four firms, certified bodies, government regulators. Required for most certifications (ISO 27001, SOC 2). The trap is conflating first-party with internal IT audits — internal audit is a specific function, not all internal review is "first-party audit" in the formal sense.

### Red team, blue team, purple team

A Tier 2 definitional pattern. **Red team** is the offensive side — simulates attacks against the organization to test defenses. **Blue team** is the defensive side — monitors, detects, and responds. **Purple team** is a collaborative hybrid — red and blue work together rather than competitively, sharing techniques and findings to improve overall posture. The trap is treating purple team as a separate entity rather than a collaborative engagement model.

### Continuous monitoring and SIEM

A topical pattern. **Continuous monitoring** is the discipline of ongoing assessment of control effectiveness against evolving threats — required by most modern compliance frameworks. **SIEM** (Security Information and Event Management) is the technology platform that aggregates, normalizes, correlates, and analyzes log data from across the organization to support continuous monitoring. SIEM is part of continuous monitoring; not a replacement for it.

## The Trap Patterns to Inoculate Against

Five traps recur. The **SAST-DAST-by-SDLC-phase swap** is the highest-yield miss — SAST is for early development (source code), DAST is for QA/pre-production (running app). The **vulnerability-assessment-vs-pentest swap** appears whenever the scenario emphasizes scope vs. depth — broad scan = VA, deep exploit = pentest. The **SOC-Type-I-vs-Type-II swap** appears in scenarios that mention point-in-time (Type I) or over-a-period (Type II). The **white-box-as-most-realistic** distractor confuses thoroughness with realism — black-box is the most realistic adversary simulation. The **RASP-as-testing-method** distractor groups RASP with SAST/DAST/IAST when it is actually a runtime defense, not a testing method.

## A Minimal Study Priority

In priority order: SAST/DAST/IAST/RASP definitions and SDLC placement; the black-box/gray-box/white-box distinction; vulnerability assessment vs. penetration testing scope and depth; SOC 1/SOC 2/SOC 3 distinctions and Type I/Type II; NIST SP 800-115 pentest phases in order; code review types (Fagan vs. peer review vs. walkthrough vs. pair programming) and which finds the most defects; the first-party/second-party/third-party audit taxonomy; red/blue/purple team distinctions; continuous monitoring as discipline vs. SIEM as technology; and the AICPA Trust Services Criteria for SOC 2 (Security mandatory, Availability, Processing Integrity, Confidentiality, Privacy).

## What Gets Less Air Time

Specific commercial scanning products (Nessus, Qualys, Rapid7, Burp Suite) are never named on the exam. The internals of fuzzing algorithms (mutation strategies, generation grammars) are not deeply tested. Specific NIST publication numbers are referenced but not asked. The byzantine details of SOC report appendices and the SSAE 18 procedural requirements are not deeply tested. The exact composition of the Trust Services Criteria categories (16 individual criteria) is not asked at the criterion level. Synthetic transactions, breach-and-attack simulation tools, and specific exercise frameworks (TIBER-EU, CBEST) appear as Tier 3 mentions only.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 15 is the comprehensive reference. NIST SP 800-115 (Technical Guide to Information Security Testing and Assessment) is the authoritative source for the pentest phase model. NIST SP 800-53A is the authoritative source for control assessment. The AICPA's SOC 2 description at https://www.aicpa-cima.com/ is the authoritative source for the SOC reporting framework. Destination Certification's Domain 6 collection at https://destcert.com/resources/cissp-domain-6-security-assessment-and-testing/ is the most efficient visual review and includes the SAST/DAST comparison and the pentest phase ordering. CISSPrep's Domain 6 series at https://cissprep.net/domain-6-security-assessment-and-testing/ is a strong free overview. The OWASP Testing Guide is the authoritative source for application security testing methodology.

Sources used to compile this README:

- [NIST SP 800-115 — Technical Guide to Information Security Testing and Assessment](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)
- [Destination Certification — CISSP Domain 6 Overview](https://destcert.com/resources/cissp-domain-6-security-assessment-and-testing/)
- [Destination Certification — Vulnerability Assessment and Penetration Testing MindMap](https://destcert.com/resources/vulnerability-assessment-and-penetration-testing-mindmap-cissp-domain-6/)
- [Destination Certification — Logging and Monitoring MindMap](https://destcert.com/resources/logging-monitoring-mindmap-cissp-domain-6/)
- [Destination Certification — Threat Modeling Methodologies](https://destcert.com/resources/threat-modeling-methodologies/)
- [CISSPrep — Domain 6 Overview](https://cissprep.net/domain-6-security-assessment-and-testing/)
- [CISSPrep — SOC Audits and Report Types](https://cissprep.net/soc-audits-and-report-types/)
- [CISSPrep — Audits and Assessments](https://cissprep.net/audits-and-assessments/)
- [CISSPrep — Audit Logging and Monitoring](https://cissprep.net/audit-logging-and-monitoring/)
- [Imperva — SAST, IAST, DAST](https://www.imperva.com/learn/application-security/sast-iast-dast/)
- [Snyk — SAST vs DAST vs IAST vs RASP](https://snyk.io/articles/sast-dast-iast-rasp/)
- [CircleCI — SAST vs DAST](https://circleci.com/blog/sast-vs-dast-when-to-use-them/)
- [Contrast Security — DevSecOps Glossary](https://www.contrastsecurity.com/glossary/devsecops)
- [Packet Labs — Black-Box vs Gray-Box vs White-Box Testing](https://www.packetlabs.net/posts/types-of-penetration-testing/)
- [RSI Security — NIST 800-115 Penetration Testing Recommendations](https://blog.rsisecurity.com/nists-penetration-testing-recommendations-explained/)
- [Getastra — Vulnerability Assessment vs Penetration Testing](https://www.getastra.com/blog/security-audit/vulnerability-assessment-vs-penetration-testing/)
- [Hack The Box — Vulnerability Assessments vs Pentesting](https://www.hackthebox.com/blog/vulnerability-assessments-vs-pentesting)
- [Schellman — SOC 2 vs SOC 3](https://www.schellman.com/blog/soc-examinations/)
- [Palo Alto Networks — SCA (Software Composition Analysis)](https://www.paloaltonetworks.com/cyberpedia/what-is-sca)
- [Wikipedia — Fagan Inspection](https://en.wikipedia.org/wiki/Fagan_inspection)
- [TechTarget — Red vs Blue vs Purple Team](https://www.techtarget.com/searchsecurity/tip/Red-team-vs-blue-team-vs-purple-team-Whats-the-difference)
- [Rapid7 — Purple Team](https://www.rapid7.com/fundamentals/what-is-a-purple-team/)
- [Wentz Wu — Security Assessment, Audit, and Testing](https://wentzwu.com/2019/09/14/security-assessment-audit-and-testing/)
- [Wentz Wu — Internal, External, and Third-Party Testing](https://wentzwu.com/2021/04/20/internal-external-and-third-party-testing/)
- [Smithers — First-Party, Second-Party, Third-Party Audits](https://www.smithers.com/resources/2024/june/first-party-second-party-third-party-audits)
