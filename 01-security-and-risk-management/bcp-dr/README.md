---
tier: 1
domain: Security and Risk Management (Domain 1) + Security Operations (Domain 7)
exam_weight: ~16% + ~13%
status: built
---

# BCP/DR Metrics & Lifecycle for the CISSP Exam

A study-oriented overview of business continuity planning and disaster recovery on the CISSP exam. This family spans Domain 1 (where business continuity requirements are identified and prioritized) and Domain 7 (where disaster recovery operations are tested and executed). Use alongside `bcp-dr.tsv` in this folder.

## Where This Family Sits in the Exam

The BCP/DR family is a workhorse because it lives in two domains. Domain 1's "Identify, analyze, evaluate, prioritize, and implement Business Continuity (BC) requirements" sub-objective is where the lifecycle, the BIA, and the strategic framing get tested. Domain 7's "Implement disaster recovery (DR) processes" and "Test disaster recovery plans (DRP)" sub-objectives are where recovery sites, backup strategies, and DR test types get tested. The recovery metrics — RTO, RPO, MTD, WRT — span both. Together this family is large, predictable, and a reliable point producer; expect at least one metric question, one lifecycle question, and likely one site or test question on a CAT exam.

## The Question Patterns That Actually Show Up

### Recovery metric identification

The single most common pattern. You'll be given a one-sentence description and asked which metric it represents. Memorize the four cleanly: RTO is the maximum tolerable time to restore systems (downtime tolerance); RPO is the maximum tolerable amount of data loss, expressed as a time window backwards from the disruption (data-loss tolerance); MTD (also called MAD or MAO) is the absolute maximum a critical process can be unavailable before unacceptable harm; WRT is the time required to verify and validate systems after they are restored, before they go back into production. The relationship MTD = RTO + WRT is testable directly: given RTO and WRT, compute MTD; given MTD and RTO, compute WRT.

### Lifecycle phase ordering

The NIST SP 800-34 seven-phase model is the canonical CISSP ordering: develop the contingency planning policy, conduct the Business Impact Analysis, identify preventive controls, develop recovery strategies, develop the contingency plan, test/train/exercise, and maintain the plan. The single most reliable question here is "what comes first" — the answer is policy first, then BIA. The BIA cannot occur before there is a policy authorizing the work, and recovery strategies cannot be selected before the BIA tells you what needs recovering and how fast. Examiners deliberately offer "develop recovery strategies" as a wrong answer when the right one is BIA.

### Recovery site selection

A scenario describes constraints (budget, RTO target, data freshness requirements) and asks which site type fits. Hot sites are fully equipped, real-time-replicated, RTO measured in minutes, highest cost. Warm sites have hardware and connectivity in place but less current data, RTO in hours to a couple of days, mid-range cost. Cold sites are facility-only — power, cooling, space — with no equipment ready, RTO in days, lowest cost. Mobile sites are transportable units deployed post-disaster. Reciprocal/mutual aid agreements pledge shared resources between two organizations and are rare in practice because of compatibility and capacity constraints. Mirrored sites are real-time synchronous replicas, near-instantaneous RTO, very expensive.

### Backup strategy selection

Full, incremental, differential, synthetic, snapshot. A full backup copies everything; largest storage, fastest restore (one set needed). An incremental backup copies only what changed since the last backup of any kind; smallest storage per backup, slowest restore (full + every incremental in the chain). A differential backup copies what changed since the last full; mid-size storage, fast restore (full + one differential). The trap is conflating incremental with differential — examiners hit it often. The 3-2-1 rule is the canonical best practice: three copies of data, on two different media types, with one off-site. Some sources extend it to 3-2-1-1-0 (one immutable/air-gapped copy, zero verification errors).

### DR plan testing types

Five tests, ordered by increasing disruption and realism: read-through (or checklist) where the plan is reviewed offline; structured walkthrough (or tabletop) where stakeholders gather and walk the plan with a facilitator; simulation where teams execute procedures against a simulated incident scenario; parallel where the recovery is fully executed alongside production (production keeps running); and full interruption where production is actually shut down and recovery takes over. The exam tests both the order and the appropriateness — you don't run a full interruption test as your first exercise; you build up to it through walkthroughs and parallel tests after they pass.

