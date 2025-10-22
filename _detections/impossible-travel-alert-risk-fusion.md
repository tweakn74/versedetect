---
title: Impossible Travel Alert Risk Fusion
slug: impossible-travel-alert-risk-fusion
id: DET-0001
status: stable
severity: high
updated: 2025-10-20
product: Splunk
author: Craig Glatt
query_language: SPL
data_sources:
  - Microsoft Defender for Cloud Apps Alerts
  - Microsoft Defender for Identity Alerts
  - IP Reputation (AbuseIPDB, IPQS)
mitre:
  tactic: TA0006
  tactic_name: Credential Access
  technique: T1078
  technique_name: Valid Accounts
summary: Layers AbuseIPDB and IPQS intel over Defender "impossible travel" alerts to prioritize the sign-ins most likely tied to stolen credentials.
query: |
  | tstats summariesonly=t allow_old_summaries=t dc(_raw) AS events_by_alert earliest(_time) AS earliest latest(_time) AS latest values(alert_type) AS alert_type values(alert_display_name) AS alert_display_name from datamodel=Endpoint.Endpoint_Alerts where nodename=Endpoint.Alerts ("alert_type"="Impossible travel activity" OR alert_display_name IN ("Impossible travel activity","Impossible travel"))
  | rename Endpoint.Alerts.user AS raw_user Endpoint.Alerts.destination_ip AS dest_ip Endpoint.Alerts.risk_score AS defender_risk_score Endpoint.Alerts.alert_severity AS alert_severity Endpoint.Alerts.alert_id AS alert_id
  | eval user=coalesce(raw_user, user_principal_name, tostring('Endpoint.Alerts'.userPrincipalName,""), tostring('Endpoint.Alerts'.user,""))
  | where isnotnull(user) AND isnotnull(dest_ip)
  | lookup abuseipdb_all_ips ip AS dest_ip OUTPUTNEW abuseConfidenceScore AS abuse_score
  | ipqs ip=dest_ip
  | rename ipqs.vpn_and_proxy_score AS vpn_score
  | eval vpn_disposition=case(isnull(vpn_score),"Unknown", vpn_score>=75,"Likely VPN/Proxy", true(),"Low VPN likelihood")
  | eval intel_score=coalesce(abuse_score,0)
  | eval defender_score=coalesce(defender_risk_score,20)
  | eval triage_score=round(defender_score + intel_score + if(vpn_score>=75,25,0),0)
  | where triage_score>=50
  | eval reasons = mvappend(
      if(defender_score>=40,"High Defender baseline",null()),
      if(intel_score>=40,"High AbuseIPDB score",null()),
      if(vpn_score>=75,"VPN or proxy infrastructure",null())
    )
  | eval risk_reason=if(mvcount(reasons)>0, mvjoin(mvfilter(isnotnull(reasons)),"; "), "Impossible travel with credible IP risk")
  | table latest user dest_ip alert_severity defender_score abuse_score vpn_score vpn_disposition triage_score alert_id risk_reason
  | sort - triage_score latest
how_it_works: >
  Combines the raw Defender risk score with AbuseIPDB and IPQualityScore telemetry. The search keeps the alert-centric
  workflow (analysts pivot from the alert_id) but enriches each record with IP reputation confidence and a VPN
  disposition. Analysts triage only the events that clear the blended score of 50.
tuning: >
  - Tune the `triage_score` threshold upward if your AbuseIPDB baseline is noisy; 60 is typical for customers with broad
    geo footprint.  
  - Add allowlists for corporate VPN concentrators via `lookup corporate_access_ips dest_ip OUTPUT disposition`.  
  - Consider piping to Risk-Based Alerting with `| eval risk_object=user, risk_score=triage_score`.
downloads:
  - label: Download PDF
    url: /pdfs/Robust%20%E2%80%9CImpossible%20Travel%E2%80%9D%20in%20Splunk.pdf
related:
  - impossible-travel-adjacent-pair
---

## Why it matters

Stolen credentials continue to be the most reliable entry point into cloud environments. Microsoft’s built-in alerting
fires frequently, but the fidelity is inconsistent. Adding intel-driven risk scoring pushes the true intrusions to the
top of the queue without throwing away the near-real-time alert feed your SOC already depends on.

## Operational flow

1. Pull Defender “Impossible travel activity” alerts from Splunk’s Endpoint datamodel (or replace with your native
   index).  
2. Normalize user and destination IP fields, then enrich with AbuseIPDB and IPQS on the fly.  
3. Fuse the scores: Defender baseline + intel + VPN likelihood. Any alert that crosses the 50-point threshold bubbles to
   the top with context ready for the analyst.  
4. Optional: forward the result set to RBA or SOAR to auto-open high-scoring cases.
