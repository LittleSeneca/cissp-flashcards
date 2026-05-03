---
tier: 2
exam_weight: 10%
---

# DevSecOps & CI/CD Security

This section covers the integration of security into the modern software development lifecycle, focusing on automation, early detection, and the 'shared responsibility' model.

## Key Topics

### 1. Shift Left
- **Definition**: Integrating security early in the SDLC (requirements, design, and coding phases).
- **Benefit**: Reduces the cost and complexity of fixing vulnerabilities compared to finding them in production.
- **Activities**: Threat modeling, secure coding training, SAST, and SCA.

### 2. Security as Code (SaC)
- **Concept**: Security policies and controls are treated like application code.
- **Implementation**: 
  - Version-controlled security scripts.
  - Automated compliance checks (e.g., OPA - Open Policy Agent).
  - Infrastructure as Code (IaC) scanning (e.g., Terraform, CloudFormation).

### 3. Secret Scanning
- **Goal**: Prevent the accidental leakage of sensitive credentials in code repositories.
- **Workflow**: 
  - Pre-commit hooks to block secrets before they are pushed.
  - Periodic scanning of history to find 'leaked' secrets.
  - **Response**: If a secret is found, it must be **revoked and rotated**.

### 4. Pipeline Hardening
- **Objective**: Protect the 'factory' that builds the software.
- **Controls**:
  - **Least Privilege**: Build runners should have minimal permissions.
  - **Ephemeral Runners**: Use short-lived environments for builds to prevent persistence.
  - **Code Review**: Pipeline configuration changes (e.g., Jenkinsfile) must be reviewed.
  - **Artifact Integrity**: Use checksums and signatures for all build artifacts.

## CISSP Context
In the CISSP exam, DevSecOps is often tested in the context of the **Software Development Life Cycle (Domain 8)**. Understand how automation replaces traditional 'gatekeeper' security and the importance of the CI/CD pipeline as a critical infrastructure component.
