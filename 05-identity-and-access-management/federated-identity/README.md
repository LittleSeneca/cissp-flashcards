---
tier: 2
exam_weight: 13%
---

# Federated Identity and Third-Party ID

## Exam Relevance
Identity and Access Management (Domain 5) is a heavy-weight domain. Understanding how identity is managed in modern, multi-cloud environments via Federation, SAML, and OAuth is crucial for the exam.

## Key Concepts
- **Federation vs. SSO**: SSO is about one login for many apps *within* a domain. Federation is about one login *across* domains (e.g., using your corporate login for a third-party SaaS).
- **SAML (The Enterprise Choice)**:
  - Uses XML.
  - Roles: IdP (Identity Provider) and SP (Service Provider / Relying Party).
  - Use case: Corporate SSO for web applications.
- **OAuth 2.0 & OIDC (The Web Choice)**:
  - **OAuth 2.0**: Authorization only (Access Tokens).
  - **OpenID Connect (OIDC)**: Authentication on top of OAuth (ID Tokens).
  - Uses JSON/JWT.
- **Provisioning**:
  - **JIT**: Create accounts on the fly when first needed.
  - **SCIM**: Protocol for automated provisioning/deprovisioning of users across systems.

## Exam Traps
- **Authentication vs Authorization**: SAML can do both. OAuth 2.0 is *strictly* Authorization. OIDC adds Authentication to OAuth.
- **XML vs JSON**: SAML = XML; OAuth/OIDC = JSON.
- **Relying Party**: Be comfortable with the terms; a "Service Provider" in SAML is a "Relying Party" in OIDC.
