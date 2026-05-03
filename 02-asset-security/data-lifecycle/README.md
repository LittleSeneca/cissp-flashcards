---
tier: 2
exam_weight: "10%"
---

# Data Lifecycle and Sanitization (Domain 2.2)

This section covers the management of data throughout its entire lifecycle and the technical methods for protection and disposal.

## The Data Lifecycle
1. **Create**: Generation or acquisition of data. (Labeling starts here).
2. **Store**: Data at rest. (Encryption, physical security).
3. **Use**: Data in memory/active processing. (Enclaves, masking).
4. **Share**: Data in transit. (TLS, DLP, CASB).
5. **Archive**: Long-term storage. (Media/format obsolescence).
6. **Destroy**: Final sanitization. (NIST 800-88).

## Key Technologies
* **DLP (Data Loss Prevention)**: Monitors and blocks unauthorized data transfers (Transit, Rest, Endpoint).
* **IRM (Information Rights Management)**: Persistent, file-level usage controls.
* **CASB (Cloud Access Security Broker)**: Visibility and control for cloud-based data.
* **HSM (Hardware Security Module)**: Secure management and storage of encryption keys.

## Media Sanitization (NIST 800-88)
* **Clearing**: Software-based overwriting. Protects against simple recovery.
* **Purging**: Advanced methods (Secure Erase, Degaussing). Protects against laboratory-level recovery.
* **Destruction**: Physical destruction (Shredding, Incineration). Particle size matters for high-security media.
* **Cryptographic Erasure (Crypto-shredding)**: Deleting encryption keys. Essential for cloud environments.

## Critical Notes
* **Data Remanence**: The residual data left on media after erasure.
* **Legal Hold**: Suspends normal retention/destruction during litigation.
* **SSD Sanitization**: Overwriting is less effective due to wear-leveling; Purging or Destruction is preferred.
