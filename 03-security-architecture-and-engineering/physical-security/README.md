---
tier: 3
domain: Security Architecture and Engineering (Domain 3) + Security Operations (Domain 7)
exam_weight: ~5-7% across both domains
status: built
---

# Physical & Environmental Security for the CISSP Exam

A study-oriented overview of the physical and environmental security question family on the CISSP. This material spans Domain 3 (Security Architecture and Engineering — "Apply security principles to site and facility design" and "Implement site and facility security controls") and Domain 7 (Security Operations — operational physical safeguards). Use alongside `physical-security.tsv` in this folder.

## Where This Family Sits in the Exam

Physical security tends to feel out of place to candidates with technical backgrounds, but it's reliably tested — typically two to four questions on a CAT exam. The high-frequency content centers on fire classes and suppression matching, the Halon-replacement story (Halon banned by Montreal Protocol; FM-200, Novec 1230, inert gases as replacements), the preaction sprinkler in IT contexts, fence height standards, the mantrap as the canonical defense against tailgating and piggybacking, datacenter cooling (hot/cold aisle), and power-redundancy concepts (UPS for short term, generators for long term, N+1 minimum).

## The Question Patterns That Actually Show Up

### Fire class and suppression matching

The single most predictable pattern in this family. **Class A** fires involve ordinary combustibles (wood, paper, cloth) — water and soda acid are appropriate. **Class B** involves flammable liquids (gasoline, oil) — CO2, dry chemical, foam. **Class C** involves energized electrical equipment — non-conductive agents only (CO2, FM-200, inert gas); water on Class C creates electrocution risk. **Class D** involves combustible metals (magnesium, sodium, lithium) — special dry-powder agents. **Class K** involves cooking oils and fats (commercial kitchens) — wet chemicals. The trap is using water on Class C (electrocution), choosing Halon on a new system (banned), or mismatching fire class to cause.

### Halon and its replacements

A specific high-frequency point. **Halon** (halogenated hydrocarbons) was the gold standard for IT-facility fire suppression — fast, no residue, safe for equipment and (mostly) people. The Montreal Protocol (1989, effective 1994 in developed countries) banned Halon production due to ozone-depletion. New Halon installations are not permitted; existing installations may continue to operate with restrictions on recharging. EPA-recommended replacements include **FM-200 (HFC-227ea)**, **Novec 1230**, and inert gases (Argon, Argonite, Inergen). The trap is offering Halon as a correct answer for a new system.

### Preaction sprinklers for IT facilities

A specific Tier 1 point. Standard wet-pipe sprinklers have water in the pipes always — fast response, but a single broken sprinkler head dumps water into a server room. **Preaction sprinklers** require BOTH a fire-detection signal AND a sprinkler-head fusing before water is released, dramatically reducing accidental discharge risk. Preaction is the standard for IT and data center facilities. **Dry-pipe** sprinklers have air in the pipes; water arrives only when a head opens — used in unheated spaces. **Deluge** systems flood an entire zone — used for high-hazard environments. The trap is selecting wet-pipe in a server room.

### CPTED (Crime Prevention Through Environmental Design)

A definitional pattern. Four principles: **Natural Surveillance** — design that maximizes visibility (clear sight lines, removed hiding places, appropriate lighting). **Natural Access Control** — designing entrances, paths, and landscaping to guide legitimate users and discourage unauthorized entry. **Territorial Reinforcement** — clear delineation of public, semi-public, and private space so legitimate users feel ownership and intruders feel out of place. **Maintenance** — visible care of the space signals that it is monitored and reduces opportunities for criminal activity. CPTED is increasingly emphasized in 2024 outline material.

### Tailgating vs. piggybacking and the mantrap defense

A definitional and trap pattern. **Tailgating** is unauthorized entry by following an authorized person through a controlled door without that person's consent. **Piggybacking** is the same physical action but with the authorized person's consent (the authorized person knowingly holds the door). Both are defeated by **mantraps (access vestibules, security portals)** — interlocking double-door systems where the first door must close and the user must be authenticated independently before the second door opens. Single-person detection (weight sensor, optical) prevents two people from passing on one credential. The trap is conflating tailgating with piggybacking.

### Datacenter design — hot/cold aisle, raised floor, redundancy

