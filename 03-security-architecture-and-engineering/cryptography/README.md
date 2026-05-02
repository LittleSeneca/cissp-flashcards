# Cryptography Fundamentals for the CISSP Exam

> **Tier:** 1  
> **Domain:** Security Architecture and Engineering (Domain 3)  
> **Exam Weight:** ~13%  
> **Status:** Built

A study-oriented overview of the cryptography question family on the CISSP. Cryptography is the largest topic inside Domain 3 (Security Architecture and Engineering) and gets tested broadly across algorithm classification, PKI, digital signatures, key management, attacks, and protocols. Use alongside `cryptography.tsv` in this folder.

## Where This Family Sits in the Exam

Domain 3 carries roughly 13% of the exam under ISC2's official outline, and cryptography is the single largest content area within Domain 3. The exam tests cryptography broadly rather than deeply — you do not need to do crypto math, but you do need to recognize algorithms by family (symmetric vs. asymmetric vs. hash), know what cryptographic services each primitive provides, identify the right tool for a stated requirement, and recognize attacks and their defenses. Expect several questions on this family on a CAT exam, with high-yield areas being the symmetric/asymmetric distinction, the public/private key roles in signatures and envelopes, PKI components, and block cipher modes.

## The Question Patterns That Actually Show Up

### Algorithm classification

The most predictable pattern. You'll be given an algorithm name and asked which family it belongs to or what use case it fits. Symmetric block ciphers include AES (the current standard, 128-bit blocks, 128/192/256-bit keys), DES (broken, 56-bit effective key), 3DES (deprecated), Blowfish, Twofish, IDEA, RC5, and RC6. The lone widely-cited symmetric stream cipher is RC4 (now deprecated). Asymmetric algorithms include RSA, DSA, ECC/ECDSA, Diffie-Hellman, ElGamal, and the deprecated Knapsack. Hash functions include MD5 (broken), SHA-1 (deprecated), SHA-2 family (256/384/512), SHA-3, and RIPEMD. The single highest-yield trap is calling Diffie-Hellman an encryption algorithm; it is a key-exchange protocol that establishes a shared secret over a public channel but does not encrypt or decrypt data directly.

### Public/private key roles

A second predictable pattern. You'll be given a scenario — encrypting a message, signing a message, building a digital envelope — and asked which key is used. The two patterns to memorize: for **digital signatures**, sign with the sender's PRIVATE key, verify with the sender's PUBLIC key (because only the private key holder could have produced the signature, which is what gives signatures their non-repudiation). For **asymmetric encryption** (including the digital envelope pattern), encrypt with the recipient's PUBLIC key, decrypt with the recipient's PRIVATE key (because anyone can encrypt with the public key, but only the recipient can decrypt). The trap is "encrypting sensitive documents with your private key for security" — that doesn't work, because anyone with your public key can decrypt.

### Cryptographic services mapping

You'll be asked which primitive provides which service. The canonical CISSP mapping: confidentiality is provided by encryption (symmetric or asymmetric); integrity is provided by hashes, MACs, and digital signatures; authentication is provided by MACs and digital signatures; non-repudiation is provided ONLY by digital signatures (because a MAC uses a shared symmetric key that either party could have used, so a MAC cannot prove which party produced the tag); access control is provided indirectly via key possession. The most-tested distinction in this category is MAC vs. digital signature on non-repudiation.

### PKI components

Expect at least one PKI question. The Certificate Authority (CA) issues and signs certificates after verifying identity. The Registration Authority (RA) is the front-end that handles identity verification on behalf of the CA. The Certificate Revocation List (CRL) is a periodically published list of revoked certificate serial numbers — efficient at scale but not real-time. The Online Certificate Status Protocol (OCSP) is a real-time query/response protocol for checking individual certificate status. X.509 is the standard for certificate format (subject, issuer, public key, validity, signature). Root CAs sign their own certificates and are typically kept offline; intermediate CAs sit between root CAs and end-entity certificates and bear the operational issuance load.

### Block cipher modes

A high-frequency Domain 3 topic. ECB (Electronic Code Book) is insecure because identical plaintext blocks produce identical ciphertext blocks, leaking patterns. CBC (Cipher Block Chaining) XORs each plaintext block with the previous ciphertext block before encryption and requires a random IV. CTR (Counter Mode) encrypts a counter and XORs the result with plaintext, parallelizable, with a unique nonce per message. GCM (Galois Counter Mode) adds authentication on top of CTR, providing authenticated encryption — confidentiality and integrity in a single primitive. The single most testable point is that ECB is insecure for any non-trivial data; the second is that GCM is the modern authenticated-encryption standard used in TLS 1.3.

### Cryptographic attacks and defenses

