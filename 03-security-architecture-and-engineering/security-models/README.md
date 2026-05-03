---
tier: 1
exam_weight: 13%
---

# Formal Security Models for the CISSP Exam

> **Tier:** 2  
> **Domain:** Security Architecture and Engineering (Domain 3)  
> **Exam Weight:** ~13%  
> **Status:** Built

A focused drill set for the named, formal security models in CISSP Domain 3 — the family of models with confusable names (Bell-LaPadula, Biba, Clark-Wilson, Brewer-Nash, Lipner, Graham-Denning, Harrison-Ruzzo-Ullman, Take-Grant, Lattice, State Machine, Information Flow, Non-Interference, Sutherland) that examiners deliberately rotate against each other in question stems. Use alongside `security-models.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 3 (Security Architecture and Engineering) carries roughly 13% of the exam under ISC2's official outline. Inside that domain the formal security models are a Tier-2-frequency family: most candidates see two to four model-naming questions on the actual exam and many more on practice tests. The reason this family feels harder than its frequency suggests is the trap-density per question — examiners can craft a single scenario whose distractors are four model names that all sound vaguely correct, and the right answer hinges on remembering which property goes with which model.

## What This Set Does and Does NOT Cover

This set covers the models NOT already drilled in `05-identity-and-access-management/access-control-and-iam/access-control-and-iam.tsv`. Specifically: Lipner, Access Matrix (Lampson), Graham-Denning, Harrison-Ruzzo-Ullman (HRU), Take-Grant, Lattice-Based Access Control, State Machine, Information Flow, Non-Interference (Goguen-Meseguer), and Sutherland. Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash mechanics live in the IAM set — review them there. The comparison and trap cards in this set DO reference BLP and Biba where doing so disambiguates a model in this set.

## The Question Patterns That Actually Show Up

### Confidentiality vs. integrity vs. conflict-of-interest sorting

The single most common pattern in this family. You'll be given a scenario describing what a model is meant to protect and asked to name it. Bell-LaPadula = confidentiality. Biba = integrity. Clark-Wilson = integrity, with a transaction/separation-of-duties flavor. Brewer-Nash (Chinese Wall) = conflict of interest. Lipner = commercial integrity that combines BLP + Biba + separation of duties. The reliable trap is offering both Biba and Clark-Wilson as plausible integrity answers; pick Biba when the scenario describes simple read-down/write-up rules and Clark-Wilson when the scenario emphasizes well-formed transactions, Constrained Data Items, or separation of duties.

### Rights-propagation models (Graham-Denning, HRU, Take-Grant)

A second-tier-frequency pattern. Graham-Denning specifies eight protection rules — create/delete subject, create/delete object, read/grant/delete/transfer access right. The exam rarely asks you to enumerate all eight; it usually just asks which model defines "eight protection rules," and Graham-Denning is the answer. Harrison-Ruzzo-Ullman (HRU) is the formal extension that proves the safety problem — "can right R ever leak to subject S?" — is UNDECIDABLE in the general case. Take-Grant uses a directed graph and four operations (take, grant, create, remove) and proves the safety question is decidable in linear time under its constraints. The reliable trap is swapping Graham-Denning and HRU; if the question is about decidability or the safety problem, the answer is HRU.

### Foundational meta-models (Access Matrix, State Machine, Information Flow, Lattice)

These are the abstract structures that the named models are BUILT ON. Access Matrix (Lampson) is the foundational two-dimensional table; ACLs are its column-wise decomposition and capability lists are its row-wise decomposition. State Machine is the meta-pattern that BLP relies on — a system is secure if it starts in a secure state and every transition leaves it secure. Information Flow describes how information moves between security classes; both BLP (confidentiality flow) and Biba (integrity flow) are information flow models. Lattice-Based Access Control assigns labels from a partially ordered set; BLP and Biba are both lattice instances. The reliable trap is offering "lattice-based access control" as the answer when the scenario describes BLP — pick BLP if the scenario gives the no-read-up/no-write-down rules, pick lattice only when the scenario explicitly invokes labels, dominance, LUB, or GLB.

### Non-Interference and covert channels

A small but reliable corner. Non-Interference (Goguen-Meseguer) requires that high-level subjects' actions be UNOBSERVABLE to low-level subjects, which closes covert channels. BLP allows certain timing and storage covert channels because it only regulates explicit reads and writes. If the scenario mentions covert channels, side channels, or observability, the answer is Non-Interference, not BLP.

### Lipner

A small but high-yield card. Lipner combines Bell-LaPadula's confidentiality lattice with Biba's integrity lattice and adds enforced separation of duties. Designed for commercial environments. The reliable trap is offering Clark-Wilson as the answer when the scenario describes a commercial integrity context — pick Clark-Wilson if the scenario centers on well-formed transactions and Transformation Procedures, pick Lipner if the scenario describes combining BLP with Biba in a commercial setting.

## The Trap Patterns to Inoculate Against

Five traps appear with high reliability. The **Graham-Denning vs. HRU swap** trips candidates who remember the names but not the structural difference — Graham-Denning lists eight rules, HRU proves undecidability. The **HRU vs. Take-Grant decidability inversion** is the highest-yield specific-fact question in this set — HRU general-case undecidable, Take-Grant linear-time decidable. The **Lattice-as-distractor trap** appears when the scenario describes BLP and "lattice-based access control" is offered as an alternative answer; lattice is the generalization, BLP is the specific model. The **Lipner-vs-Clark-Wilson confusion** trips candidates who memorized Clark-Wilson as "the commercial integrity model" — Lipner is also a commercial integrity model and is the right answer when the scenario describes combining confidentiality and integrity. The **Non-Interference-vs-BLP swap** appears in covert-channel scenarios; if the question mentions observability or covert channels, Non-Interference is the answer.

## A Minimal Study Priority

In priority order: lock in which models protect confidentiality, integrity, and conflict of interest (this carries the most exam weight); memorize the HRU vs. Take-Grant decidability contrast as a single fact; know that BLP is built on the State Machine, Information Flow, and Lattice meta-models; know Graham-Denning specifies eight protection rules without needing to recite them; know that Lipner is the BLP+Biba commercial combination; know that Non-Interference closes the covert-channel gap that BLP leaves open. The mechanics of BLP and Biba (no-read-up/no-write-down etc.) live in the IAM set — drill them there.

## What Gets Less Air Time

The full enumeration of Graham-Denning's eight rules is rarely required — only the count and the name. The internal mathematics of HRU's safety proof is not tested. Sutherland is rarely the right answer; it appears as a distractor. The specific lattice operations (LUB and GLB) are mentioned in some study guides but are usually distractors rather than the primary subject. Bell-LaPadula's Strong Star Property and Biba's invocation properties exist but are Tier 3 details.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 8 is the comprehensive reference for security models. Destination Certification's "Information Security Models" page is the most efficient visual summary and includes the comparison tables that the exam mirrors. ThorTeaches and CISSPrep both have dedicated pages per model that are useful for rapid review.

Sources used to compile this README:

- [Destination Certification — Information Security Models](https://destcert.com/resources/information-security-models/)
- [CISSPrep — Security Models](https://cissprep.net/security-models/)
- [ThorTeaches — Bell-LaPadula](https://thorteaches.com/cissp-bell-lapadula/)
- [ThorTeaches — Biba](https://thorteaches.com/cissp-biba/)
- [ThorTeaches — Clark-Wilson](https://thorteaches.com/cissp-clark-wilson/)
- [ThorTeaches — Brewer-Nash](https://thorteaches.com/glossary/brewer-and-nash-model/)
- [ThorTeaches — Graham-Denning](https://thorteaches.com/glossary/graham-denning-model/)
- [ThorTeaches — Harrison-Ruzzo-Ullman](https://thorteaches.com/glossary/harrison-ruzzo-ullman-model/)
- [ThorTeaches — Take-Grant](https://thorteaches.com/glossary/take-grant-protection-model/)
- [ThorTeaches — Lipner](https://thorteaches.com/glossary/lipner-model/)
- [ThorTeaches — Non-Interference](https://thorteaches.com/glossary/noninterference-model/)
- [Wikipedia — HRU (security)](https://en.wikipedia.org/wiki/HRU_(security))
- [Wikipedia — Take-grant protection model](https://en.wikipedia.org/wiki/Take-grant_protection_model)
- [Wikipedia — Lattice-based access control](https://en.wikipedia.org/wiki/Lattice-based_access_control)
- [Wikipedia — Non-interference (security)](https://en.wikipedia.org/wiki/Non-interference_(security))
