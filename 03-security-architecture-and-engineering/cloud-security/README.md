---
tier: 3
exam_weight: "~5-8% (growing emphasis in 2024 outline)"
---

# Cloud Security for the CISSP Exam


A study-oriented overview of the cloud security question family on the CISSP. Cloud security spans Domain 3 (architecture and shared responsibility), Domain 4 (cloud network security), Domain 6 (cloud assessment), and Domain 7 (cloud operations and incident response). The 2024 outline refresh significantly expanded cloud security emphasis. Use alongside `cloud-security.tsv` in this folder.

## Where This Family Sits in the Exam

Cloud security is one of the fastest-growing topic areas on the exam. The 2024 outline refresh elevated cloud-specific content across multiple domains, and the question pool has shifted from "what is the cloud?" definitional questions toward scenario-based "who is responsible for X under SaaS?" questions. The high-frequency content centers on the NIST cloud computing definition (5+3+4 framework), the shared responsibility model and its variation across IaaS/PaaS/SaaS, the four CASB pillars, the CSPM/CWPP/CNAPP distinction, FedRAMP for federal contexts, and ISO 27017/27018 for cloud-specific control extensions.

## The Question Patterns That Actually Show Up

### NIST cloud computing definition (5+3+4)

The most predictable foundational pattern. NIST SP 800-145 defines cloud computing through three lenses. **Five essential characteristics**: on-demand self-service (provision without human interaction), broad network access (available over the network through standard mechanisms), resource pooling (provider's resources serve multiple consumers using a multi-tenant model), rapid elasticity (rapid scale up/down with demand), and measured service (metered usage with transparency). **Three service models**: IaaS (Infrastructure as a Service), PaaS (Platform as a Service), SaaS (Software as a Service). **Four deployment models**: public (provider-operated, multi-tenant), private (single-tenant, can be on- or off-premises), community (shared by organizations with common interest), hybrid (combination with orchestration between them).

### Shared responsibility model

The single most-tested cloud topic. The split between provider and customer responsibility varies by service model, but a few rules are universal: the customer ALWAYS retains responsibility for data classification and access management, and the provider ALWAYS owns physical security. The differences appear in the middle layers. In **IaaS** the customer owns OS, runtime, applications, and data; the provider owns hypervisor, hardware, and physical security. In **PaaS** the provider expands to include OS and runtime; the customer owns application and data. In **SaaS** the provider owns everything except data classification, user access, and configuration; the customer owns those. The trap is misallocating layers — assigning OS patching to the provider in IaaS (wrong, that's the customer's), or treating SaaS as no-customer-responsibility (the customer still owns access management, data classification, and often configuration).

### CASB four pillars

A definitional pattern. A Cloud Access Security Broker (CASB) provides four functional pillars: **Visibility** (discover all cloud usage including shadow IT, see who is using what cloud services), **Compliance** (audit logging, regulatory adherence, data residency enforcement), **Data Security** (DLP, encryption integration, classification-aware policy enforcement), **Threat Protection** (malware detection, anomaly detection, account compromise indicators). CASBs deploy in three modes: API-based (out-of-band, post-event inspection through service APIs), forward proxy (traffic inspection at the user's network), reverse proxy (traffic inspection on the cloud-service side, often redirected through DNS).

### CSPM, CWPP, CNAPP

A definitional pattern that distinguishes three related but different cloud security tool categories. **CSPM (Cloud Security Posture Management)** continuously evaluates cloud configurations against best-practice benchmarks and compliance frameworks — surfaces misconfigurations like exposed S3 buckets, overly permissive IAM policies, unencrypted databases. **CWPP (Cloud Workload Protection Platform)** protects the workloads running in cloud environments — vulnerability scanning, runtime protection, anti-malware on VMs and containers. **CNAPP (Cloud-Native Application Protection Platform)** is the modern integrated platform combining CSPM + CWPP + container image scanning + IaC (Infrastructure as Code) scanning + identity governance into a single tool. The trap is conflating CSPM (configuration drift) with CWPP (runtime protection).

### FedRAMP

A specific compliance framework. **FedRAMP (Federal Risk and Authorization Management Program)** standardizes the security authorization process for cloud services used by U.S. federal agencies. Cloud providers achieve authorization at one of three impact levels: **Low** (limited adverse effect on operations, public/non-sensitive data), **Moderate** (serious adverse effect, controlled unclassified information — about 80% of authorizations), or **High** (severe/catastrophic effect, most sensitive non-classified data). Authorization paths: **JAB ATO** (Joint Authorization Board, government-wide reuse) or **Agency ATO** (single agency authorization that can be inherited by other agencies). FedRAMP uses NIST SP 800-53 controls tailored by FIPS 199 impact level.

### ISO 27017 and ISO 27018

Cloud-specific extensions to ISO 27001. **ISO/IEC 27017** provides cloud-specific implementation guidance for CSPs and customers, extending ISO 27001 with seven additional cloud controls covering shared responsibilities, VM hardening, and asset removal. **ISO/IEC 27018** focuses on protection of personally identifiable information (PII) in public clouds — addresses consent, purpose limitation, data minimization, and aligns with GDPR principles. Neither is a standalone certification; both are implemented within an ISO 27001 ISMS.

### Multi-tenancy risks

A specific Domain 3 topic. **Hypervisor escape** (also called VM escape) is when an attacker breaks out of a guest VM and compromises the hypervisor itself, gaining access to other VMs on the same host. Mitigation: prompt hypervisor patching, hardware-based isolation features (Intel VT-x, AMD-V), cloud provider security investments. **Side-channel attacks** exploit shared physical resources (CPU caches, branch predictors, memory access patterns) to extract information from neighboring VMs without breaking isolation. Examples: Spectre, Meltdown, Foreshadow. Mitigation: dedicated instance types, microcode updates, secure-enclave architectures.

### Cloud encryption — CMK, BYOK, HYOK

A definitional pattern. **Customer-Managed Keys (CMK)** keys are stored in the provider's KMS but managed (created, rotated, deleted) by the customer. **Bring-Your-Own-Key (BYOK)** keys are generated by the customer (often on an HSM) and imported into the provider's KMS. The provider's KMS still operates on the keys, so the provider has technical access. **Hold-Your-Own-Key (HYOK)** or external key management keeps keys entirely outside the provider's environment — the provider never holds the plaintext key. The trap is "BYOK means the provider has no access" — that's HYOK, not BYOK.

### Cloud incident response

Tier 2 topical content. Cloud incident response complications include: shared responsibility ambiguity (who investigates what), ephemeral resources (containers and serverless functions disappear before forensic collection), API-based evidence collection requirements, multi-tenancy considerations (cannot image a shared host), and provider cooperation requirements. Cloud-native incident response tools and provider-specific APIs are increasingly important. The exam emphasizes that traditional on-premises incident response procedures often do not translate directly to cloud.

### Data residency vs. data sovereignty

A definitional pattern. **Data residency** is the physical location where data is stored. **Data sovereignty** is the legal jurisdiction with authority over the data — which can apply regardless of physical location (GDPR applies to data of EU residents wherever stored). The two are related but distinct. Cloud customers must understand both: where data is physically (residency) and which laws govern it (sovereignty).

## The Trap Patterns to Inoculate Against

Six traps recur. The **shared-responsibility-misallocation** is the highest-yield miss in this family — assigning OS patching to the provider in IaaS, or treating SaaS as having no customer responsibility. The **private-cloud-equals-on-premises** trap fails because private cloud can be hosted by a third party (it's about tenancy, not location). The **community-cloud-equals-hybrid-cloud** trap conflates two distinct deployment models. The **CSPM-equals-CWPP** trap misses that CSPM is about configuration and CWPP is about workload runtime. The **BYOK-means-no-provider-access** trap fails because BYOK still places keys in the provider's KMS; HYOK is what eliminates provider key access. The **OAuth-as-cloud-authentication** trap fails because OAuth is authorization; authentication is OIDC.

## A Minimal Study Priority

In priority order: NIST SP 800-145 5+3+4 framework with definitions; the shared responsibility split for IaaS / PaaS / SaaS at each layer (hardware, hypervisor, OS, runtime, application, data, access control); CASB four pillars (Visibility, Compliance, Data Security, Threat Protection); CSPM vs. CWPP vs. CNAPP distinctions; FedRAMP impact levels (Low, Moderate, High) and authorization paths (JAB ATO vs. Agency ATO); ISO 27017 (cloud security) vs. ISO 27018 (PII in cloud); cloud encryption key models (CMK, BYOK, HYOK); multi-tenancy risks (hypervisor escape, side-channel); data residency vs. data sovereignty; common cloud misconfiguration patterns (S3 buckets, IAM policies); and Cloud Security Alliance frameworks (CCM, CSA STAR).

## What Gets Less Air Time

Specific cloud provider product names (AWS S3, Azure Blob, Google Cloud Storage) are referenced but not deeply tested. The internals of specific cloud APIs are not asked. Detailed serverless architecture (specific cold-start mechanics, function-as-a-service pricing models) is not deeply tested. Container orchestration internals (Kubernetes object model, etcd internals) are not asked at the implementation level. Specific cloud SIEM or SOAR products are never named. The detailed contents of specific FedRAMP control families are not memorized. Cloud cost optimization is not in scope.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 16 covers cloud security at a CISSP-appropriate level. The ISC2 *CCSP Official Study Guide* is the deeper reference for cloud-specific content. NIST SP 800-145 (https://csrc.nist.gov/pubs/sp/800/145/final) is the authoritative source for the cloud definition. The Cloud Security Alliance Cloud Controls Matrix (CCM) at https://cloudsecurityalliance.org/research/cloud-controls-matrix is the canonical cloud security control framework. CSA STAR program documentation is the authoritative source for cloud certification. FedRAMP documentation at https://www.fedramp.gov/ is the authoritative source for federal cloud authorization. Destination Certification's shared responsibility material at https://destcert.com/resources/shared-responsibility-model/ is the most efficient visual review of the responsibility split.

Sources used to compile this README:

- [NIST SP 800-145 — The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final)
- [NIST SP 800-145 PDF Full Text](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-145.pdf)
- [Destination Certification — Shared Responsibility Model](https://destcert.com/resources/shared-responsibility-model/)
- [Destination Certification — Cloud Controls Matrix](https://destcert.com/resources/cloud-control-matrix-ccm/)
- [Destination Certification — Data Sovereignty vs Data Residency](https://destcert.com/resources/data-sovereignty-vs-data-residency/)
- [Microsoft — Shared Responsibility in the Cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
- [TechTarget — Cloud Shared Responsibility for IaaS PaaS SaaS](https://www.techtarget.com/searchcloudcomputing/feature/The-cloud-shared-responsibility-model-for-IaaS-PaaS-and-SaaS)
- [Cloud Security Alliance — Cloud Controls Matrix](https://cloudsecurityalliance.org/research/cloud-controls-matrix)
- [Cloud Security Alliance — STAR Program](https://cloudsecurityalliance.org/star)
- [Palo Alto Networks — CASB Four Pillars](https://www.paloaltonetworks.com/cyberpedia/what-is-a-casb-cloud-access-security-broker)
- [TechTarget — CNAPP vs CSPM Cloud Security Tools](https://www.techtarget.com/searchsecurity/tip/CNAPP-vs-CSPM-Comparing-cloud-security-tools)
- [Wiz Academy — What Is CSPM](https://www.wiz.io/academy/cloud-security/what-is-cloud-security-posture-management-cspm)
- [CrowdStrike — CWPP vs CSPM](https://www.crowdstrike.com/en-us/cybersecurity-101/cloud-security/cwpp-vs-cspm/)
- [Secureframe — FedRAMP Impact Levels](https://secureframe.com/hub/fedramp/impact-levels)
- [Sprinto — FedRAMP High vs Moderate vs Low](https://sprinto.com/blog/fedramp-levels/)
- [Linford — ISO 27017 Cloud Security Guide](https://linfordco.com/blog/iso-27017-cloud-security-guide/)
- [Aikido — ISO 27017 and 27018 Compliance](https://www.aikido.dev/learn/compliance/compliance-frameworks/iso-27017-27018)
- [Sprinto — ISO 27017 Explained](https://sprinto.com/blog/iso-27017/)
- [IBM — Bring Your Own Key (BYOK)](https://www.ibm.com/think/topics/byok)
- [Thales — Cloud Encryption BYOK and HYOK](https://cpl.thalesgroup.com/blog/encryption/cloud-encryption-key-management-byok-hyok)
- [Threat on the Wire — Virtualization and Cloud Security Architecture](https://www.threatonthewire.com/cissp-domain-3-virtualization-cloud-security-architecture/)
- [Infosec Institute — Virtualization Security in Cloud Computing](https://www.infosecinstitute.com/resources/cloud/virtualization-security/)
