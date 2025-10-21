---
layout: default
title: Robust Inbox Forwarding Rule Exfil in Splunk -- Risk-Based Enrichment
---

# Robust Inbox Forwarding Rule Exfil in Splunk -- Risk-Based Enrichment (SPL Included)

Full write-up PDF: [download](pdf/Robust%20Inbox%20Forwarding%20Rule%20Exfil%20in%20Splunk.pdf)

## Overview
Triage & direct detection for mailbox auto-forwarding and redirect rules, enriched with WHOIS age, freemail/disposable flags, and threat feeds.

## SPL Sections
(See PDF for SPL queries.)

## Detection Plays

### SPL A -- Triage Defender "Suspicious Inbox Forwarding Rule" Alerts
- **Purpose:** Supercharge Defender for Office 365 alerts by adding destination-domain intelligence so analyst time targets the riskiest forwarding setups.
- **Data Sources:** `m365:defender:alert` or `azure:defender:cloudalert`, with enrichment lookups for freemail/disposable domains, WHOIS age, OTX/OpenPhish hits, and `ipqs` domain risk.
- **Logic Highlights:** Normalizes the forwarding target, extracts the domain, layers multiple intel lookups, and calculates a risk score that rewards disposable domains, young WHOIS age, phishing sightings, and high IPQS risk. Alerts scoring >= 50 are retained.
- **ATT&CK Mapping:** `T1114.003 - Email Collection: Email Forwarding Rule` -- identifying adversary-established auto-forward rules used for silent mailbox theft.

### SPL B -- Direct Detector from Exchange Unified Audit Log
- **Purpose:** Catch mailbox forwarding/redirect activity directly from Exchange Unified Audit Log events, even when Defender hasn’t raised an alert.
- **Data Sources:** `o365:management:activity` with Exchange workloads, parsing `New-InboxRule`, `Set-InboxRule`, and `Set-Mailbox` operations; reuses the same enrichment lookups as the triage search.
- **Logic Highlights:** Explodes audit parameters, finds forwarding destinations, applies enrichment and a fused risk score, and outputs only materially suspicious forwarders.
- **ATT&CK Mapping:** `T1114.003 - Email Collection: Email Forwarding Rule` -- uncovering exfil attempts through malicious server-side forwarding.
