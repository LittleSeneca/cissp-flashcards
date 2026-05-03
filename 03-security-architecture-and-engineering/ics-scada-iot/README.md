# ICS/SCADA and IoT Security

## Exam Relevance
Industrial Control Systems (ICS) and the Internet of Things (IoT) are key components of Domain 3. The CISSP exam covers the unique security challenges of these systems, especially the convergence of IT and Operational Technology (OT).

## Key Concepts
- **OT vs IT**: OT focuses on Availability and Physical Safety; IT focuses on Confidentiality.
- **Components**:
  - **PLC**: The "brain" at the machine level.
  - **RTU**: Communication bridge for remote sites.
  - **HMI**: The operator's dashboard.
  - **Historian**: The database for process logs.
- **Protocols**: Modbus (serial/TCP, no security), DNP3 (utility focus, can have 'Secure Authentication' extensions).
- **Architecture**:
  - **Purdue Model**: 6-level model for segmenting OT from IT.
  - **Fog/Edge Computing**: Processing data closer to the source to reduce latency and bandwidth.
- **IoT Lifecycle**: Security must be considered from hardware design to decommissioning (End of Life).

## Exam Traps
- **Security Priorities**: If the question asks for the primary concern in a factory or power plant, it is **Availability/Safety**, not Confidentiality.
- **Fog vs Edge**: Fog happens at the local network level (gateways); Edge happens on the device itself.
- **Vulnerabilities**: Many ICS protocols were designed for "security by isolation" and lack modern features like authentication.
