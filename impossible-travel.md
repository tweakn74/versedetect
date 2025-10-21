---
layout: default
title: Robust "Impossible Travel" in Splunk -- Risk-Based Enrichment
---

# Robust "Impossible Travel" in Splunk -- Risk-Based Enrichment (SPL Included)

Full write-up PDF: [download](pdf/Robust%20%E2%80%9CImpossible%20Travel%E2%80%9D%20in%20Splunk.pdf)

## Overview
Two complementary approaches to high-fidelity detections: triage & enrich Defender alerts with intel/VPN risk, and direct detection of Entra sign-ins using haversine distance, adjacent pairing, and risk fusion.

## SPL Sections
(See PDF for SPL queries.)

## Detection Plays

### SPL A — Triage Defender "Impossible Travel" Alerts
- **Purpose:** Layer external telemetry over Microsoft Defender "Impossible travel activity" alerts so genuinely risky sign-ins float to the top.
- **Data Sources:** `azure:defender:cloudalert` (Defender for Cloud Apps) with enrichments from `abuseipdb_all_ips` and the `ipqs` command for VPN/proxy risk.
- **Logic Highlights:** Normalizes user/IP fields, looks up AbuseIPDB confidence, pulls VPN likelihood, then fuses the scores into a triage value (base 20 + intel + VPN boost). Alerts scoring ≥ 50 are surfaced with intel context.
- **ATT&CK Mapping:** `T1078 · Valid Accounts` (TA0006 Credential Access) — spotting adversaries abusing legitimate identities through impossible travel patterns.

### SPL B — Direct "Impossible Travel" from Sign-ins
- **Purpose:** Generate impossible-travel signals straight from Entra sign-in telemetry without waiting for Defender alerts.
- **Data Sources:** `azure:signinlogs` and optional `o365:management:activity` sign-in records, plus the same AbuseIPDB/IPQS enrichments.
- **Logic Highlights:** Pairs adjacent logins per user, geolocates both, computes Haversine distance and travel speed, flags events with ≥ 500 km and ≥ 900 km/h, then layers intel + VPN scoring before final filtering.
- **ATT&CK Mapping:** `T1078 · Valid Accounts` — catching illicit reuse of stolen accounts through rapid geo-jumps.