A concept-pairing pattern. Brute force is countered by sufficient key length (128+ bits symmetric, 2048+ bits RSA). Birthday attacks exploit the birthday paradox to find hash collisions in roughly the square root of the search space, motivating sufficient hash output sizes (256+ bits today). Rainbow tables precompute hash lookups for password cracking and are countered by salt (random per-password value mixed into the input) plus key stretching (PBKDF2, bcrypt, scrypt, Argon2 deliberately slow down each attempt). Replay attacks are countered by nonces, sequence numbers, or timestamps. Man-in-the-middle attacks on key exchange are countered by digital signatures over the exchange messages or by certificate validation. Downgrade attacks are countered by cipher suite pinning and protocol version enforcement.

### Hashing properties and use cases

Hash functions are one-way (cannot derive input from output), deterministic (same input always yields same output), fixed-length output regardless of input size, and collision-resistant (computationally hard to find two inputs with the same output). Used for integrity verification, password storage (with salt and stretching), and as a building block in MACs and signatures. MD5 is broken and should not be used for security. SHA-1 is deprecated and being phased out. SHA-2 (especially SHA-256) is the current default. Note that for forensic integrity verification, MD5 and SHA-1 are still acceptable per SWGDE because the use case is not adversarial.

### Symmetric vs. asymmetric tradeoffs

Symmetric is fast (orders of magnitude faster than asymmetric), efficient for bulk data, but suffers from the key distribution problem (how do you share the secret key safely?) and scales poorly (n parties need n(n-1)/2 keys). Asymmetric solves both problems — public keys can be public — but is slow and computationally heavy. The standard real-world solution is hybrid cryptography: use asymmetric to exchange a symmetric session key, then use symmetric to encrypt the bulk data. TLS, PGP, and S/MIME all use this pattern. The "digital envelope" pattern is the canonical name for it.

### IPsec and TLS at a high level

CISSP-level depth, not implementation depth. IPsec's Authentication Header (AH) provides integrity and authentication only; Encapsulating Security Payload (ESP) provides confidentiality plus integrity and authentication. Transport mode encrypts only the payload; tunnel mode encrypts the entire original IP packet (used for site-to-site VPN). For TLS, the conceptual point tested is the handshake's role in negotiating cipher suites and exchanging keys, not the byte-level packet structure.

## The Trap Patterns to Inoculate Against

The traps in this family are dense. **MAC providing non-repudiation** is the highest-yield miss — a MAC uses a symmetric key shared between the parties, so either party could have computed the tag, which means a MAC cannot prove which party did. Only digital signatures provide non-repudiation. **Diffie-Hellman as an encryption algorithm** appears as a wrong answer when the right answer is RSA or AES — DH is key exchange, not encryption. **Encrypting with your private key** is offered as a way to keep data confidential — it isn't, because anyone with your public key can decrypt. The **ECB-as-default-mode** trap appears in cipher mode questions; ECB is the default for "no mode selected" but is insecure. The **CRL is real-time** trap appears in PKI questions; CRL is periodic, OCSP is real-time. The **DES is fine for legacy** trap appears in algorithm-selection questions; DES is broken, and even 3DES is deprecated for new deployments. **OAuth in a crypto question** is a domain-mismatch distractor — OAuth is IAM, not cryptography. **Steganography as a cryptographic technique** is another categorization trap — steganography hides the existence of data; it does not protect data through encryption.

## A Minimal Study Priority

In priority order: the symmetric-vs-asymmetric distinction with use cases (bulk vs. key exchange and signatures); AES key sizes and block size; the public/private key roles in signatures vs. envelopes; the cryptographic services matrix (which primitive provides confidentiality, integrity, authentication, non-repudiation); MAC vs. digital signature on non-repudiation; PKI components (CA, RA, CRL, OCSP, X.509) and the root-vs-intermediate hierarchy; the four core block cipher modes (ECB, CBC, CTR, GCM) with ECB insecure and GCM authenticated; the major hash functions and their status (MD5 broken, SHA-1 deprecated, SHA-2 standard); the brute force / birthday / rainbow table / salt+stretching attack-and-defense set; the digital envelope / hybrid pattern; the symmetric-key length equivalences (128 sym ≈ 3072 RSA ≈ 256 ECC); and the IPsec AH/ESP and tunnel/transport distinctions.

## What Gets Less Air Time

Specific cryptanalysis math (e.g., the actual integer factorization difficulty) is not tested. RC5/RC6 specifics, ElGamal mechanics, and the Knapsack algorithm appear as Tier 3 distractors. Quantum cryptography is mentioned but at conceptual level only (post-quantum algorithms exist; lattice-based and hash-based are leading candidates). Specific TLS handshake messages (ClientHello, ServerHello) are not tested at the byte level. Steganography appears occasionally as a definition distinguishing it from encryption. Specific FIPS publication numbers (FIPS 140-3, 197, 186, 180, 198) are referenced as authoritative sources but you don't need to memorize the numbers.

