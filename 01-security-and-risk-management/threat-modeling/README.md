---
tier: 2
exam_weight: "16%"
---

# Threat Modeling for the CISSP Exam

> **Tier:** 2  
> **Domain:** Security and Risk Management (Domain 1) + Security Architecture and Engineering (Domain 3) + Software Development Security (Domain 8)  
> **Exam Weight:** cross-cutting (~5-8% effective)  
> **Status:** Built

A study-oriented overview of the threat modeling question family on the CISSP. Threat modeling is a cross-cutting topic — it appears in Domain 1 (under risk management and threat identification), Domain 3 (under secure design), and Domain 8 (under secure software development). Use alongside `threat-modeling.tsv` in this folder.

## Where This Family Sits in the Exam

Threat modeling does not have its own domain weighting because it spans Domains 1, 3, and 8. In aggregate it likely accounts for 5–8% of exam content — a meaningful fraction even though no single domain owns it. The high-frequency content centers on three frameworks: **STRIDE** (the Microsoft-originated software-centric threat categorization), **DREAD** (the deprecated-but-still-tested risk-rating method that pairs with STRIDE), and **PASTA** (the seven-stage risk-centric methodology). The Lockheed Martin Cyber Kill Chain and MITRE ATT&CK round out the kill-chain side. Attack trees and the Diamond Model show up as Tier 2 mentions. Trike, VAST, and NIST SP 800-154 appear at Tier 3.

The single most important framing point on the exam: threat modeling belongs in the **design phase** of the SDLC, before code is written. This is the foundational rule — getting threat modeling wrong on timing is a high-yield miss.

## The Question Patterns That Actually Show Up

### STRIDE category mapping

The most predictable pattern. STRIDE expands as Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Each category corresponds to the violation of a security property: Spoofing violates **authentication**; Tampering violates **integrity**; Repudiation violates **non-repudiation**; Information Disclosure violates **confidentiality**; Denial of Service violates **availability**; Elevation of Privilege violates **authorization**. Questions give you a scenario describing a threat and ask which STRIDE category applies — the trap is mapping to the wrong property. Memorize the six-to-six mapping cleanly.

### DREAD scoring

DREAD expands as Damage potential, Reproducibility, Exploitability, Affected users, Discoverability. Each dimension is scored on a scale (typically 1–10), and the total prioritizes threats. DREAD is paired with STRIDE — STRIDE identifies, DREAD ranks. Important context: **Microsoft has deprecated DREAD internally** because the scoring is subjective and not consistently meaningful across raters. The CISSP exam still teaches it as a recognition topic, so know the expansion and the role.

### PASTA's seven stages

PASTA is the **Process for Attack Simulation and Threat Analysis** — a risk-centric methodology that aligns threat modeling with business objectives. The seven stages, in order, are: (1) Define Objectives (business objectives and impact criteria), (2) Define Technical Scope (system boundaries, components, dependencies), (3) Application Decomposition (data flows, trust boundaries, assets), (4) Threat Analysis (custom threat library), (5) Vulnerability/Weakness Analysis (mapping to assets), (6) Attack Modeling (paths and trees), (7) Risk and Impact Analysis (prioritization and recommendations). The trap is offering five or six stages, or reordering them. Memorize the order; it's a sequencing question.

### The Lockheed Martin Cyber Kill Chain

Seven phases, in strict order: **Reconnaissance** (target research), **Weaponization** (creating the deliverable malware/exploit), **Delivery** (transmitting it via email, USB, web, etc.), **Exploitation** (the malicious code executes), **Installation** (persistence mechanism — backdoor, malware), **Command and Control** (C2 channel established), **Actions on Objectives** (the attacker achieves the goal — data exfiltration, encryption, etc.). The model is sequential — earlier phases must complete before later ones — and is attack-centric, focused on external intrusions. The trap is reordering or treating the phases as parallel.

### MITRE ATT&CK vs. the Kill Chain

