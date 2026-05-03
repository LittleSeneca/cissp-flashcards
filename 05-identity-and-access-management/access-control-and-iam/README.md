---
tier: 1
exam_weight: "~13%"
---

# Access Control Models & IAM Workflow for the CISSP Exam


A study-oriented overview of the access control and IAM question family on the CISSP. This is the dominant content area inside Domain 5 (Identity and Access Management), one of the most heavily tested domains on the 2026 exam. Use alongside `access-control-and-iam.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 5 carries roughly 13% of the exam under ISC2's official outline, and within that domain access control models, the AAA framework, federation protocols, and Kerberos are the highest-frequency content. The 2024 outline refresh (still current for 2026) introduced explicit coverage of non-human identities — service accounts, AI agents, automated workloads — but the bulk of the question pool still centers on the classical access control models, biometric metrics, and the SAML/OAuth/OIDC trio. Several prep providers describe Domain 5 as "the most tested area" of the new exam form, which makes this the family with the highest leverage per hour of study.

## The Question Patterns That Actually Show Up

### Access control model identification

The single most common pattern. You'll be given a scenario describing how access decisions are made in some organization and asked to identify the model. DAC means the resource owner controls who has access (typical of file systems and small-team collaboration). MAC means access is enforced by administrators based on classification labels and clearances (typical of military, intelligence, government). RBAC grants access based on assigned roles ("the nurse role can read patient records"). ABAC evaluates a policy combining user attributes, resource attributes, and environmental attributes ("nurses can read records of patients on their assigned ward, during their shift, from inside the hospital network"). RuBAC layers conditional rules on top of a base model ("access only between 9am and 5pm"). The most reliable trap is conflating RBAC with RuBAC — role-based vs. rule-based — because the words sound nearly identical.

### Bell-LaPadula vs. Biba

A second-tier-frequency pattern that carries a specific memorization burden. Bell-LaPadula is the confidentiality model: no read up (Simple Security Property) and no write down (Star Property). Biba is the integrity model and inverts both: no read down and no write up. The mnemonic that survives in every prep guide is that Bell-LaPadula protects secrets from leaking down to the cleared-but-not-need-to-know, while Biba protects high-integrity data from being polluted by low-integrity inputs. The trap is mixing up which direction goes with which property — examiners deliberately rotate the axis.

### Authentication factors and MFA composition

You will see at least one question about what counts as multifactor authentication. The canonical CISSP factors are Type 1 (something you know — password, PIN), Type 2 (something you have — token, smart card), and Type 3 (something you are — biometric). Type 4 (somewhere you are — IP, geolocation) and Type 5 (something you do — keystroke dynamics, signature) appear in some prep materials but are NOT canonical in the ISC2 CBK and are routinely used as wrong-answer distractors. True MFA combines factors from different categories; a password and a PIN are both Type 1 and do not constitute MFA.

### Biometric metrics

A small but reliable corner of the family. False Acceptance Rate (FAR, Type II error) is the rate at which an impostor is wrongly admitted — the security failure. False Rejection Rate (FRR, Type I error) is the rate at which a legitimate user is wrongly denied — the usability failure. Crossover Error Rate (CER), also called Equal Error Rate (EER), is the threshold at which FAR equals FRR and is the standard single-number measure of biometric accuracy. Lower CER means a more accurate system. FAR and FRR are inversely related through the matching threshold — tightening one loosens the other.

### Kerberos workflow

Expect a sequence question. The Key Distribution Center (KDC) is composed of an Authentication Server (AS) and a Ticket-Granting Server (TGS). The flow is: client authenticates to AS and receives a Ticket-Granting Ticket (TGT) plus a session key; client presents TGT to TGS to request a service ticket; client presents service ticket plus an authenticator (timestamp encrypted with the session key) to the target service. Timestamps prevent replay attacks. The KDC is a single point of failure — compromising it compromises the entire domain. Kerberos never transmits passwords across the network.

### SAML vs. OAuth 2.0 vs. OpenID Connect

The federation trio is the single highest-yield topic in this family because the protocols are easy to confuse. SAML is XML-based and used predominantly for enterprise web SSO — an Identity Provider (IdP) issues a signed assertion that a Service Provider (SP) consumes. OAuth 2.0 is an authorization framework — it lets an application access a user's data on a third-party service without that user sharing their password. OAuth 2.0 alone does NOT do authentication. OpenID Connect (OIDC) is a thin authentication layer built on top of OAuth 2.0; it adds an ID token so an app can verify who the user is. The trap is "an application needs to verify a user's identity" being answered with OAuth instead of OIDC.

### Identity lifecycle

Provisioning, access review (recertification), and deprovisioning. Provisioning creates accounts and assigns initial permissions, ideally automated and based on role. Access review or recertification is the periodic check that existing access still matches current job requirements — managers attest that their reports' access is appropriate. Deprovisioning removes access when someone leaves or changes roles. The trap is conflating recertification with provisioning, or assuming that a deprovisioning event is the same as account deletion.

### Access principles

Least privilege, separation of duties, and need-to-know are tested as a triad that examiners like to play against each other. Least privilege means users get the minimum permissions necessary to do their job. Separation of duties means critical tasks are split among multiple people so no single person can complete a fraud-enabling chain (the approver is not the executor). Need-to-know means access is restricted to information required for the specific function, even within an authorized clearance level — an officer with Top Secret clearance does not see every Top Secret document, only those relevant to their role.

### Privileged Access Management and Just-in-Time access

Increasingly emphasized on the 2024+ outline. PAM controls, monitors, and audits privileged accounts (root, administrator, domain admin, service accounts) typically through credential vaulting, session recording, approval workflows, and behavioral analytics. JIT access grants time-limited elevated permissions only when needed for a specific task and revokes them automatically — minimizing standing privilege and shrinking the attack surface. The exam-prep canon increasingly treats JIT as the modern best practice that supersedes always-on admin rights.

### Zero Trust

Conceptually simple, frequently tested. The principle is "never trust, always verify" — no implicit trust based on network location, every access decision evaluated against current context (device posture, user behavior, threat intel), microsegmentation rather than flat networks, continuous verification rather than one-time login. NIST SP 800-207 is the source document. Domain 5 questions on Zero Trust focus on the identity verification components; Domain 3 questions cover the architectural pieces.

## The Trap Patterns to Inoculate Against

Five traps appear with high reliability. The **OAuth-vs-OIDC swap** is the highest-yield miss — if the scenario is about identity verification, the answer is OIDC, not OAuth. The **Bell-LaPadula-vs-Biba inversion** is the second — when the question is about protecting integrity, it's Biba (no read down, no write up); when about confidentiality, Bell-LaPadula (no read up, no write down). The **RBAC-vs-RuBAC confusion** trips candidates whenever the scenario adds a conditional like time-of-day or location — that's RuBAC or ABAC, not pure RBAC. The **Type 4 / Type 5 distractor** appears when the question lists factor categories and expects you to know that "somewhere you are" and "something you do" are not canonical ISC2 factors. The **Kerberos-passwords-in-cleartext distractor** appears in "what is a Kerberos weakness" questions — Kerberos does not transmit passwords; the actual weakness is the KDC as single point of failure plus susceptibility to ticket-replay if timestamps are mishandled.

## A Minimal Study Priority

In priority order: the four core access control models (DAC/MAC/RBAC/ABAC) with one-line scenario tells; Bell-LaPadula and Biba rules and which protects what; the three authentication factor categories and what makes a true MFA combination; the FAR/FRR/CER triad and which is which kind of error; the Kerberos workflow with KDC, AS, TGS, TGT, and service ticket roles; the SAML/OAuth/OIDC distinction and what each is FOR; the identity lifecycle phases (provisioning, recertification, deprovisioning); the least-privilege/separation-of-duties/need-to-know triad with one-line distinctions; the PAM/JIT modernization framing; and the Zero Trust core tenets.

## What Gets Less Air Time

Specific RFC numbers for SAML or OAuth versions are not asked. The internals of cryptographic operations inside Kerberos (which key encrypts which ticket field) are conceptually tested but not algorithmically. Clark-Wilson and Brewer-Nash (Chinese Wall) models appear as occasional distractors but rarely as the primary subject of a question. Specific ABAC policy syntax (XACML) is not tested. Adaptive / risk-based access control is increasingly relevant but still Tier 3 on the current exam. Specific commercial PAM products (CyberArk, BeyondTrust) are never named.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapters 13–14 are the comprehensive reference. Destination Certification's Domain 5 IAM page at https://destcert.com/resources/cissp-domain-5-identity-and-access-management-iam/ is the most efficient visual review and includes the model rules and federation comparisons. CISSPrep's Domain 5 collection at https://cissprep.net/domain-5-identity-and-access-management/ is a strong free overview. The ISC2 community Kerberos discussion thread and Microsoft's authentication flow documentation are the clearest workflow references. NIST SP 800-63 (digital identity guidelines), SP 800-162 (ABAC), and SP 800-207 (Zero Trust) are the underlying authoritative sources for the modern material.

Sources used to compile this README:

- [Destination Certification — CISSP Domain 5: Identity & Access Management](https://destcert.com/resources/cissp-domain-5-identity-and-access-management-iam/)
- [Destination Certification — Information Security Models](https://destcert.com/resources/information-security-models/)
- [Destination Certification — Authorization Models (RBAC, MAC, DAC, ABAC)](https://destcert.com/resources/authorization-network-security/)
- [Destination Certification — Authentication Methods](https://destcert.com/resources/authentication-methods/)
- [Destination Certification — Single Sign-On (SSO) and SAML](https://destcert.com/resources/single-sign-on-sso/)
- [Destination Certification — Identity Lifecycle Management](https://destcert.com/resources/identity-lifecycle-management/)
- [CISSPrep — Domain 5: Identity and Access Management](https://cissprep.net/domain-5-identity-and-access-management/)
- [CISSPrep — Access Control Systems, MFA, and Biometrics](https://cissprep.net/access-control-systems-multifactor-authentication-and-biometrics/)
- [CISSPrep — Federation and SAML](https://cissprep.net/federation-and-saml/)
- [ThorTeaches — IAAA (Identification, Authentication, Authorization, Accountability)](https://thorteaches.com/cissp-iaaa/)
- [ThorTeaches — Crossover Error Rate (CER)](https://thorteaches.com/glossary/crossover-error-rate-cer/)
- [ThorTeaches — Rule-Based Access Control](https://thorteaches.com/glossary/rule-based-access-control-rbac/)
- [ThorTeaches — Pass-the-Hash](https://thorteaches.com/glossary/pass-the-hash/)
- [Okta — OAuth, OIDC, and SAML Differences](https://www.okta.com/identity-101/whats-the-difference-between-oauth-openid-connect-and-saml/)
- [Okta — Role-Based vs Attribute-Based Access Control](https://www.okta.com/identity-101/role-based-access-control-vs-attribute-based-access-control/)
- [Splunk — RBAC vs ABAC](https://www.splunk.com/en_us/blog/learn/rbac-vs-abac.html)
- [Microsoft — Kerberos Authentication Flow](https://techcommunity.microsoft.com/blog/sqlserversupport/kerberos-authentication-flow/4387781)
- [UConn IAM — The Kerberos Protocol Explained](https://iam.uconn.edu/the-kerberos-protocol-explained/)
- [Inventive HQ — Biometric Authentication FAR/FRR/CER](https://inventivehq.com/blog/biometric-authentication-far-frr-cer-guide/)
- [Microsoft — Privileged Access Management Overview](https://www.microsoft.com/en-us/security/business/security-101/what-is-privileged-access-management-pam)
- [Palo Alto Networks — Just-in-Time Access](https://www.paloaltonetworks.com/cyberpedia/what-is-just-in-time-access-jit)
- [ISC2 Insights — Zero Trust Building a Resilient Cybersecurity Framework](https://www.isc2.org/Insights/2024/05/Zero-Trust-Building-a-Resilient-Cybersecurity-Framework)
- [F5 Labs — Principle of Least Privilege](https://www.f5.com/labs/articles/what-is-the-principle-of-least-privilege-and-why-is-it-important)
- [Dummies — Common Access Control Models](https://www.dummies.com/article/academics-the-arts/study-skills-test-prep/cissp/common-access-control-models-know-cissp-exam-254875/)