## Authoritative Sources

The Sybex *ISC2 CISSP Official Study Guide*, 10th edition, Chapters 6 and 7 are the comprehensive references. Destination Certification's Cryptography MindMap at https://destcert.com/resources/cryptography-mindmap-cissp-domain-3/ is the most efficient visual review and includes all the algorithm classifications and key roles. The companion MindMaps on Cryptanalysis and PKI/Certificates are also worth working through. CISSPrep's cryptography series at https://cissprep.net/cryptography-introduction/ is a strong free overview. NIST SP 800-38A (cipher modes), FIPS 197 (AES), FIPS 186-5 (DSA/ECDSA), FIPS 180-4 (SHA-2), and FIPS 198-1 (HMAC) are the authoritative standards underlying most of the algorithm content. RFC 5280 is the source for X.509 certificate format. Threat on the Wire's Domain 3 cryptography essentials series is a solid scenario-style review.

Sources used to compile this README:

- [Destination Certification — Cryptography MindMap](https://destcert.com/resources/cryptography-mindmap-cissp-domain-3/)
- [Destination Certification — Cryptanalysis MindMap](https://destcert.com/resources/cryptanalysis-mindmap-cissp-domain-3/)
- [Destination Certification — Digital Certificates and PKI MindMap](https://destcert.com/resources/digital-certificates-digital-signatures-pki-mindmap-cissp-domain-3/)
- [Destination Certification — Symmetric Cryptography](https://destcert.com/resources/symmetric-cryptography/)
- [Destination Certification — Asymmetric Cryptography](https://destcert.com/resources/asymmetric-cryptography/)
- [Destination Certification — Types of Ciphers](https://destcert.com/resources/types-of-ciphers/)
- [Destination Certification — Five Pillars of Information Security](https://destcert.com/resources/five-pillars-information-security/)
- [CISSPrep — Cryptography Introduction](https://cissprep.net/cryptography-introduction/)
- [CISSPrep — DES and AES](https://cissprep.net/des-and-aes/)
- [CISSPrep — Cryptography Terminology](https://cissprep.net/cryptography-terminology/)
- [CISSPrep — Breaking Cryptography](https://cissprep.net/breaking-cryptography/)
- [CISSPrep — Services of Cryptography and How to Achieve Them](https://cissprep.net/services-of-cryptography-and-how-to-achieve-them/)
- [Threat on the Wire — Cryptography Essentials](https://www.threatonthewire.com/cissp-domain-3-cryptography-essentials/)
- [Threat on the Wire — PKI and Certificate Management](https://www.threatonthewire.com/cissp-domain-3-pki-certificate-management/)
- [Threat on the Wire — Applying Cryptography Protocols](https://www.threatonthewire.com/cissp-domain-3-applying-cryptography-protocols/)
- [Threat on the Wire — Key Management and Cryptographic Attacks](https://www.threatonthewire.com/cissp-domain-3-key-management-cryptographic-attacks/)
- [ThorTeaches — Asymmetric Key](https://thorteaches.com/glossary/asymmetric-key/)
- [ThorTeaches — Cryptographic Lifecycle](https://thorteaches.com/glossary/cryptographic-lifecycle/)
- [Cornell CS 5430 — MACs and Digital Signatures](https://www.cs.cornell.edu/courses/cs5430/2017sp/l/08-macdigsig/notes.html)
- [RFC 5280 — Internet X.509 Public Key Infrastructure Certificate](https://www.rfc-editor.org/rfc/rfc5280)
- [NIST SP 800-38A — Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-38a.pdf)
- [Sectigo — RSA vs DSA vs ECC](https://www.sectigo.com/resource-library/rsa-vs-dsa-vs-ecc-encryption)
- [SSL.com — ECDSA vs RSA Comparison](https://www.ssl.com/article/comparing-ecdsa-vs-rsa-a-simple-guide/)
- [Secure Ideas — Hashing Functions CISSP Domain 3](https://www.secureideas.com/blog/2020/07/hashing-functions-cissp-domain-3.html)
- [Infosec Resources — Introduction to Hash Functions](https://resources.infosecinstitute.com/topic/introduction-to-hash-functions)
- [Firewall.cx — IPsec Modes (Tunnel vs Transport)](https://www.firewall.cx/networking/network-protocols/ipsec-modes.html)
- [JumpCloud — Rainbow Table Attack](https://jumpcloud.com/it-index/what-is-a-rainbow-table-attack)
- [ExamCollection — Mastering Key Management Lifecycle for CISSP](https://www.examcollection.com/blog/mastering-key-management-life-cycle-for-the-cissp-exam/)
- [Info-savvy — Digital Signatures and Non-Repudiation](https://info-savvy.com/cissp-digital-signatures-non-repudiation-bk2d3t6p6/)
