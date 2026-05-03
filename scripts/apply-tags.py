#!/usr/bin/env python3
"""
Applies a unified CISSP tagging taxonomy to every TSV flashcard and JSON MCQ file.

Tag structure per card:  Primary topic tag(s) + optional sub-topic tag + optional type tag
All comma-separated, stored in the Category field (TSV col 3 / JSON "category").
"""

import os, json, glob, sys, csv, io

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Unified tag rules ────────────────────────────────────────────────────────
# Each entry maps (set_folder_name, current_category_value) → list of new tags.
# Keys are matched case-insensitively.  Values are the final stored tags (Title Case).

SET_PRIMARY = {
    # Domain 1
    'bcp-dr':                    ['BCP/DR'],
    'ethics':                    ['Ethics'],
    'gdpr':                      ['GDPR', 'Privacy'],
    'governance-and-compliance': ['Governance', 'Compliance'],
    'legal-and-regulatory':      ['Legal & Regulatory'],
    'personnel-security':        ['Personnel Security'],
    'risk-management':           ['Risk Management'],
    'supply-chain-risk':         ['Supply Chain Risk'],
    'threat-modeling':           ['Threat Modeling'],
    # Domain 2
    'asset-security':            ['Asset Security'],
    # Domain 3
    'cloud-security':            ['Cloud Security'],
    'cryptography':              ['Cryptography'],
    'evaluation-criteria':       ['Evaluation Criteria'],
    'ics-scada-iot':             ['ICS/SCADA', 'IoT'],
    'physical-security':         ['Physical Security'],
    'security-models':           ['Security Models'],
    # Domain 4
    'network-security':          ['Network Security'],
    'sdn-microsegmentation':     ['SDN', 'Microsegmentation'],
    'zero-trust':                ['Zero Trust'],
    # Domain 5
    'access-control-and-iam':   ['IAM', 'Access Control'],
    'federated-identity':        ['IAM', 'Federation'],
    # Domain 6
    'security-testing':          ['Security Testing'],
    'soc-reporting':             ['SOC Reporting', 'Auditing'],
    'software-testing':          ['Software Testing'],
    # Domain 7
    'forensics':                 ['Forensics'],
    'incident-response':         ['Incident Response'],
    'logging-monitoring-siem':   ['SIEM', 'Logging'],
    # Domain 8
    'api-cloud-native':          ['API Security', 'Cloud-Native'],
    'devsecops':                 ['DevSecOps'],
    'secure-sdlc':               ['Secure SDLC'],
}

