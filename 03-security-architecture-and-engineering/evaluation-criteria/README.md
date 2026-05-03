---
tier: 2
exam_weight: "13%"
---

# Security Evaluation and Assurance Criteria for the CISSP Exam

> **Tier:** 2  
> **Domain:** Security Architecture and Engineering (Domain 3)  
> **Exam Weight:** ~13%  
> **Status:** Built

A focused drill set for the named, formal evaluation and assurance frameworks in CISSP Domain 3 — TCSEC (Orange Book), ITSEC, the Common Criteria (ISO/IEC 15408), and FIPS 140-3. These are the "named acronyms with numbered levels" family that examiners pair against each other in question stems. Use alongside `evaluation-criteria.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 3 (Security Architecture and Engineering) carries roughly 13% of the exam under ISC2's official outline. Inside that domain, evaluation criteria are a Tier-2-frequency family: most candidates see one or two evaluation-related questions on the actual exam. The reason this family feels harder than its frequency suggests is the same as for security models — the trap density is high, because TCSEC, ITSEC, and Common Criteria all have similar-sounding numbered ratings (C2, E2, EAL2) that examiners deliberately rotate against each other.

## What This Set Does and Does NOT Cover

This set covers product/system/module evaluation and assurance frameworks. It is distinct from the formal security models drilled in `security-models/` (Bell-LaPadula, Biba, etc., which describe what security policy a system enforces) and from the governance frameworks drilled in `01-security-and-risk-management/governance-and-compliance/` (NIST CSF, NIST RMF, ISO 27001, COBIT, CIS Controls — which describe how organizations manage security programs). Evaluation criteria sit between those two: a product's evaluation says how trustworthy a particular implementation is, given some claimed policy.

## The Question Patterns That Actually Show Up

### Common Criteria framework identification

The single most common pattern. You'll be given a scenario describing a product evaluation and asked to identify the framework or to identify a specific component (TOE, PP, ST, SFR, SAR, or EAL). Common Criteria is ISO/IEC 15408 and is the current international standard. The TOE (Target of Evaluation) is the thing being evaluated. A Protection Profile (PP) is a generic, customer-side requirements document for a class of products; a Security Target (ST) is a vendor-specific document describing the claims for a particular product. The reliable trap is conflating PP and ST.

### EAL levels

A small but reliable corner. EAL1 is functionally tested. EAL4 is methodically designed, tested, and reviewed — the highest level achievable as a retrofit on a commercial COTS product not designed with high assurance in mind, and the most common government-required level. EAL7 is formally verified design and tested, reserved for high-assurance military and specialized systems. The reliable trap is treating EAL as a measure of how secure a product is. EAL measures EVALUATION RIGOR, not security itself.

### TCSEC and the Orange Book

TCSEC is obsolete (officially superseded by Common Criteria in 2005) but appears on the exam as historical and distractor content. The headlines are: TCSEC is the Orange Book, part of the Rainbow Series. It has classes D, C1, C2, B1, B2, B3, A1 from lowest to highest. C2 is the famous commercial rating that Windows NT achieved. B1 introduces MAC and labels. A1 is verified design with formal proofs. The reliable trap is picking TCSEC for current product evaluations — the answer is almost always Common Criteria.

### ITSEC

ITSEC is the European 1990s framework that bridged TCSEC to Common Criteria. It introduced the separation between functionality (F1-F10) and assurance (E0-E6) that Common Criteria later codified. The reliable trap is picking ITSEC as the current standard — it is not. Recognize the name; do not memorize F-numbers and E-numbers in detail.

### FIPS 140-3

FIPS 140-3 is the current U.S. (and Canadian) standard for cryptographic module validation, replacing FIPS 140-2 in 2019. It evaluates the cryptographic module specifically — not a whole system. Four security levels: Level 1 (production-grade components), Level 2 (tamper-evidence, role-based auth), Level 3 (tamper resistance, identity-based auth), Level 4 (tamper-active, zeroization, environmental protection). The reliable trap is treating FIPS 140-3 as a system-wide evaluation; it is narrow and crypto-module-specific.

## The Trap Patterns to Inoculate Against

Five traps appear with high reliability. The **TCSEC-as-current trap** appears whenever the scenario describes a 21st-century product evaluation; the answer is Common Criteria, not TCSEC. The **EAL-as-security trap** is the highest-yield miss in this family — EAL is evaluation rigor, not security; never assume "EAL7 means more secure than EAL4." The **PP-vs-ST swap** trips candidates who remember the acronyms but not who writes which document — PP is customer-side / generic, ST is vendor-side / specific. The **FIPS-140-3-as-system-wide trap** appears when the scenario describes a hardware appliance and asks which framework evaluates the whole appliance; FIPS 140-3 only evaluates the crypto module, Common Criteria evaluates the rest. The **ITSEC-as-current trap** appears when ITSEC is offered alongside Common Criteria as a candidate answer for a current evaluation; pick Common Criteria.

## A Minimal Study Priority

In priority order: lock in Common Criteria as the current international product evaluation standard and what TOE, PP, ST, and EAL each mean; know that EAL is evaluation rigor and not security; know FIPS 140-3 is the current crypto-module standard with Levels 1-4 and that it evaluates the module not the system; know TCSEC = Orange Book = obsolete with C2 as the famous commercial rating; recognize ITSEC as the European 1990s framework that bridged TCSEC to Common Criteria. The internals of TCSEC class B/A and ITSEC F/E numbers are Tier 3 — recognize them as distractors but do not over-invest.

## What Gets Less Air Time

The full enumeration of TCSEC classes beyond C2/B1/A1 is not commonly tested; just know the lowest is D and the highest is A1. ITSEC F-numbers and E-numbers are not commonly tested individually. The CCRA (Common Criteria Recognition Arrangement) is occasionally referenced but rarely the primary subject of a question. Specific EAL claims for specific products (e.g., what EAL did the Windows kernel achieve) are not tested. The Rainbow Series book colors beyond Orange and Red are Tier 3.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 8 covers evaluation criteria as part of the security architecture chapter. Common Criteria's official portal is the canonical source for the current standard. NIST's CMVP (Cryptographic Module Validation Program) is the canonical source for FIPS 140-3.

Sources used to compile this README:

- [Common Criteria Portal — Official Site](https://www.commoncriteriaportal.org/)
- [NIST CMVP — FIPS 140-3](https://csrc.nist.gov/projects/cryptographic-module-validation-program/fips-140-3-standards)
- [NIST CSRC — FIPS 140-3 Transition Effort](https://csrc.nist.gov/projects/fips-140-3-transition-effort)
- [Wikipedia — Common Criteria](https://en.wikipedia.org/wiki/Common_Criteria)
- [Wikipedia — Trusted Computer System Evaluation Criteria](https://en.wikipedia.org/wiki/Trusted_Computer_System_Evaluation_Criteria)
- [Wikipedia — ITSEC](https://en.wikipedia.org/wiki/ITSEC)
- [Wikipedia — FIPS 140-3](https://en.wikipedia.org/wiki/FIPS_140-3)
- [Wikipedia — Evaluation Assurance Level](https://en.wikipedia.org/wiki/Evaluation_Assurance_Level)
- [Wikipedia — Rainbow Series](https://en.wikipedia.org/wiki/Rainbow_Series)
- [Destination Certification — Security Evaluation Models](https://destcert.com/resources/cissp-domain-3-security-architecture-engineering/)
- [ThorTeaches — Common Criteria](https://thorteaches.com/glossary/common-criteria/)
- [ThorTeaches — TCSEC](https://thorteaches.com/glossary/trusted-computer-system-evaluation-criteria-tcsec/)
- [ThorTeaches — FIPS 140](https://thorteaches.com/glossary/fips-140/)