### BCP vs. DR scope

A definitional pattern. BCP focuses on critical business processes and the survival of the business — keeping payroll running, keeping the customer-facing services available, keeping core operations going during a disruption. DR focuses on recovering the technology infrastructure that supports those processes — restoring servers, databases, networks. DR is a subset of BCP. The trap is putting "disaster recovery" as the answer when the question is about a business process rather than a system.

### High availability vs. fault tolerance vs. redundancy

Tested as a definitional cluster. High availability is a system property achieved through redundancy plus failure detection plus automatic failover, designed to minimize downtime. Fault tolerance is a stricter property — the system continues operating without disruption even when components fail, typically achieved through synchronous replication and zero-downtime design. Redundancy is the underlying technique — duplicate critical components so one failure does not cause loss of service. Failover is the act of switching from a failed component to a backup. HA requires redundancy but not vice versa.

### Order of priorities

Life safety always comes first. Every BCP/DR question that mentions human life expects life safety as the top priority, ahead of data, systems, facilities, or anything else. After human life, the priority order in classical CISSP framing is people, then data, then systems, then facilities — though specific orderings can vary by question.

## The Trap Patterns to Inoculate Against

Five traps recur reliably. The **RTO/RPO swap** is the highest-yield miss — RTO is about time to restore systems; RPO is about how much data you can afford to lose. They measure independent things. The **BIA misplacement** trap — putting BIA after recovery strategies, after preventive controls, or anywhere except second in the lifecycle — appears constantly because BIA's first-position is unintuitive to candidates who think "we should figure out what to do before analyzing the impact." The **incremental-vs-differential confusion** in backup questions is its own trap — incremental restores are slow because you need every link in the chain; differential restores are fast because you only need the latest full plus the latest differential. The **full-interruption-as-first-test trap** offers full interruption as the right answer when the scenario describes a never-tested plan — you start with read-through, not full interruption. The **HA-vs-fault-tolerance confusion** trips candidates when the scenario specifies "zero downtime" — HA accepts brief downtime during failover; fault tolerance does not.

## A Minimal Study Priority

In priority order: the four recovery metrics (RTO, RPO, MTD, WRT) with one-line definitions and units; the formula MTD = RTO + WRT; the seven phases of the NIST 800-34 lifecycle and the BIA's second position; the four recovery site types (hot, warm, cold, mobile) with cost-vs-recovery-time tradeoffs; the three primary backup strategies (full, incremental, differential) with restore complexity; the five DR test types ordered by disruption; the BCP-vs-DR scope distinction; the HA-vs-fault-tolerance distinction; the 3-2-1 backup rule; and the life-safety-first priority ordering.

## What Gets Less Air Time

Specific RAID levels are tested only at recall level — RAID 0 (striping, no redundancy), RAID 1 (mirroring), RAID 5 (single-parity), RAID 6 (dual-parity). The RAID 10 (1+0) variant occasionally appears. Synthetic full backups and snapshot strategies appear as Tier 3 distractors. The salvage and reconstitution phases of the post-recovery lifecycle are mentioned but rarely the primary subject. ISO 22301 (the international standard for business continuity management systems) is the underlying reference but its number is not asked. Specific cloud DR products are never named. Mean Time To Repair (MTTR), Mean Time Between Failures (MTBF), and Mean Time To Failure (MTTF) appear occasionally as hardware-availability metrics distinct from RTO/RPO/MTD/WRT.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 3 (BCP) and Chapter 18 (DR) are the comprehensive references. Destination Certification's BCM MindMap at https://destcert.com/resources/business-continuity-management-bcm-mindmap-cissp-domain-7/ is the most efficient visual review. CISSPrep's Business Continuity and Recovery Concepts page at https://cissprep.net/business-continuity-and-recovery-concepts/ is a strong free overview. NIST SP 800-34 Rev. 1 (Contingency Planning Guide for Federal Information Systems) is the underlying source for the seven-phase lifecycle and is worth skimming. ISO 22301 is the international BCMS standard but does not need to be read in depth for the exam. LearnSecurityManagement's RPO/RTO/WRT/MTD page is the single clearest treatment of the four metrics with worked examples.

