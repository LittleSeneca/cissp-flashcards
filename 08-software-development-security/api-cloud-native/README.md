---
tier: 2
exam_weight: 10%
---

# Modern API & Cloud-Native Security

This section explores the security challenges and controls associated with modern, distributed architectures, including microservices, containers, and serverless computing.

## Key Topics

### 1. API Security (REST vs. SOAP)
- **REST (Representational State Transfer)**: 
  - Uses standard HTTP methods (GET, POST, etc.).
  - Lightweight, typically uses JSON.
  - Security relies on TLS and tokens (JWT/OAuth).
- **SOAP (Simple Object Access Protocol)**:
  - Protocol-based, uses XML.
  - Supports **WS-Security** for message-level encryption and signatures.
  - Often used in legacy or high-assurance enterprise environments.

### 2. JSON Web Tokens (JWT)
- **Structure**: Header, Payload, Signature.
- **Security Use**: Enables **stateless authentication**, where the server doesn't need to store session state.
- **Risks**: Sensitive data in payload (it's only encoded, not encrypted by default), weak signing keys, and the 'alg: none' vulnerability.

### 3. Container Security
- **Namespaces**: Provide resource **isolation** (visibility).
- **Cgroups (Control Groups)**: Provide resource **limiting** (CPU, RAM).
- **Security Best Practices**:
  - Use minimal base images (e.g., Alpine).
  - Avoid 'privileged' containers.
  - Scan images for vulnerabilities (SCA).
  - Use Immutable infrastructure (replace, don't patch).

### 4. Serverless / FaaS (Function as a Service)
- **Shared Responsibility**: 
  - **Provider**: Secures the host OS, runtime environment, and physical security.
  - **Customer**: Secures the function code, IAM roles, and input validation.
- **Challenges**: Short execution times make traditional monitoring difficult; increased 'attack surface' due to many small, interconnected functions.

## CISSP Context
Domain 8 requires an understanding of how traditional software security principles (like input validation and least privilege) apply to modern, highly automated environments. Focus on the **Shared Responsibility Model** and the technical mechanisms (Namespaces, cgroups, mTLS) that enable cloud isolation.
