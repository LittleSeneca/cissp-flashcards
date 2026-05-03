---
tier: 2
exam_weight: "12%"
---

# Software Testing & Code Review

This section covers methodologies for assessing the security of software throughout the development lifecycle (SDLC).

## Key Testing Methodologies
- **SAST (Static Application Security Testing)**: Testing the **source code** or binaries without executing them ("White Box"). Finds vulnerabilities like buffer overflows or hardcoded credentials early.
- **DAST (Dynamic Application Security Testing)**: Testing the **running application** from the outside ("Black Box"). Finds environment-related issues and runtime vulnerabilities like SQL injection.
- **IAST (Interactive Application Security Testing)**: Combines SAST and DAST by using **instrumentation** (agents) inside the running application.
- **SCA (Software Composition Analysis)**: Identifying vulnerabilities in **third-party libraries** and dependencies.

## Code Review & Inspections
- **Peer Review**: Informal review by another developer.
- **Fagan Inspection**: A highly **formal, structured** process for code review consisting of six stages: Planning, Overview, Preparation, Inspection, Rework, and Follow-up.
- **Pass-around**: Sending code to others via email/tool for feedback.

## Testing Types
- **Unit Testing**: Testing individual components/functions.
- **Integration Testing**: Testing how components work together.
- **Regression Testing**: Testing to ensure new changes haven't broken existing functionality.
- **User Acceptance Testing (UAT)**: Testing by the end-user to ensure requirements are met.