A topical pattern. **Hot aisle / cold aisle** containment is the standard datacenter cooling layout: cold-air supply to the front of racks (cold aisles), hot-air exhaust to the back (hot aisles), with containment to prevent mixing. **Raised floors** provide under-floor cabling, air distribution, and flood damage protection. **Redundancy** is described as N+1 (one extra unit for any critical component), 2N (full duplicate of every unit), or 2N+1 (full duplicate plus one extra). Tier III data centers are typically N+1; Tier IV are 2N+1.

### Power problems and UPS/generator design

A definitional pattern. **Blackout** is total power loss. **Brownout** is sustained reduced voltage. **Sag** is brief voltage dip. **Surge** is brief voltage increase. **Spike** is instantaneous voltage spike. **Fault** is momentary loss with recovery. **Transient** is brief disturbance. **Inrush** is high startup current. UPS (Uninterruptible Power Supply) provides short-term bridge power (minutes) until generators start; generators provide long-term power. Online (double-conversion) UPS is continuously powered and provides instant transition; offline (standby) UPS only activates on power loss and is cheaper but slower.

### Smoke detector types

A specific Tier 2 point. **Ionization detectors** use a small radioactive source (americium-241) to detect fast, flaming fires (paper, grease) — they react quickly but produce more false alarms from cooking smoke. **Photoelectric detectors** use a light-and-photocell arrangement to detect smoke that scatters light — they respond better to slow, smoldering fires (upholstery, electrical insulation). NFPA recommends combination detectors with both technologies. Heat detectors (fixed-temperature, rate-of-rise), flame detectors, and gas detectors are also options.

### Electronic locks and fail-safe vs. fail-secure

A definitional pattern. **Fail-safe** locks default to UNLOCKED on power loss — life-safety priority, used on egress doors. **Fail-secure** locks default to LOCKED on power loss — security priority, used on entry to sensitive areas where physical safety is not a concern. Electric strikes can be either depending on configuration; magnetic locks (maglocks) are typically fail-safe. The trap is choosing the wrong default for the scenario — server-room entry is typically fail-secure; emergency egress is always fail-safe.

### TEMPEST and emanations

A Tier 3 point. **TEMPEST** refers to the U.S. specifications for protection against unintentional electromagnetic emissions that could leak data. Defenses include shielded equipment, Faraday cages, fiber-optic cabling (immune to EMI/RFI), and physical separation from public spaces. Relevant in classified-information processing facilities.

## The Trap Patterns to Inoculate Against