# Maps a current category value to additional tags to APPEND to the primary tags.
# Matched case-insensitively.  Empty list = just use the primary tags.
CATEGORY_EXTRA = {
    # ── Generic type tags ────────────────────────────────────────────────────
    'formulas':              ['Formula'],
    'metrics':               ['Formula'],
    'trap patterns':         ['Trap'],
    'common mistakes':       ['Trap'],
    'worked examples':       ['Worked Example'],
    'scenario':              ['Worked Example'],
    'mnemonics':             ['Mnemonic'],
    'comparison':            ['Comparison'],
    'attacks':               ['Attack'],
    'lifecycle':             ['Lifecycle'],
    'definitions':           ['Concept'],

    # ── BCP/DR ───────────────────────────────────────────────────────────────
    'availability':          ['Availability'],
    'bia':                   ['BIA'],
    'backup':                ['Backup & Recovery'],
    'priorities':            ['Recovery Priorities'],
    'raid':                  ['Redundancy'],
    'sites':                 ['Recovery Sites'],
    'testing':               ['Testing'],

    # ── GDPR / Privacy ───────────────────────────────────────────────────────
    'articles':              ['Regulation'],
    'breach notification':   ['Breach Notification'],
    'cross-framework':       ['Frameworks'],
    'enforcement':           ['Compliance'],
    'roles':                 ['Roles'],

    # ── Governance / Compliance ──────────────────────────────────────────────
    'agreements':            ['Contracts'],
    'cobit':                 ['Frameworks', 'COBIT'],
    'coso':                  ['Frameworks'],
    'due care':              ['Due Care'],
    'frameworks':            ['Frameworks'],
    'iso 27000':             ['Frameworks', 'ISO 27001'],
    'international':         ['Frameworks'],
    'nist csf':              ['Frameworks', 'NIST CSF'],
    'nist rmf':              ['Frameworks', 'NIST RMF'],
    'policy hierarchy':      ['Policy'],
    'senior management':     ['Governance'],
    'third party':           ['Supply Chain Risk'],
    'us regulations':        ['Regulation'],

    # ── Personnel Security ───────────────────────────────────────────────────
    'background checks':     ['Hiring'],
    'clearances':            ['Clearances'],
    'insider threat':        ['Insider Threat'],
    'pre-employment':        ['Hiring'],
    'privileged users':      ['Privileged Access'],
    'termination':           ['Offboarding'],
    'training':              ['Security Awareness'],

    # ── Risk Management ──────────────────────────────────────────────────────
    'methodology':           ['Risk Assessment'],
    'methodologies':         ['Risk Assessment'],
    'treatment':             ['Risk Treatment'],
    'tools':                 ['Risk Tools'],

    # ── Threat Modeling ──────────────────────────────────────────────────────
    'att&ck':               ['MITRE ATT&CK'],
    'attack trees':          ['Attack Trees'],
    'dread':                 ['Threat Scoring'],
    'diamond model':         ['Threat Intelligence'],
    'kill chain':            ['Kill Chain'],
    'stride':                ['STRIDE'],

    # ── Asset Security ───────────────────────────────────────────────────────
    'classification':        ['Data Classification'],
    'dlp':                   ['DLP'],
    'inventory':             ['Asset Management'],
    'retention':             ['Data Lifecycle'],
    'rights management':     ['DRM'],
    'sanitization':          ['Data Destruction'],
    'states':                ['Data States'],

    # ── Cloud Security ───────────────────────────────────────────────────────
    'casb':                  ['CASB'],
    'cnapp':                 ['Cloud-Native'],
    'csa':                   ['Frameworks'],
    'cspm':                  ['Cloud Posture'],
    'cwpp':                  ['Workload Protection'],
    'cloud encryption':      ['Encryption'],
    'data location':         ['Data Residency'],
    'fedramp':               ['FedRAMP'],
    'federal frameworks':    ['Frameworks'],
    'iam':                   ['IAM'],
    'incident response':     ['Incident Response'],
    'multi-tenancy':         ['Cloud Architecture'],
    'nist 800-145':          ['Frameworks'],
    'sla':                   ['Contracts'],
    'service models':        ['Cloud Service Models'],
    'shared responsibility': ['Shared Responsibility'],

    # ── Cryptography ─────────────────────────────────────────────────────────
    'asymmetric algorithms': ['Asymmetric Crypto'],
    'block cipher modes':    ['Symmetric Crypto'],
    'hashing':               ['Hashing'],
    'hybrid':                ['Hybrid Crypto'],
    'key lengths':           ['Key Management'],
    'key management':        ['Key Management'],
    'macs':                  ['Hashing'],
    'pki':                   ['PKI'],
    'signatures':            ['PKI'],
    'symmetric algorithms':  ['Symmetric Crypto'],
    'protocols':             ['Protocols'],

    # ── Evaluation Criteria ──────────────────────────────────────────────────
    'common criteria':       ['Common Criteria'],
    'fips 140-3':            ['FIPS'],
    'itsec':                 ['ITSEC'],
    'tcsec':                 ['TCSEC'],

    # ── Physical Security ────────────────────────────────────────────────────
    'access control':        ['Physical Access Control'],
    'cpted':                 ['CPTED'],
    'fire class':            ['Fire Safety'],
    'suppression':           ['Fire Suppression'],
    'tempest':               ['TEMPEST'],
    'redundancy':            ['Redundancy'],
    'surveillance':          ['Surveillance'],
    'datacenter':            ['Datacenter'],

    # ── Security Models ──────────────────────────────────────────────────────
    'access matrix':         ['Access Matrix'],
    'information flow':      ['Information Flow'],
    'lattice':               ['Lattice Model'],
    'state machine':         ['State Machine'],

    # ── Network Security ─────────────────────────────────────────────────────
    '802.1x':               ['NAC', '802.1X'],
    'dns':                   ['DNS'],
    'email':                 ['Email Security'],
    'firewalls':             ['Firewalls'],
    'ids/ips':               ['IDS/IPS'],
    'ipsec':                 ['VPN', 'IPsec'],
    'osi':                   ['OSI Model'],
    'ports':                 ['Ports & Protocols'],
    'tcp':                   ['Protocols'],
    'topology':              ['Network Architecture'],
    'vpn':                   ['VPN'],
    'wireless':              ['Wireless'],

    # ── SDN ──────────────────────────────────────────────────────────────────
    'microsegmentation':     ['Microsegmentation'],
    'sdn concepts':          ['SDN'],

    # ── IAM ──────────────────────────────────────────────────────────────────
    'authentication factors':['Authentication'],
    'bell-lapadula':         ['Security Models'],
    'biba':                  ['Security Models'],
    'biometrics':            ['Biometrics'],
    'federation':            ['Federation'],
    'kerberos':              ['Kerberos'],
    'models':                ['Access Models'],
    'privileged access':     ['Privileged Access'],

    # ── Security Testing ─────────────────────────────────────────────────────
    'application testing':   ['Application Testing'],
    'audits':                ['Auditing'],
    'code review':           ['Code Review'],
    'monitoring':            ['Monitoring'],
    'pen testing':           ['Penetration Testing'],
    'soc reports':           ['SOC Reporting'],
    'teams':                 ['Red Team / Blue Team'],
    'testing types':         ['Testing Types'],

    # ── SOC Reporting ────────────────────────────────────────────────────────
    'audit outcomes':        ['Auditing'],
    'audit types':           ['Auditing'],
    'report types':          ['Report Types'],
    'soc 2 details':         ['SOC 2'],

    # ── Incident Response ────────────────────────────────────────────────────
    'evidence':              ['Forensics', 'Evidence'],
    'forensics':             ['Forensics'],
    'reporting':             ['Reporting'],
    'scope':                 [],

    # ── SIEM / Logging ───────────────────────────────────────────────────────
    'compliance':            ['Compliance'],
    'continuous monitoring': ['Monitoring'],
    'detection':             ['Detection'],
    'detection types':       ['Detection'],
    'log integrity':         ['Log Integrity'],
    'log types':             ['Log Management'],
    'network monitoring':    ['Monitoring'],
    'siem functions':        ['SIEM Functions'],
    'siem vs soar':          ['SOAR'],
    'soar':                  ['SOAR'],
    'syslog':                ['Syslog'],
    'threat hunting':        ['Threat Hunting'],
    'threat intelligence':   ['Threat Intelligence'],
    'what to log':           ['Log Management'],

    # ── Secure SDLC ──────────────────────────────────────────────────────────
    'apis':                  ['API Security'],
    'maturity models':       ['Maturity Models'],
    'owasp top 10':          ['OWASP'],
    'sdlc phases':           ['SDLC Phases'],
    'secrets':               ['Secrets Management'],
    'secure coding':         ['Secure Coding'],
    'supply chain':          ['Supply Chain Risk'],
    'vulnerabilities':       ['Vulnerabilities'],

    # ── DevSecOps ────────────────────────────────────────────────────────────
    'pipeline security':     ['CI/CD Security'],
    'devsecops principles':  [],

    # ── API / Cloud-Native ───────────────────────────────────────────────────
    'container security':    ['Containers'],
    'cloud-native security': [],

    # ── MCQ categories (already topical — map to canonical tags) ────────────
    'bcp/dr':                        [],  # primary already set
    'ethics':                        [],
    'gdpr':                          [],
    'governance and compliance':     [],
    'legal, regulatory, and ip':     [],
    'personnel security':            [],
    'risk management':               [],
    'supply chain risk management':  [],
    'threat modeling':               [],
    'asset security':                [],
    'cloud security':                [],
    'cryptography':                  [],
    'evaluation criteria':           [],
    'ics/scada and iot':             [],
    'physical security':             [],
    'security models':               [],
    'network security':              [],
    'sdn & microsegmentation':       [],
    'zero trust':                    [],
    'identity and access management':['Access Control'],
    'federated identity':            [],
    'security assessment and testing': [],
    'soc reporting':                 [],
    'software testing':              [],
    'digital forensics':             [],
    'incident response':             [],
    'logging, monitoring, and siem': [],
    'api security':                  [],
    'cloud-native security':         [],
    'container security':            ['Containers'],
    'devsecops':                     [],
    'secure sdlc':                   [],
    # Generic / structural categories — no extra tags
    'concepts':              [],
    'foundational':          [],
    'foundations':           [],
    'orientation':           [],
    'principles':            [],
    'strategy':              [],
    'components':            [],
    'standards':             [],
    'references':            [],
    'materials':             [],
    'personnel':             [],
    'perimeter':             [],
    'cabling':               [],
    'power':                 [],
    'locks':                 [],
    'crypto services':       [],
    'defenses':              [],
    'sdlc':                  ['SDLC Phases'],
}