A comparison pattern. The Kill Chain is sequential and pre-compromise-heavy; ATT&CK is non-sequential and post-compromise-heavy. ATT&CK organizes adversary behavior into **tactics** (the strategic goal — execution, persistence, privilege escalation, lateral movement, etc.) and **techniques** (the methods used to achieve each tactic). It catalogs hundreds of techniques observed in real-world attacks. ATT&CK is more granular and operational; the Kill Chain is conceptual. Both are tested as recognition; the trap is treating ATT&CK as a sequence (it isn't — the same technique can serve multiple tactics).

### Attack trees

Hierarchical decompositions of an attack goal into subgoals and methods. Originated by Bruce Schneier. The root node is the attack objective; child nodes are subgoals or methods to achieve the parent; AND/OR gates determine logical relationships. Used as an analysis tool, often within PASTA stage 6 (Attack Modeling). A concept-level Tier 2 mention.

### The Diamond Model

Frames an intrusion as relationships between four vertices: **Adversary**, **Capability**, **Infrastructure**, and **Victim**. Emphasizes relational analysis over sequential phases. Useful for connecting observations across multiple incidents to identify the same threat actor. Tier 2 mention; usually appears as a recognition question.

### Threat modeling vs. risk assessment

A definitional pattern. Threat modeling is upstream and design-focused — identifying threats early so they can be mitigated through design choices. Risk assessment is broader and ongoing — evaluating likelihood and impact of identified risks across the organization. Threat modeling produces inputs that feed into risk assessment. The trap is treating them as interchangeable or placing threat modeling at the wrong SDLC phase.

### Methodology selection

A framing pattern. Choose the methodology based on the perspective the scenario emphasizes. **Software-centric** (STRIDE, with data-flow diagrams): use when the focus is the software architecture and developer audience. **Risk-centric** (PASTA): use when the focus is business alignment and executive engagement. **Attack-centric** (attack trees, kill chain): use when the focus is adversary behavior and attack paths. **Asset-centric** (NIST SP 800-154): use when the focus is protecting specific data assets and their lifecycle.

## The Trap Patterns to Inoculate Against

Five traps recur. The **STRIDE-to-property mismapping** trap is the highest-yield miss in the family — confusing which CIA+ property each STRIDE category violates. The **kill-chain-out-of-order** trap appears whenever the question tests sequencing; memorize Recon → Weaponization → Delivery → Exploitation → Installation → C2 → Actions. The **PASTA-stage-count** trap offers five or six stages instead of seven. The **threat-modeling-too-late** trap places threat modeling in testing or post-deployment; it belongs in design. The **DREAD-as-identification** trap offers DREAD as an answer to "which framework identifies threats?" — DREAD ranks; STRIDE identifies.

## A Minimal Study Priority

In priority order: STRIDE expansion and the six-property mapping; DREAD expansion and its role as a ranking method; PASTA's seven stages in order; the Cyber Kill Chain's seven phases in order; MITRE ATT&CK as tactics-and-techniques and how it differs from the kill chain; the placement of threat modeling in the design phase of the SDLC; the threat-modeling-vs-risk-assessment distinction; methodology selection (software-centric vs. risk-centric vs. attack-centric vs. asset-centric); attack trees as a hierarchical decomposition tool; and the Diamond Model's four vertices.

## What Gets Less Air Time

Trike, VAST, LINDDUN, OCTAVE, and other less-common methodologies appear as Tier 3 distractors but are not the primary subject of any high-frequency question. NIST SP 800-154 (data-centric threat modeling) is referenced but not deeply tested. The internals of MITRE ATT&CK technique numbers (T1059, T1086, etc.) are not asked. Specific Microsoft Threat Modeling Tool features are never named. The seven-stage details of PASTA beyond stage names are not asked. The exact origin dates of frameworks are not tested.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 21 (and the threat-modeling sections of Chapter 1) are the comprehensive references. Destination Certification's threat modeling overview at https://destcert.com/resources/threat-modeling-methodologies/ is the most efficient visual review of STRIDE/DREAD/PASTA. Microsoft's original STRIDE documentation at https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats is the canonical source for the Microsoft methods. Lockheed Martin's Cyber Kill Chain page at https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html is the authoritative source for the kill chain. MITRE ATT&CK at https://attack.mitre.org/ is the authoritative source for tactics and techniques. NIST SP 800-154 (https://csrc.nist.gov/pubs/sp/800/154/ipd) is the source for data-centric threat modeling. Bruce Schneier's original "Attack Trees" paper from 1999 at https://www.schneier.com/academic/archives/1999/12/attack_trees.html is the original source for that technique.

Sources used to compile this README:

- [Destination Certification — Threat Modeling Methodologies (STRIDE, PASTA, DREAD)](https://destcert.com/resources/threat-modeling-methodologies/)
- [Destination Certification — CISSP Domain 1 Security and Risk Management](https://destcert.com/resources/domain-1-security-and-risk-management/)
- [Destination Certification — CISSP Domain 8 Software Development Security](https://destcert.com/resources/cissp-domain-8-software-development-security/)
- [Infosec Institute — Threat Modeling and the CISSP](https://www.infosecinstitute.com/resources/cissp/threat-modeling/)
- [Threat-Modeling.com — PASTA Threat Modeling](https://threat-modeling.com/pasta-threat-modeling/)
- [Drata — PASTA Threat Modeling: Tutorial and Best Practices](https://drata.com/grc-central/risk/pasta-threat-modeling)
- [Lockheed Martin — Cyber Kill Chain](https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [Palo Alto Networks — What is the MITRE ATT&CK Framework?](https://www.paloaltonetworks.com/cyberpedia/what-is-mitre-attack)
- [Schneier on Security — Attack Trees (1999)](https://www.schneier.com/academic/archives/1999/12/attack_trees.html)
- [Huntress — VAST Threat Modeling](https://www.huntress.com/cybersecurity-101/topic/vast-threat-modeling)
- [JumpCloud — The Diamond Model of Intrusion Analysis](https://jumpcloud.com/it-index/what-is-the-diamond-model-of-intrusion-analysis)
- [EC-Council — Trike Threat Modeling](https://www.eccouncil.org/cybersecurity-exchange/threat-intelligence/trike-threat-modeling-methodology/)
- [NIST SP 800-154 — Guide to Data-Centric System Threat Modeling](https://csrc.nist.gov/pubs/sp/800/154/ipd)
- [Practical DevSecOps — Threat Modeling vs Risk Assessment](https://www.practical-devsecops.com/threat-modeling-vs-risk-assessment/)
- [Security Compass — Comparing STRIDE, LINDDUN, PASTA Threat Modeling](https://www.securitycompass.com/blog/comparing-stride-linddun-pasta-threat-modeling/)
