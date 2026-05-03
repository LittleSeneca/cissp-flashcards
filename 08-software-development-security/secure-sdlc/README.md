---
tier: 2
exam_weight: 10%
---

# Secure SDLC & OWASP for the CISSP Exam

> **Tier:** 2  
> **Domain:** Software Development Security (Domain 8)  
> **Exam Weight:** ~10%  
> **Status:** Built

A study-oriented overview of the secure SDLC and OWASP question family on the CISSP. This is Domain 8 (Software Development Security), weighted at roughly 10% of the exam. Use alongside `secure-sdlc.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 8 carries roughly 10% of the exam. The high-frequency content centers on three areas: the SDLC phases and which security activities belong in each, the OWASP Top 10 (2021 edition is current), and secure coding principles applied to specific vulnerabilities (especially SQL injection, XSS, CSRF, and insecure deserialization). Software security maturity models (BSIMM, OWASP SAMM), DevSecOps and shift-left, and the API/supply-chain security topics fill out the Tier 2 layer. The 2024 outline added explicit emphasis on software supply chain risk (post-SolarWinds) and software bills of materials (SBOM).

## The Question Patterns That Actually Show Up

### SDLC phase and security activity alignment

The most predictable pattern. Each SDLC phase has associated security activities and exam writers test whether you can place an activity in the right phase. **Requirements**: define security objectives, regulatory requirements, threat landscape, and acceptance criteria. **Design**: threat modeling (STRIDE/PASTA), security architecture review, reference architecture selection, trust boundary identification. **Development**: secure coding standards, IDE-integrated SAST, code review (Fagan or peer review), pre-commit hooks. **Testing**: DAST, IAST, fuzz testing, penetration testing, security regression. **Deployment**: hardening baselines, configuration verification, signed artifacts, change management. **Operations/Maintenance**: patch management, vulnerability monitoring, log analysis, incident response. **Disposal**: secure decommissioning, data sanitization, certificate revocation.

The trap is misplacing activities — putting threat modeling in testing (it belongs in design), running DAST during development (the application isn't running yet), or treating deployment as the "we're done" milestone (operations and maintenance carry ongoing security responsibility).

### OWASP Top 10 (2021)

A high-frequency pattern. The current Top 10 in order:

- **A01 Broken Access Control** — authorization failures, IDOR, missing access checks. Defense: least privilege, RBAC, deny by default, server-side enforcement.
- **A02 Cryptographic Failures** — weak/missing encryption, deprecated algorithms, hardcoded keys. Defense: TLS 1.2+, strong ciphers, proper key management, never store secrets in code.
- **A03 Injection** — SQL injection, command injection, LDAP injection. Defense: parameterized queries / prepared statements, input allowlisting, output encoding.
- **A04 Insecure Design** — missing threat modeling, no secure design patterns. Defense: threat modeling in design phase, OWASP ASVS compliance, reference architectures.
- **A05 Security Misconfiguration** — default credentials, unnecessary services, missing security headers. Defense: hardening baselines, principle of least functionality.
- **A06 Vulnerable and Outdated Components** — known CVEs in libraries. Defense: SBOM, dependency scanning (Snyk, Dependabot), patch management.
- **A07 Identification and Authentication Failures** — weak passwords, credential stuffing, session fixation. Defense: MFA, secure password hashing (bcrypt/Argon2), session invalidation.
- **A08 Software and Data Integrity Failures** — unsigned updates, malicious dependencies, insecure CI/CD. Defense: code signing, signed dependencies, supply chain integrity (SLSA framework).
- **A09 Security Logging and Monitoring Failures** — insufficient audit trails, missing alerts. Defense: centralized logging, alerting on critical events, SIEM integration.
- **A10 Server-Side Request Forgery (SSRF)** — application fetches remote resources without validation. Defense: allowlist validation, disable unused protocols, network segmentation.

The trap is misplacing a vulnerability into the wrong category — a hardcoded database password is A05 (Security Misconfiguration), not A02 (Cryptographic Failures).

### Specific vulnerability patterns

A scenario-driven pattern. Each major web vulnerability has a canonical defense, and exam questions test whether you know it.

**SQL injection** — concatenated SQL with user input. Primary defense: **parameterized queries / prepared statements** (the gold standard, separates code from data). Secondary defenses: input validation, stored procedures, ORM defaults. Input validation alone is insufficient.

**Cross-Site Scripting (XSS)** — three types: Stored (in database, served to many), Reflected (in URL, served to one), DOM-based (client-side injection without server round-trip). Primary defense: **context-appropriate output encoding** (HTML entity encoding for body, JavaScript encoding for script context, URL encoding for URLs). Secondary defense: Content Security Policy (CSP), modern framework auto-escaping (React JSX, Vue, etc.).

**Cross-Site Request Forgery (CSRF)** — attacker tricks an authenticated user into submitting a request. Defense: **anti-CSRF tokens** (unpredictable, per-request), SameSite cookie attribute, double-submit pattern.

**Server-Side Request Forgery (SSRF)** — attacker tricks the server into making requests to internal resources. Defense: **allowlist** for external requests, disable unused URL schemes, network segmentation between application servers and internal infrastructure.

**Buffer overflow** — writing beyond a buffer's bounds, corrupting adjacent memory. Defenses: bounds-checked languages or libraries, ASLR (Address Space Layout Randomization), DEP/NX (non-executable memory), stack canaries.

**Race conditions** — multiple threads or processes access shared state without proper synchronization. Defense: locking primitives (mutexes), atomic operations, immutable data, transactional semantics.

**Insecure deserialization** — untrusted serialized objects deserialized without validation, often leading to RCE. Defense: never deserialize untrusted input, use signed/encrypted serialization, enforce strict type allowlists.

### Secure coding principles

A definitional pattern. The canonical CISSP set: **input validation** (allowlist > denylist), **output encoding** (context-appropriate), **parameterized queries** (against injection), **least privilege** (at the code/process level), **fail securely** (errors don't expose info or create bypass), **defense in depth** (multiple layers), **complete mediation** (every access checked), **separation of duties** (no single point of control), **canonicalization** (normalize input before validation), and **type/length/range/format validation**.

The trap is choosing input validation alone as a SQL injection defense — parameterized queries are the gold standard, with input validation as a defense-in-depth complement.

### Software security maturity models

A definitional pattern. **BSIMM** (Building Security In Maturity Model) is **descriptive** — based on observation of what 100+ real organizations are doing. Useful for benchmarking your program against industry practice. **OWASP SAMM** (Software Assurance Maturity Model) is **prescriptive** — defines what mature software security programs should look like. Useful for building a roadmap from current state to target state. **Microsoft SDL** is Microsoft's proprietary lifecycle, which influenced many other models. The trap is calling BSIMM prescriptive — it isn't, it's observational.

### DevSecOps and shift-left

A topical pattern. **Shift-left** means moving security activities earlier in the development timeline (toward requirements and design rather than only testing and production). DevSecOps embeds security automation into CI/CD pipelines — SAST in commit hooks, dependency scanning on PR, container scanning before deployment, secrets scanning, IaC validation. The trap is treating shift-left as a replacement for later-phase security — it's additive, not substitutive.

### Software supply chain security

An emerging high-priority topic. Threats include typosquatting (malicious package with name similar to legitimate library), compromised dependencies (malicious code injected upstream), malicious maintainers, build-system compromise (SolarWinds 2020). Defenses include **SBOM** (Software Bill of Materials — an inventory of every component), **dependency scanning**, **signature verification** of artifacts, vendor due diligence, contractual security requirements, and the SLSA (Supply-chain Levels for Software Artifacts) framework. NIST SP 800-218 (SSDF) codifies these practices for federal procurement.

### Secrets management

A specific testable point. Secrets (API keys, database credentials, encryption keys) must NEVER live in source code or in environment variables that are widely visible. Use secrets vaults (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Kubernetes Secrets with encryption at rest). The trap is "environment variables are secure because they aren't in source code" — they're often visible in process listings, logs, and container configs.

## The Trap Patterns to Inoculate Against

Six traps recur. The **wrong-SDLC-phase-for-the-activity** trap is the highest-yield miss — threat modeling in testing, DAST in development, etc. The **input-validation-alone-stops-SQL-injection** trap is wrong; parameterized queries are the primary defense, validation is secondary. The **OAuth-as-authentication** trap appears in OWASP A07 questions — OAuth is authorization, OIDC adds authentication. The **environment-variables-as-secure** trap appears in secrets-management questions — env vars are often exposed; use a vault. The **BSIMM-as-prescriptive** trap appears in maturity-model questions — BSIMM is descriptive (observational), SAMM is prescriptive. The **shift-left-replaces-later-security** trap appears in DevSecOps questions — shift-left is additive, not substitutive.

## A Minimal Study Priority

In priority order: the SDLC phases and which security activities belong in each; the OWASP Top 10 (2021) categories with one-line definitions and primary defenses; the canonical defense for each major vulnerability (parameterized queries for SQLi, output encoding for XSS, CSRF tokens for CSRF, allowlists for SSRF, ASLR/DEP for buffer overflow, locking for race conditions); the secure coding principles list; threat modeling in the design phase; SAST vs. DAST and their SDLC placement; BSIMM (descriptive) vs. OWASP SAMM (prescriptive); the shift-left and DevSecOps framing; SBOM and supply chain security; and secrets management best practices.

## What Gets Less Air Time

Specific cryptographic algorithm details (covered in cryptography family) are not asked at the byte level here. Specific commercial security testing products (Veracode, Checkmarx, Snyk, Fortify) are never named on the exam. The internals of compiler-level protections (specific stack canary mechanisms, exact ASLR entropy values) are not deeply tested. Specific exploit framework details (Metasploit modules, exploitation primitives) are not tested. Mobile application security and container security appear at recognition level only. The exact composition of every BSIMM domain (Governance, Intelligence, SSDL Touchpoints, Deployment) and SAMM business function (Governance, Design, Implementation, Verification, Operations) is not deeply tested at the activity level.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapters 20 and 21 are the comprehensive references. The OWASP Top 10 2021 page at https://owasp.org/Top10/2021/ is the authoritative source for the current list. NIST SP 800-218 (Secure Software Development Framework) is the federal-procurement-relevant framework for secure development. OWASP SAMM at https://owasp.org/www-project-samm/ and BSIMM at https://www.bsimm.com/ are the authoritative sources for the maturity models. Destination Certification's Domain 8 collection at https://destcert.com/resources/cissp-domain-8-software-development-security/ is the most efficient visual review. CISSPrep's Software Development Lifecycle page at https://cissprep.net/software-development-lifecycle-sdlc/ is a strong free overview.

Sources used to compile this README:

- [OWASP Top 10:2021 — Official OWASP](https://owasp.org/Top10/2021/)
- [OWASP Software Assurance Maturity Model (SAMM)](https://owasp.org/www-project-samm/)
- [OWASP Secure Coding Practices Quick Reference Guide](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/02-checklist/05-checklist)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [Destination Certification — CISSP Domain 8 Software Development Security](https://destcert.com/resources/cissp-domain-8-software-development-security/)
- [CISSPrep — Software Development Lifecycle (SDLC)](https://cissprep.net/software-development-lifecycle-sdlc/)
- [Balanced Security — Understanding CISSP Domain 8](https://blog.balancedsec.com/p/understanding-cissp-domain-8-software)
- [Threat on the Wire — Secure Coding Foundations for Managers](https://www.threatonthewire.com/cissp-domain-8-secure-coding-foundations/)
- [Codific — BSIMM Complete Guide](https://codific.com/bsimm-building-security-in-maturity-model-a-complete-guide/)
- [Wentz Wu — OWASP SAMM V2](https://wentzwu.com/2020/10/12/owasp-samm-software-assurance-maturity-model-v2/)
- [Snyk — Buffer Overflow Security Analysis](https://snyk.io/articles/buffer-overflow-security-analysis/)
- [OWASP — Insecure Deserialization](https://owasp.org/www-community/vulnerabilities/Insecure_Deserialization)
- [Checkmarx — Software Supply Chain Security Guide](https://checkmarx.com/learn/supply-chain-security/software-supply-chain-security-guide/)
- [Aqua Security — SolarWinds Attack Lessons](https://www.aquasec.com/cloud-native-academy/supply-chain-security/solarwinds-attack/)
- [Security Compass — API Security Best Practices](https://www.securitycompass.com/blog/best-api-security-practices/)
- [DevSecOps School — Shift Left in DevSecOps](https://devsecopsschool.com/blog/shift-left-in-devsecops-a-comprehensive-tutorial/)
- [Sushant Katare on Medium — SQL Injection, XSS, CSRF Unmasked](https://sushantkatare.medium.com/web-app-vulnerabilities-exposed-sql-injection-xss-and-csrf-unmasked-a79b56d8dd78)
- [Northeastern Khoury CS — Five Types of Code Review](https://www.khoury.northeastern.edu/home/lieber/courses/cs4500/f07/lectures/code-review-types.pdf)