def build_tags(set_name, current_category):
    primary = SET_PRIMARY.get(set_name, [])
    cat_key = (current_category or '').strip().lower()
    extra   = CATEGORY_EXTRA.get(cat_key, None)

    # If this category key IS a primary topic marker, just use primary
    if extra is None:
        # Unknown category — skip adding extras, just use primary
        extra = []

    # De-duplicate while preserving order
    seen = set()
    tags = []
    for t in primary + extra:
        if t.lower() not in seen:
            seen.add(t.lower())
            tags.append(t)
    return ', '.join(tags) if tags else (current_category or '')

# ── Process TSV files ─────────────────────────────────────────────────────────

def process_tsv(filepath, set_name):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    lines = content.split('\n')
    if not lines:
        return 0

    updated = [lines[0]]  # keep header
    changed = 0
    for line in lines[1:]:
        if not line.strip():
            updated.append(line)
            continue
        parts = line.split('\t')
        if len(parts) >= 3:
            old_cat = parts[2].strip()
            new_cat = build_tags(set_name, old_cat)
            if new_cat != old_cat:
                changed += 1
            parts[2] = new_cat
            updated.append('\t'.join(parts))
        elif len(parts) == 2:
            # No category column at all — add primary tags
            new_cat = build_tags(set_name, '')
            parts.append(new_cat)
            updated.append('\t'.join(parts))
            changed += 1
        else:
            updated.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(updated))
    return changed

