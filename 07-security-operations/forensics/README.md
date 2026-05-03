---
tier: 2
exam_weight: 13%
---

# Digital Forensics

## Exam Relevance
Digital Forensics is a vital part of Security Operations (Domain 7). The CISSP exam focuses on the legal aspects of evidence, the correct procedures for collection, and the importance of maintaining integrity through technical and procedural controls.

## Key Concepts
- **Order of Volatility**: Collect the most "fleeing" data first.
  1. CPU Registers / Cache
  2. RAM (Random Access Memory)
  3. Swap/Page File
  4. Disk (HDD/SSD)
  5. Remote Logs / Backups
- **Five Rules of Evidence**:
  - **Authentic**: Is it what it says it is?
  - **Accurate**: Was it processed correctly?
  - **Complete**: Does it tell the whole story?
  - **Convincing**: Is it persuasive to a jury?
  - **Admissible**: Was it legally obtained?
- **Procedures**:
  - **Imaging**: Use a **Write Blocker**.
  - **Integrity**: Always **Hash** the image immediately.
  - **Chain of Custody**: Document every handoff.

## Exam Traps
- **Shutdown vs. Live**: In the past, "pull the plug" was common advice. Now, preserving **RAM** is prioritized due to encryption keys and volatile malware.
- **Hearsay Exception**: Log files are technically hearsay (they are out-of-court statements by a system), but they are usually admitted under the **Business Records Exception**.
- **Best Evidence**: A bit-stream image is usually accepted as the "original" in digital cases.
