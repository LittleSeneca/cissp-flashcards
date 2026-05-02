# Network Security Fundamentals for the CISSP Exam

> **Tier:** 2  
> **Domain:** Communication and Network Security (Domain 4)  
> **Exam Weight:** ~13%  
> **Status:** Built

A study-oriented overview of the network security question family on the CISSP. This is Domain 4 (Communication and Network Security), one of the core technical domains, weighted at roughly 13% of the exam. Use alongside `network-security.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 4 carries roughly 13% of the exam. The questions here trend more technical than the management-flavored content elsewhere on the CISSP, so candidates with a networking background often find this domain easier than Domain 1 or Domain 7, while candidates from a governance or audit background find it the hardest. The OSI model, TCP/IP, firewall types, VPN architecture, wireless security generations, and IDS/IPS placement are the workhorse topics. Expect at least four or five questions hitting these concepts — sometimes asking for direct identification, sometimes embedding them in scenario-based "what's the right control?" questions.

## The Question Patterns That Actually Show Up

### OSI layer identification

The most predictable pattern. You'll be given a protocol, device, or attack and asked which OSI layer it belongs to. The seven layers — Physical, Data Link, Network, Transport, Session, Presentation, Application — and the canonical mnemonic "Please Do Not Throw Sausage Pizza Away" anchor every answer. Devices map cleanly to layers: hubs and cabling at L1, switches and bridges at L2, routers at L3, transport-layer load balancers at L4, application gateways and WAFs at L7. Protocol mapping matters: ARP and Ethernet at L2; IP, ICMP, IGMP at L3; TCP and UDP at L4; DNS, HTTP, SMTP, FTP, SSH at L7. The trap is putting DNS at L4 (it's L7) or ARP at L3 (it's L2). The TCP/IP four-layer model — Link, Internet, Transport, Application — collapses several OSI layers and is sometimes tested as a comparison.

### TCP vs. UDP

A definitional pattern with high frequency. TCP is connection-oriented, reliable, ordered, with a three-way handshake (SYN, SYN-ACK, ACK) and four-way close. Use cases that depend on guaranteed delivery — web traffic, email, file transfer, SSH — use TCP. UDP is connectionless, best-effort, no handshake, no retransmission. Use cases that prioritize speed over reliability — VoIP, video streaming, DNS queries, real-time gaming — use UDP. The trap is selecting TCP when the scenario emphasizes "real-time" or "low latency" (those imply UDP), or selecting UDP when the scenario emphasizes "guaranteed delivery" or "ordered."

### Firewall types and topology

Firewalls are tested both by type and by placement. Packet-filtering firewalls are stateless and inspect headers only — basic but fast. Stateful inspection firewalls track connection state and automatically allow return traffic. Application-layer (proxy) firewalls inspect at L7 and understand specific protocols. Next-Generation Firewalls (NGFWs) add deep packet inspection, intrusion prevention, and application awareness. Web Application Firewalls (WAFs) sit at L7 specifically for web applications, defending against SQL injection, XSS, and similar attacks. The screened subnet (DMZ) topology — two firewalls separating internet, DMZ, and internal network — is the canonical secure architecture. Bastion hosts are hardened, single-purpose machines exposed to untrusted networks. The trap is conflating stateful with application-aware (stateful tracks connections; only application-layer or NGFW understands content) or selecting packet-filtering when SQL injection protection is needed (you need a WAF or NGFW).

### VPN types and IPsec

A reliably tested topic. IPsec runs at L3, IKE handles key exchange in two phases (Phase 1 establishes the secure channel for negotiation; Phase 2 negotiates the IPsec SAs for actual data protection). Authentication Header (AH) provides integrity and authentication only; Encapsulating Security Payload (ESP) provides confidentiality plus integrity and authentication. Transport mode encrypts only the payload, leaving original IP headers intact (host-to-host); tunnel mode encapsulates the entire original packet in a new IP header (site-to-site VPN). SSL/TLS VPNs operate at higher layers and are common for remote access. The trap is "AH provides encryption" — it doesn't, only ESP does — or "site-to-site uses transport mode" — it usually uses tunnel mode.

### Wireless security generations

Tested as a recognition pattern. WEP (1997) used RC4 with a 64- or 128-bit key and is fundamentally broken (IV reuse). WPA (2003) used TKIP as a transitional fix. WPA2 (2004) introduced AES-CCMP and was the standard until WPA3 (2018). WPA3 uses Simultaneous Authentication of Equals (SAE, also called Dragonfly) for Personal mode, providing forward secrecy, and offers a 192-bit option for Enterprise mode. The trap is "WPA uses AES" (it uses TKIP; WPA2 uses AES) or treating WEP as just "less secure" rather than fundamentally broken.

### 802.1X and EAP

Port-based network access control. 802.1X uses three roles — supplicant (the client), authenticator (the switch/AP), authentication server (typically RADIUS) — and EAP as the authentication protocol. Common EAP methods: EAP-TLS (mutual certificates, strongest), PEAP (server certificate plus tunneled inner authentication), EAP-TTLS (similar to PEAP). Used in WPA2/WPA3 Enterprise to authenticate users against an enterprise directory. The trap is treating 802.1X as wireless-specific — it works equally on wired ports.

### IDS vs. IPS

A definitional pattern. IDS (Intrusion Detection System) detects and alerts but does not block. IPS (Intrusion Prevention System) detects and actively blocks. NIDS monitors a network segment; HIDS monitors a single host. Signature-based detection matches known attack patterns; anomaly-based (behavior-based) flags deviations from a learned baseline. IDS is typically deployed on a SPAN/mirror port and cannot be bypassed if it fails; IPS is in-line and can fail-open or fail-closed depending on configuration. The trap is choosing IDS when the question emphasizes prevention, or assuming IPS has zero risk of blocking legitimate traffic — false positives in an in-line IPS are operationally costly.

### DNS security

DNSSEC validates DNS responses through cryptographic signatures, defending against cache poisoning. It does NOT encrypt queries — that's DoH (DNS over HTTPS, port 443) and DoT (DNS over TLS, port 853). The trap is treating DNSSEC and DoH as interchangeable or claiming DNSSEC encrypts.

### Email security

SPF lists IP addresses authorized to send mail for a domain. DKIM cryptographically signs messages so recipients can verify the message wasn't altered and originated from an authorized sender. DMARC builds on SPF and DKIM by publishing a policy (none, quarantine, reject) for what to do with failures and providing reporting back to the domain owner. The trap is assigning the wrong function to each — SPF is sender IP, DKIM is signature, DMARC is policy.

### Common ports

Worth memorizing for direct-recall questions. SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, HTTPS 443, POP3 110, IMAP 143, SNMP 161, LDAP 389, LDAPS 636, RDP 3389, SQL 1433/3306/5432, Syslog 514. The trap is mixing UDP-only and TCP-only services or confusing SMTP submission ports.

## The Trap Patterns to Inoculate Against

Six traps recur. The **OSI-layer-misplacement** trap is the most common — protocols like DNS, ARP, ICMP get placed at the wrong layer. The **TCP-vs-UDP-use-case-swap** appears whenever the scenario emphasizes real-time or guaranteed delivery; read for which property is being optimized. The **wireless-security-generation-confusion** offers WPA-with-AES (wrong; WPA used TKIP) or WEP-with-128-bit-key-as-secure (wrong; the math is broken regardless of key length). The **AH-provides-encryption** distractor catches candidates who don't memorize that only ESP encrypts. The **IDS-vs-IPS-action** distractor offers IDS as the answer when the scenario implies blocking. The **DNSSEC-encrypts** distractor confuses signing for encrypting; DNSSEC validates, DoH/DoT encrypt.

## A Minimal Study Priority

In priority order: the OSI layers with their mnemonic and protocol/device mapping; the TCP three-way handshake and TCP-vs-UDP distinction; the four firewall types (packet-filtering, stateful, application-layer, NGFW, WAF) with use cases; the screened subnet (DMZ) topology; IPsec components (IKE phases, AH vs. ESP, transport vs. tunnel mode); the wireless security generations (WEP/WPA/WPA2/WPA3) with algorithms; the 802.1X / EAP-TLS / PEAP framework; IDS vs. IPS and signature-based vs. anomaly-based detection; DNSSEC vs. DoH vs. DoT; SPF/DKIM/DMARC functions; and the canonical port number list.

## What Gets Less Air Time

Specific RFC numbers are not asked. The internals of routing protocols (BGP, OSPF, EIGRP) are not deeply tested. Detailed packet structure (TCP header field lengths, IP header options) is not asked. Specific vendor products (Cisco ASA, Palo Alto, Fortinet) are never named. IPv6 addressing internals (link-local, multicast scopes) appear at recognition level only. Software-defined networking (SDN) and network function virtualization (NFV) are mentioned but not deeply tested. Satellite and cellular network internals are out of scope at the CISSP level.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapters 11 and 12 are the comprehensive references. Destination Certification's Domain 4 collection at https://destcert.com/resources/cissp-domain-4-communication-and-network-security/ is the most efficient visual review and includes the OSI mapping, firewall types, and wireless security generations. CISSPrep's OSI Model page at https://cissprep.net/the-osi-model/ is a clean walkthrough. The IETF RFC pages for TCP (RFC 9293), UDP (RFC 768), and IPsec (RFCs 4301-4309) are the authoritative source for protocol mechanics. NIST SP 800-41 (firewalls) and SP 800-77 (IPsec VPNs) are the authoritative architecture references. Cloudflare's learning center at https://www.cloudflare.com/learning/ is consistently good plain-English plumbing.

Sources used to compile this README:

- [Destination Certification — CISSP Domain 4 Guide](https://destcert.com/resources/cissp-domain-4-communication-and-network-security/)
- [Destination Certification — Firewall Types and Architectures](https://destcert.com/resources/firewall-types-architectures/)
- [Destination Certification — OSI Model MindMap](https://destcert.com/resources/osi-model-mindmap-cissp-domain-4/)
- [Destination Certification — Network Segmentation](https://destcert.com/resources/network-segmentation-security/)
- [Destination Certification — Securing Wireless Networks](https://destcert.com/resources/securing-wireless-networks/)
- [Destination Certification — Remote Access MindMap](https://destcert.com/resources/remote-access-mindmap-cissp-domain-4/)
- [CISSPrep — The OSI Model](https://cissprep.net/the-osi-model/)
- [CISSPrep — Domain 4 Concepts and Terms](https://cissprep.net/domain-4-concepts-and-terms/)
- [Balanced Security — Understanding CISSP Domain 4 (Part 1)](https://blog.balancedsec.com/p/understanding-cissp-domain-4-communication)
- [ExamCollection — IPsec Demystified](https://www.examcollection.com/blog/ipsec-demystified-a-cissp-candidates-guide/)
- [Threat on the Wire — NAC and VPN Remote Connectivity](https://www.threatonthewire.com/cissp-domain-4-network-access-control-vpn-remote-connectivity/)
- [Cloudflare — SYN Flood DDoS Attack](https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/)
- [Cloudflare — DMARC, DKIM, and SPF](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)
- [Cloudflare — DNS over TLS](https://www.cloudflare.com/learning/dns/dns-over-tls/)
- [Check Point — NGFW vs WAF](https://www.checkpoint.com/cyber-hub/cloud-security/what-is-web-application-firewall/ngfw-vs-waf/)
- [Splunk — Intrusion Detection Systems Overview](https://www.splunk.com/en_us/blog/learn/ids-intrusion-detection-systems.html)
- [Trellix — IDS vs IPS Key Differences](https://www.trellix.com/security-awareness/network/ids-vs-ips-key-differences-explained/)
- [NetAlly — 802.1X and EAP Types](https://www.netally.com/knowledgebase/802-1x-authentication-eap-types/)
- [SecureW2 — EAP-TLS Authentication Flow](https://securew2.com/blog/802-1x-eap-tls-authentication-flow-explained)
- [ThorTeaches — Network Access Control](https://thorteaches.com/glossary/network-access-control-nac/)
- [Portnox — WPA3 vs WPA2](https://www.portnox.com/cybersecurity-101/network-security/wpa3/)
- [Vercara — DNSSEC vs Encrypted DNS](https://vercara.digicert.com/resources/what-is-the-difference-between-dnssec-vs-dns-dot-and-doh)
- [RedHat — Replace Telnet/FTP with SSH/SFTP](https://www.redhat.com/sysadmin/replace-telnet-ssh-ftp-sftp)