# ── Process JSON MCQ files ────────────────────────────────────────────────────

def process_json(filepath, set_name):
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        return 0

    changed = 0
    for item in data:
        old_cat = (item.get('category') or '').strip()
        new_cat = build_tags(set_name, old_cat)
        if new_cat != old_cat:
            item['category'] = new_cat
            changed += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')
    return changed

# ── Walk all domain/set directories ──────────────────────────────────────────

total_files  = 0
total_cards  = 0

for domain_dir in sorted(glob.glob(os.path.join(ROOT, '[0-9]*'))):
    domain_name = os.path.basename(domain_dir)
    for set_dir in sorted(os.listdir(domain_dir)):
        set_path = os.path.join(domain_dir, set_dir)
        if not os.path.isdir(set_path):
            continue
        set_name = set_dir  # e.g. "risk-management"
        if set_name not in SET_PRIMARY:
            print(f'  SKIP (no primary tags defined): {domain_name}/{set_name}')
            continue

        for tsv in glob.glob(os.path.join(set_path, '*.tsv')):
            n = process_tsv(tsv, set_name)
            total_cards += n
            total_files += 1
            print(f'  TSV  {domain_name}/{set_name}/{os.path.basename(tsv)}: {n} cards updated')

        for jsf in glob.glob(os.path.join(set_path, '*.json')):
            n = process_json(jsf, set_name)
            total_cards += n
            total_files += 1
            print(f'  JSON {domain_name}/{set_name}/{os.path.basename(jsf)}: {n} cards updated')

print(f'\nDone — {total_cards} cards updated across {total_files} files.')
