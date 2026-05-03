---
tier: 2
exam_weight: "12%"
---

# SOC Reporting for the CISSP Exam

System and Organization Controls (SOC) reports are critical for evaluating the security of third-party service providers (e.g., Cloud, SaaS).

## SOC Report Types (The Hierarchy)

```mermaid
graph TD
    SOC1[SOC 1: Financial Controls - ICFR]
    SOC2[SOC 2: Trust Services Criteria - TSC]
    SOC3[SOC 3: Public Summary of SOC 2]

    subgraph "Trust Services Criteria (SOC 2/3)"
    S[Security: Mandatory]
    A[Availability]
    PI[Processing Integrity]
    C[Confidentiality]
    P[Privacy]
    end

    SOC2 --- S
    SOC2 --- A
    SOC2 --- PI
    SOC2 --- C
    SOC2 --- P
```

### 1. SOC 1 (SSAE 18)
-   **Focus**: Internal Control over **Financial Reporting** (ICFR).
-   **Audience**: The user's financial auditors.
-   **Use Case**: A payroll processor or a financial services firm.

### 2. SOC 2
-   **Focus**: Security, Availability, Processing Integrity, Confidentiality, and Privacy (**TSC**).
-   **Audience**: Management, regulators, and other informed parties (restricted use).
-   **Use Case**: Most cloud providers (AWS, Azure, GCP) and SaaS companies.
-   **Mandatory Criterion**: **Security** (the "Common Criteria") must always be included.

### 3. SOC 3
-   **Focus**: Same as SOC 2, but a **redacted, public-facing summary**.
-   **Audience**: General public (marketing).
-   **Use Case**: A company wants to display a "seal" on their website to show they are SOC 2 compliant without sharing sensitive details.

## Type I vs. Type II Reports

This distinction applies to both SOC 1 and SOC 2.

```mermaid
graph LR
    Type1[Type I: Design] -- "Point in Time" --> Snapshot[As of Oct 1st]
    Type2[Type II: Operating Effectiveness] -- "Period of Time" --> Range[Jan 1st to Dec 31st]
```

-   **Type I**: Evaluates the **design** of the controls at a **specific point in time**. Does the organization *have* the right controls in place?
-   **Type II**: Evaluates the **operating effectiveness** of the controls over a **period of time** (typically 6–12 months). Do the controls actually *work* consistently?

## Shared Responsibility and UCC
-   **UCC (User Control Considerations)**: Controls that the **customer** is responsible for implementing to ensure the service provider's controls are effective (e.g., "The customer must manage their own encryption keys").

## Exam Traps
-   **SOC 1 vs. SOC 2**: If the question mentions "financial reporting," choose SOC 1. If it's about "cloud security" or "data privacy," choose SOC 2.
-   **Type I vs. Type II**: Type II is always more rigorous and "better" for security assurance because it tests performance over time.
-   **SOC 3 for Details**: A SOC 3 report **never** contains detailed test results or auditor opinions; it is for marketing/public use.
