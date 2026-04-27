---
tier: 3
domain: Security Operations (Domain 7)
exam_weight: ~4-6% within Domain 7
status: built
---

# Logging, Monitoring & SIEM for the CISSP Exam

A study-oriented overview of the logging, monitoring, and SIEM question family on the CISSP. This material lives primarily in Domain 7 (Security Operations) under "Conduct logging and monitoring activities," with crossover into Domain 6 (Security Assessment and Testing) for continuous monitoring. Use alongside `logging-monitoring-siem.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 7 carries roughly 13% of the exam, and within it logging and monitoring is a reliable two-or-three-question slice. The high-frequency content centers on the log management lifecycle, what should and should not be logged, log integrity techniques, retention requirements per major regulation (PCI-DSS, HIPAA, SOX), the SIEM/SOAR/XDR distinction, and detection types (signature-based vs. anomaly-based vs. behavior-based vs. reputation-based). Threat intelligence and threat hunting appear at Tier 2.

## The Question Patterns That Actually Show Up

### Log management lifecycle

A definitional pattern. NIST SP 800-92 defines five phases: **Generation** (the log is created at the source), **Transmission** (the log is forwarded to a centralized aggregation point), **Storage** (retention with integrity controls), **Analysis** (correlation, alerting, dashboards, search), **Disposal** (secure deletion per retention policy). The architectural principle behind the lifecycle is separation: logs should not stay only on the source system, because a compromised source system can alter or delete its own logs. Forwarding to a separate aggregation point creates an integrity boundary.

### What to log and what NOT to log

A specific high-yield point. **Should be logged**: authentication successes and failures, authorization decisions (especially denials), administrative actions, configuration changes, access to sensitive data, system errors, and security-relevant events. **Should NOT be logged**: plain-text passwords, full credit card numbers (PAN), Social Security Numbers without explicit business justification, full personal data without justification, secrets and API keys, and the contents of communications that have heightened privacy expectations. The trap is logging too much sensitive content "for completeness" and creating a privacy or compliance violation.

### Log integrity techniques

A topical pattern. Common techniques include **cryptographic hashing** (each log entry's hash is included in the next entry, creating a chain that detects tampering), **write-once media** (WORM storage that cannot be modified after writing), **separation of duties** (the log analyst cannot also be the log administrator), **append-only architectures** (only adds are permitted, no modifications or deletions), and **syslog signing** (RFC 5424 supports optional signatures for transit integrity). The trap is treating encryption as integrity — encryption protects confidentiality but doesn't prevent tampering on its own.

### Retention requirements per regulation

A specific high-yield point. **PCI-DSS** requires 1 year minimum total retention with 3 months readily available (online and searchable). **HIPAA** requires 6 years for audit logs related to electronic protected health information. **SOX** requires 7 years for financial records and related audit logs. **FedRAMP** requires 90 days online (90-day-readily-available) plus offline retention per agency records management requirements (often 6+ years). The trap is treating "readily available" (PCI's 3 months online) as the total retention requirement (1 year).

### SIEM core functions

A definitional pattern. SIEM (Security Information and Event Management) combines six core functions: **Collection/ingestion** (pulling logs from many sources), **Normalization** (transforming heterogeneous formats into a common schema), **Correlation** (linking events across sources via timestamps, user IDs, IPs, asset IDs to detect patterns), **Alerting** (rule-based and threshold-based notifications), **Dashboards and reporting** (operational and compliance views), **Forensic search** (historical query for investigation). The trap is treating SIEM as just storage; it's an analysis platform.

### SIEM vs. SOAR vs. XDR

A high-yield definitional pattern. **SIEM** aggregates and analyzes logs and produces alerts. **SOAR** (Security Orchestration, Automation, and Response) takes SIEM alerts and runs automated response playbooks, integrating with ticketing, communications, and remediation tools. SOAR depends on SIEM data; it does not replace it. **XDR** (Extended Detection and Response) is a vendor-driven evolution that combines endpoint, network, identity, and cloud telemetry into a native correlation platform — often described as "SIEM done right by a single vendor." XDR does not eliminate the need for SIEM in heterogeneous environments. The trap is "SOAR replaces SIEM" or "XDR replaces SIEM" — neither is correct.

### Detection types

A definitional pattern. **Signature-based detection** matches known patterns — file hashes, IP addresses, URL strings, regular expressions for attack signatures. Effective against known threats; fails on zero-days and obfuscated variants. **Anomaly-based detection** establishes a baseline of normal behavior (usually statistical or ML-driven) and flags deviations. Better against novel threats but produces more false positives. **Behavior-based / UEBA (User and Entity Behavior Analytics)** profiles users and entities, baselines normal patterns, and flags suspicious deviations (impossible travel, unusual access times, lateral movement). Particularly effective against insider threats and compromised credentials. **Reputation-based detection** blocks based on threat-intel-driven reputation scores of IPs, domains, file hashes. The trap is selecting signature-based for a zero-day scenario.

### Threat intelligence

A topical pattern. Four levels: **Strategic** (long-term trends, geopolitical context, adversary motivations — for executives and boards), **Operational** (specific campaigns, TTPs, named threat actors — for security operations leadership), **Tactical** (attack patterns, MITRE ATT&CK techniques — for analysts and defenders), **Technical** (specific indicators of compromise like file hashes, IPs, domains — for tooling and automation). Sources: commercial feeds, ISACs, government (CISA), open-source. Standards: STIX (Structured Threat Information Expression — the data format) and TAXII (Trusted Automated eXchange of Indicator Information — the transport protocol).

### Threat hunting

A proactive search for threats that have evaded automated detection. Typically hypothesis-driven — the hunter forms a hypothesis ("attackers are using PsExec for lateral movement"), searches for evidence, analyzes findings, and converts confirmed findings into automated detection rules. Often uses MITRE ATT&CK as a navigation framework. Distinguishes from routine alert response in that hunting assumes adversaries are present and looks for stealthy activity. A growing emphasis area in modern security operations.

### Continuous monitoring

NIST SP 800-137 defines continuous monitoring as ongoing assessment of security control effectiveness, informing the Monitor step of the RMF. Continuous monitoring is the discipline; SIEM and threat intelligence are tools that support it. The trap is treating "deploying a SIEM" as equivalent to "doing continuous monitoring" — SIEM is a tool; continuous monitoring is a program with metrics, processes, and feedback loops.

### NetFlow / IPFIX vs. full packet capture

A specific Tier 2 distinction. NetFlow (Cisco-originated) and IPFIX (IETF standardization, descended from NetFlow v9) export network traffic METADATA — source/destination IP, port, protocol, bytes, flow duration. Lightweight, scales to large networks, supports anomaly detection and traffic-pattern analysis. Does NOT capture payloads. **Full packet capture** records every byte on the wire — invaluable for forensic deep-dive but storage-prohibitive at scale. Most organizations use both: flows for general visibility, full packet capture for limited high-value targets.

## The Trap Patterns to Inoculate Against

Five traps recur. The **SIEM-equals-log-management** trap fails because log management is broader (lifecycle from generation to disposal) and SIEM is the analysis layer. The **encryption-equals-integrity** trap fails because encryption protects confidentiality, not integrity — tampering with ciphertext produces invalid plaintext but doesn't always alert anyone. The **PCI-3-month-retention** trap fails because PCI requires 1 year total with 3 months readily available, not just 3 months. The **signature-detection-for-zero-days** trap fails because signature-based detection requires known patterns. The **logging-passwords-is-fine** trap fails because logging passwords (or full PANs, or unencrypted PII) creates additional exposure with no detective value.

## A Minimal Study Priority

In priority order: the five log management lifecycle phases per NIST SP 800-92; what should and should not be logged (especially the don'ts — passwords, full PAN, PII without justification); log integrity techniques (hashing, WORM, append-only, separation of duties); retention requirements (PCI 1 year + 3 months readily available, HIPAA 6 years, SOX 7 years, FedRAMP 90 days online plus offline); SIEM core functions (collection, normalization, correlation, alerting, dashboards, forensic search); SIEM vs. SOAR vs. XDR distinctions; detection types (signature, anomaly, behavior, reputation); threat intelligence types (strategic, operational, tactical, technical) and STIX/TAXII; threat hunting as proactive hypothesis-driven search; and continuous monitoring as discipline (NIST SP 800-137) vs. SIEM as tool.

## What Gets Less Air Time

Specific commercial SIEM products (Splunk, Sentinel, QRadar, Elastic, Sumo Logic) are referenced but not deeply tested. The internals of specific correlation rule languages are not asked. Detailed SOAR playbook syntax is not tested. Specific MITRE ATT&CK technique numbers (T1059, T1086) are not asked at the technique level. Specific syslog facility numbers are not memorized. The detailed contents of NIST SP 800-92 sections are not tested. Specific commercial threat intelligence feed names (Recorded Future, FireEye iSIGHT) are never asked.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 17 covers logging and monitoring. NIST SP 800-92 (Guide to Computer Security Log Management) at https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-92.pdf is the authoritative source for the log management lifecycle. NIST SP 800-137 (Information Security Continuous Monitoring) is the authoritative source for the continuous monitoring discipline. Destination Certification's logging and monitoring material at https://destcert.com/resources/logging-monitoring-mindmap-cissp-domain-6/ is the most efficient visual review. CrowdStrike's XDR vs SIEM vs SOAR explainer at https://www.crowdstrike.com/en-us/cybersecurity-101/next-gen-siem/xdr-vs-siem-vs-soar/ is the clearest treatment of those distinctions. The MITRE ATT&CK framework at https://attack.mitre.org/ is the canonical reference for threat hunting and detection engineering.

Sources used to compile this README:

- [NIST SP 800-92 — Guide to Computer Security Log Management](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-92.pdf)
- [NIST SP 800-137 — Information Security Continuous Monitoring](https://csrc.nist.gov/publications/detail/sp/800-137/final)
- [NIST SP 800-122 — Guide to Protecting the Confidentiality of PII](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-122.pdf)
- [Destination Certification — Logging and Monitoring MindMap, Domain 6](https://destcert.com/resources/logging-monitoring-mindmap-cissp-domain-6/)
- [Destination Certification — CISSP Domain 7 Security Operations](https://destcert.com/resources/cissp-domain-7-security-operations/)
- [CrowdStrike — XDR vs SIEM vs SOAR](https://www.crowdstrike.com/en-us/cybersecurity-101/next-gen-siem/xdr-vs-siem-vs-soar/)
- [Palo Alto Networks — SOAR vs SIEM vs XDR](https://www.paloaltonetworks.com/cyberpedia/what-is-soar-vs-siem-vs-xdr)
- [Netizen — Audit Log Retention Requirements](https://www.netizen.net/news/post/7735/audit-log-retention-what-pci-dss-nist-hipaa-and-fedramp-expect)
- [Observo.ai — Log Retention Requirements for Regulatory Compliance](https://observo.ai/post/log-retention-requirements-for-regulatory-compliance)
- [BreachSense — Indicators of Compromise in Threat Intelligence](https://www.breachsense.com/blog/indicators-of-compromise-in-threat-intelligence/)
- [Splunk — PEAK Hypothesis-Driven Threat Hunting](https://www.splunk.com/en_us/blog/security/peak-hypothesis-driven-threat-hunting.html)
- [Exabeam — UEBA Guide](https://www.exabeam.com/explainers/ueba/what-ueba-stands-for-and-a-5-minute-ueba-primer/)
- [Palo Alto Networks — User Entity Behavior Analytics](https://www.paloaltonetworks.com/cyberpedia/what-is-user-entity-behavior-analytics-ueba)
- [Vectra — UEBA Guide](https://www.vectra.ai/topics/user-and-entity-behavior-analytics-ueba)
- [Progress Flowmon — NetFlow and IPFIX](https://www.progress.com/flowmon/solutions/network-and-cloud-operations/netflow-ipfix)
- [DevSecOpsSchool — Immutable Logs](https://devsecopsschool.com/blog/immutable-logs/)
- [Skyflow — How to Keep Sensitive Data Out of Your Logs](https://www.skyflow.com/post/how-to-keep-sensitive-data-out-of-your-logs-nine-best-practices)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [STIX/TAXII at OASIS](https://oasis-open.github.io/cti-documentation/)
