# Asset Security & Data Lifecycle for the CISSP Exam

> **Tier:** 2  
> **Domain:** Asset Security (Domain 2)  
> **Exam Weight:** ~10%  
> **Status:** Built

A study-oriented overview of the asset security question family on the CISSP. This is Domain 2, weighted at roughly 10% of the exam — the smallest of the eight domains, but with a tightly focused content area that produces predictable question patterns. Use alongside `asset-security.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 2 carries roughly 10% of the exam. The questions cluster around three high-frequency areas: data classification, the data roles (especially the owner-vs-custodian-vs-controller cluster that's an exam favorite), and media sanitization — particularly the NIST SP 800-88 Clear/Purge/Destroy distinction and the trap of degaussing an SSD. The remaining content covers the data lifecycle, data states, retention, and DLP. The domain feels small but the questions are direct and the concepts are testable, so this is high-yield material per minute of study.

## The Question Patterns That Actually Show Up

### Data role identification

The single most common pattern in this family. You'll be given a one-line description of someone's responsibility and asked which role it represents. The high-yield distinctions: **data owner** is the business-side role accountable for classification, retention, and use of a specific data set — not the IT person managing it. **Data custodian** is the IT/operations role implementing the owner's controls — backups, encryption configuration, access provisioning. **Data steward** focuses on data quality, integrity, and metadata governance. **Data controller** is GDPR-specific — the entity that decides the purposes and means of processing personal data; this is a LEGAL role, not an internal governance role. **Data processor** is GDPR-specific — the entity that processes data on behalf of the controller. **Data subject** is GDPR — the individual the data is about. **Mission owner** or **system owner** owns a system or service, which is not the same as owning the data within it.

The traps are dense here. If a CISSP question is framed in GDPR terms, "data owner" is wrong (it's controller or processor). If a question is framed in internal governance terms, "controller" is wrong (it's owner). Confusing owner with custodian is the classic mix-up: owners decide, custodians implement.

### Media sanitization per NIST SP 800-88

Tested constantly. The three sanitization methods, in order of strength: **Clear** is logical overwriting suitable for media remaining within organizational control; defends against non-specialist recovery. **Purge** uses physical or logical techniques (degauss, cryptographic erase, secure-erase command, overwrite-with-verification) suitable for media leaving the organization; defends against laboratory-grade recovery. **Destroy** is physical destruction (disintegration, incineration, melting, pulverization) appropriate for the highest classifications or final disposal.

The single highest-yield trap in the entire domain is **degaussing an SSD**. Degaussing only works on magnetic media — hard disk drives and magnetic tape. Solid-state drives have no magnetic domains; degaussing them does nothing. The correct answer for SSDs is cryptographic erase (only if encryption was enabled from the start with strong keys), the secure-erase command (vendor-specific, varies in effectiveness), or physical destruction. The second-highest-yield trap is selecting "format" or "delete" as sufficient for sensitive data — both leave recoverable remnants.

### Data classification

Both government and commercial schemes get tested. **Government / military**: Top Secret, Secret, Confidential, Sensitive But Unclassified (SBU) / Controlled Unclassified Information (CUI), Unclassified. **Commercial**: Confidential, Private, Sensitive, Public — though exact label sets vary by source and organization. The principle that handling controls scale with classification level is universal: higher classification = stricter controls at every state of data.

### Data lifecycle and data states

The canonical six-phase lifecycle on the CISSP is Create, Store, Use, Share, Archive, Destroy. The three data states are At Rest (stored), In Transit (moving), and In Use (active in memory). Different controls apply at each state — encryption is the canonical at-rest and in-transit control; in-use protection is harder and uses techniques like sandboxing, secure enclaves, DLP, and process isolation. The trap is treating encryption as universally protective; encryption does not protect data while it's being processed in cleartext in memory.

### Data retention

A definitional pattern. The principle is **minimum retention** — keep data only as long as legally required and operationally necessary. Over-retention is a liability because every retained byte expands the breach attack surface and increases legal-discovery cost. The data owner sets retention policy in consultation with legal and compliance; IT (custodian) implements. The trap is "retain data forever for safety" — that's an anti-pattern.

### Data Loss Prevention (DLP)

A topic that crosses Domain 2 and Domain 7. DLP comes in three deployment forms: **Network DLP** monitors traffic crossing the network perimeter; **Endpoint DLP** runs on user devices and can prevent local exfiltration via USB, print, copy/paste; **Cloud/Storage DLP** scans data at rest in cloud services and storage repositories. DLP works through content inspection (pattern matching, fingerprinting, lexical analysis) and depends on data classification labels for policy decisions. DLP is a detection and enforcement layer; it complements, but does not replace, encryption and access control.

### Asset inventory and configuration baselines

Both are foundational. An asset inventory tracks all organizational assets — hardware, software, data, intellectual property, personnel, facilities — with ownership, classification, and location metadata. Configuration baselines define the secure default for each system class; deviations require change management approval. These topics are tested as recall and as scenario tells — "the organization has no asset inventory" is a finding to call out, not a feature.

### Information Rights Management (IRM)

Sometimes called Enterprise Rights Management. Technology that travels with sensitive documents, controlling who can open, copy, print, edit, or forward them — even after they leave the organization's control. Distinct from DRM, which is broader and typically applied to consumer media. IRM is the answer when the scenario describes "controlling document use after distribution."

## The Trap Patterns to Inoculate Against

Five traps reliably appear. The **degauss-an-SSD** trap is the single highest-yield miss in this domain — degaussing only works on magnetic media. The **owner-vs-custodian** swap appears whenever a scenario describes "deciding the classification" (owner) vs. "implementing encryption" (custodian); read for who is making policy versus who is executing controls. The **owner-vs-controller** swap appears in scenarios that mix internal governance language with GDPR language; the controller is a GDPR legal role and applies only when GDPR is in play. The **format-or-delete-is-sufficient** trap fails when the scenario specifies sensitive or classified data; these methods leave recoverable remnants. The **encryption-protects-everything** trap fails when the question is about data in use; encryption does not protect cleartext data being processed in memory.

## A Minimal Study Priority

In priority order: NIST SP 800-88 Clear, Purge, and Destroy with the matching media-type guidance; the data role distinctions (owner vs. custodian vs. steward vs. controller vs. processor vs. mission owner); the government and commercial classification schemes; the six-phase data lifecycle; the three data states (at rest, in transit, in use) and their controls; data retention as a "minimum, not maximum" principle; the three DLP deployment types (network, endpoint, cloud) and their use cases; the difference between IRM and DRM; what an asset inventory contains; and why simple format/delete is insufficient for sensitive data.

## What Gets Less Air Time

Specific NIST SP 800-88 revision numbers are not asked. The DoD 5220.22-M overwrite standard appears occasionally as a legacy reference but has been superseded by NIST 800-88. Specific commercial DLP products are never named. Cross-border data sovereignty appears as high-level recognition only. The exact composition of every classification scheme (military vs. NATO vs. EU) is not deeply tested — the principle is more important than the labels. Specific cryptographic algorithms used for cryptographic erase are not asked at the symbol level (covered in cryptography family).

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 5 is the comprehensive reference. NIST SP 800-88 Rev. 2 is the authoritative source for media sanitization and is worth reading the executive summary and decision flow. Destination Certification's Domain 2 collection at https://destcert.com/resources/domain-2-asset-security/ is the most efficient visual review. CISSPrep's Asset Lifecycle and Data Ownership pages at https://cissprep.net/asset-lifecycle/ and https://cissprep.net/data-ownership/ are clean walkthroughs. Threat on the Wire's Domain 2 series is the clearest treatment of the owner-vs-custodian-vs-controller distinction. ISO/IEC 27001 and 27002 are referenced for asset management controls but are not deeply tested as standards.

Sources used to compile this README:

- [NIST SP 800-88 Rev. 2 — Guidelines for Media Sanitization](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r2.pdf)
- [Destination Certification — Asset Security Domain 2](https://destcert.com/resources/domain-2-asset-security/)
- [Destination Certification — Asset Classification MindMap](https://destcert.com/resources/asset-classification-mindmap-domain-2/)
- [Destination Certification — Modern Data Protection Methods](https://destcert.com/resources/modern-data-protection-methods/)
- [Destination Certification — Data Remanence](https://destcert.com/resources/data-remanence/)
- [Threat on the Wire — Asset Security Lifecycle](https://www.threatonthewire.com/cissp-domain-2-data-lifecycle-security/)
- [Threat on the Wire — Data Classification Real-World](https://www.threatonthewire.com/cissp-domain-2-data-classification-real-world/)
- [Threat on the Wire — Data Sanitization & Destruction](https://www.threatonthewire.com/cissp-domain-2-data-sanitization-destruction/)
- [Threat on the Wire — Ownership of Information & Assets](https://www.threatonthewire.com/cissp-domain-2-ownership-information-assets/)
- [Threat on the Wire — Asset Inventory That Works](https://www.threatonthewire.com/cissp-domain-2-asset-inventory-that-works/)
- [Threat on the Wire — Data Retention Policies](https://www.threatonthewire.com/cissp-domain-2-data-retention-policies/)
- [CISSPrep — Asset Lifecycle](https://cissprep.net/asset-lifecycle/)
- [CISSPrep — Assets, Inventory, and Labels](https://cissprep.net/assets-inventory-and-labels/)
- [CISSPrep — Data Ownership](https://cissprep.net/data-ownership/)
- [CISSPrep — Data States and Data Remanence](https://cissprep.net/data-states-and-data-remanence/)
- [CISSPrep — Configuration Management](https://cissprep.net/configuration-management/)
- [Pearson IT Certification — Classifying Data](https://www.pearsonitcertification.com/articles/article.aspx?p=30287&seqNum=9)
- [Pearson IT Certification — Data Remanence and Decommissioning](https://www.pearsonitcertification.com/articles/article.aspx?p=3128866&seqNum=20)
- [Pearson IT Certification — Record Retention and Destruction](https://www.pearsonitcertification.com/articles/article.aspx?p=3128866&seqNum=19)
- [Infosec Institute — Data and System Ownership](https://www.infosecinstitute.com/resources/cissp/data-and-system-ownership/)
- [Infosec Institute — Information & Asset Classification](https://www.infosecinstitute.com/resources/cissp/information-and-asset-classification/)
- [Infosec Institute — Data Retention](https://www.infosecinstitute.com/resources/cissp/data-retention/)
- [Training Camp — CISSP Owners, Custodians, Controllers & Users](https://trainingcamp.com/articles/cissp-owners-custodians-controllers-users/)
- [ThorTeaches — Data, System, Mission Ownership, Custodians, and Users](https://thorteaches.com/cissp-certification-data-system-mission-ownership-custodians-and-users/)
- [Blancco — NIST 800-88 Media Sanitization](https://blancco.com/resources/resources/blog-what-is-nist-800-88-media-sanitization/)
- [Jetico — NIST SP 800-88 Guidelines Explained](https://jetico.com/blog/nist-sp-800-88-guidelines-media-sanitization-explained/)