Sources used to compile this README:

- [NIST SP 800-34 Rev. 1 — Contingency Planning Guide](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf)
- [Destination Certification — BCM MindMap, Domain 7](https://destcert.com/resources/business-continuity-management-bcm-mindmap-cissp-domain-7/)
- [CISSPrep — Business Continuity and Recovery Concepts](https://cissprep.net/business-continuity-and-recovery-concepts/)
- [LearnSecurityManagement — RPO, RTO, WRT, MTD](https://www.learnsecuritymanagement.com/cissp-rpo-rto-wrt-mtd-disaster-recovery-metrics)
- [Cyvitrix Learning — RPO, RTO, Recovery Metrics Study Notes](https://cyvitrix.com/rpo-rto-and-recovery-metrics-study-notes-for-cissp-and-bc-dr-planning/)
- [Infosec Institute — CISSP Business Continuity Planning Exercises](https://www.infosecinstitute.com/resources/cissp/cissp-business-continuity-planning-exercises/)
- [Threat on the Wire — BCP vs DR](https://www.threatonthewire.com/cissp-bcp-vs-disaster-recovery/)
- [Threat on the Wire — DR Testing Domain 6](https://www.threatonthewire.com/cissp-domain-6-disaster-recovery-business-continuity-testing/)
- [SentinelOne — BCP vs DR Differences](https://www.sentinelone.com/cybersecurity-101/cloud-security/business-continuity-plan-vs-disaster-recovery-plan/)
- [Stonefly — Hot vs Cold vs Warm Sites](https://stonefly.com/blog/hot-cold-warm-backup-sites-disaster-recovery/)
- [Backblaze — Disaster Recovery 101 Hot vs Warm vs Cold DR Sites](https://www.backblaze.com/blog/disaster-recovery-101-hot-vs-warm-vs-cold-dr-sites/)
- [TRG Datacenters — Disaster Recovery Site Types](https://www.trgdatacenters.com/resource/disaster-recovery-site-types/)
- [ITPerfection — System Resilience, HA, QoS, Fault Tolerance](https://www.itperfection.com/cissp/security-operations-domain/system-resilience-high-availability-qos-and-fault-tolerance/)
- [ITperfection — Test Disaster Recovery Plans](https://www.itperfection.com/cissp/security-operations-domain/test-disaster-recovery-plans-drp/)
- [Scale Computing — Fault Tolerance vs HA](https://www.scalecomputing.com/resources/fault-tolerance-vs-high-availability)
- [Nobl9 — High Availability vs Fault Tolerance](https://www.nobl9.com/service-availability/high-availability-vs-fault-tolerance)
- [TechTarget — Full, Incremental, Differential Backups](https://www.techtarget.com/searchdatabackup/feature/Full-incremental-or-differential-How-to-choose-the-correct-backup-type)
- [Acronis — Incremental vs Differential Backups](https://www.acronis.com/en/blog/posts/incremental-differential-backups/)
- [SecurityScientist — Complete Guide to Business Impact Analysis](https://www.securityscientist.net/blog/complete-guide-to-business-impact-analysis-for-contingency-planning-nist-sp-800-34-step-2/)
- [ThorTeaches — RAID Levels for Availability](https://thorteaches.com/cissp-domain-7-security-operations-raid-redundant-array-of-independent-disks/)
- [Adrian Citu — CISSP Notes BCP/DR](https://adriancitu.com/2012/10/16/my-cissp-notes-business-continuity-and-disaster-recovery-planning/)
- [BCMpedia — Reciprocal Site Definition](https://www.bcmpedia.org/wiki/Reciprocal_Site)