Six traps recur. The **water-on-Class-C-electrical-fire** trap is the highest-yield miss in this family — water conducts electricity; electrical fires require non-conductive suppression. The **Halon-for-a-new-system** trap fails because Halon is banned. The **wet-pipe-sprinkler-in-a-server-room** trap fails because preaction is the IT standard. The **tailgating-equals-piggybacking** trap conflates the two — the difference is consent. The **fail-safe-on-server-room-door** trap may be wrong if security trumps egress for that door (it usually doesn't — life safety wins, but the question may be testing whether you understand the principles). The **UPS-as-long-term-power-solution** trap fails because UPS provides minutes; generators provide hours-to-days.

## A Minimal Study Priority

In priority order: the five fire classes (A through D and K) and the canonical extinguisher/suppression for each; the Halon ban and FM-200 / Novec 1230 / inert gas as replacements; preaction sprinklers as the IT-standard sprinkler type; CPTED's four principles; tailgating vs. piggybacking with mantrap as the defense; hot aisle / cold aisle datacenter design; ASHRAE temperature (64-81°F) and humidity (40-60%) ranges; power-problem definitions (blackout, brownout, sag, surge, spike); UPS as short-term and generator as long-term power; ionization vs. photoelectric smoke detectors; fail-safe vs. fail-secure locks; fence height tiers (3-4 ft casual, 6-7 ft difficult, 8 ft+ serious); N+1 vs. 2N redundancy concepts.

## What Gets Less Air Time

Specific NFPA standard numbers (NFPA 75, NFPA 76) appear as references but are not deeply tested at the section level. Specific UPS battery chemistries are not asked. Detailed CCTV resolution and frame-rate specifications are not tested. Specific manufacturer products are never named. Detailed electrical engineering (specific voltage tolerances, harmonic distortion) is not tested. The internals of PIV (Personal Identity Verification) cards beyond NIST SP 800-116 awareness are not tested. Earthquake-zone-specific seismic design is not tested. Explosive blast resistance is not tested.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapter 10 is the comprehensive reference. Destination Certification's Domain 3 physical security MindMap at https://destcert.com/resources/physical-security-mindmap-cissp-domain-3/ is the most efficient visual review and includes the fire class matrix and CPTED principles. NIST SP 800-116 (PIV in Physical Access Control Systems) is the authoritative source for federal physical access control. NFPA 75 (Standard for the Fire Protection of Information Technology Equipment) and NFPA 76 (Standard for the Fire Protection of Telecommunications Facilities) are the authoritative fire-protection references for IT facilities. Design For Security at https://designforsecurity.org/crime-prevention-through-environmental-design/ is a clean CPTED introduction. ASHRAE TC 9.9 publishes the data center thermal guidelines.

Sources used to compile this README:

- [Destination Certification — Physical Security MindMap, Domain 3](https://destcert.com/resources/physical-security-mindmap-cissp-domain-3/)
- [Design For Security — Crime Prevention Through Environmental Design](https://designforsecurity.org/crime-prevention-through-environmental-design/)
- [CISSPrep — Physical Security](https://cissprep.net/physical-security/)
- [Infosec Institute — CISSP Perimeter Defenses](https://www.infosecinstitute.com/resources/cissp/cissp-perimeter-defenses/)
- [Threat on the Wire — Secure Site and Facility Design](https://www.threatonthewire.com/cissp-domain-3-secure-site-facility-design/)
- [ThorTeaches — Fire Suppression and Hot/Cold Aisles](https://thorteaches.com/cissp-d3-preview-fire-suppression-hot-and-cold-aisles/)
- [InfoSecTests — Datacenter Design and HVAC](https://infosectests.com/cissp-study-references/domain-3-security-engineering-and-architecting/datacenter-design-hvac/)
- [Cybrary — Fire Suppression Systems](https://www.cybrary.it/blog/using-fire-suppression-systems-to-protect-electronics)
- [Adrian Citu — CISSP Notes Physical Security](https://adriancitu.com/2012/12/15/my-cissp-notes-physical-security/)
- [CISSWhat — Locks](http://cisswhat.blogspot.com/2014/02/c5-perimeter-security-locks.html)
- [Cybrary — HVAC Water and Fire Detection](https://www.cybrary.it/blog/hvac-water-and-fire-detection-in-electronic-heavy-environments)
- [Wikipedia — Mantrap (Access Control)](https://en.wikipedia.org/wiki/Mantrap_(access_control))
- [Wikipedia — Piggybacking (Security)](https://en.wikipedia.org/wiki/Piggybacking_(security))
- [Newton Security — Mantrap Systems](https://www.newtonsecurityinc.com/mantrap_system_prev.html)
- [Vortex Doors — Mantrap in Access Control](https://www.vortexdoors.com/blog/what-is-a-mantrap-in-access-control)
- [First Alert — Ionization vs. Photoelectric Smoke Alarms](https://www.firstalert.com/blogs/safety-corner/ionization-vs-photoelectric-smoke-alarms)
- [Kidde — Photoelectric vs. Ionization](https://www.kidde.com/support/smoke-alarms/photoelectric-ionization-difference)
- [119 Fire Control — Halon vs. FM-200](https://www.119firecontrol.com/halon-fire-suppression-fm-200.html)
- [Study Notes and Theory — Halon](https://www.studynotesandtheory.com/single-post/what-you-should-know-about-halon)
- [CoreSite — Data Center Redundancy N+1 vs 2N+1](https://www.coresite.com/blog/data-center-redundancy-n-1-vs-2n-1)
- [Wikipedia — N+1 Redundancy](https://en.wikipedia.org/wiki/N%2B1_redundancy)
- [FacilitiesNet — UPS Offline Design](https://www.facilitiesnet.com/powercommunication/article/Understanding-UPS-Offline-Design-Trend-Redundancy-Options--16082)
- [Lifeline Data Centers — NFPA 75 and 76](https://lifelinedatacenters.com/data-center/nfpa-75-76-data-center-fire-suppression-standards/)
- [TechTarget — Major Changes in NFPA 75 and 76](https://www.techtarget.com/searchdatacenter/tip/Major-changes-in-data-center-fire-suppression-standards-NFPA-75-and-76)
- [NIST SP 800-116 Rev. 1 — PIV Credentials in Facility Access](https://csrc.nist.gov/pubs/sp/800/116/r1/final)
