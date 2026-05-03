---
tier: 2
exam_weight: 10%
---

# Privacy Protection and Compliance (Domain 2.3)

This section covers the protection of personal data (PII/PHI) and the legal/regulatory frameworks that govern it.

## Key Concepts

### 1. Data Types
* **PII (Personally Identifiable Information)**: Any data that can identify an individual.
* **PHI (Protected Health Information)**: Medical data linked to an individual (HIPAA).
* **Sensitive PII**: Biometrics, SSNs, financial info, religious/political affiliations.

### 2. Privacy Principles (OECD/GDPR)
* **Lawfulness, Fairness, and Transparency**: Openness about processing.
* **Purpose Limitation**: Only use data for the stated reason.
* **Data Minimization**: Only collect what is needed.
* **Storage Limitation**: Only keep data as long as necessary.
* **Accountability**: The Controller must demonstrate compliance.

### 3. De-identification Techniques
* **Anonymization**: Irreversible removal of identifiers.
* **Pseudonymization**: Replacing identifiers with aliases; reversible with a key.
* **Tokenization**: Replacing sensitive data with a non-sensitive surrogate (PCI DSS).
* **Data Masking**: Obfuscating data (e.g., for testing).
* **Differential Privacy**: Adding statistical noise to protect individual records.

### 4. Privacy Models
* **k-anonymity**: Records are indistinguishable from at least k-1 others.
* **l-diversity**: Ensures sensitive attributes have enough variety.
* **t-closeness**: Ensures distribution of sensitive attributes matches the whole population.

## Major Regulations
* **GDPR (EU)**: Global standard for data protection. Rights include Access, Erasure, Portability.
* **HIPAA (US)**: Healthcare data protection (Privacy and Security Rules).
* **GLBA (US)**: Financial data protection for customers.
* **COPPA (US)**: Online privacy for children under 13.
* **CCPA/CPRA (California)**: Comprehensive US state-level privacy law.

## Critical Risks
* **Aggregation**: Combining data to reveal more sensitive info.
* **Inference**: Deducing new info from existing datasets.
* **Data Residency**: Legal requirements for where data is physically stored.
