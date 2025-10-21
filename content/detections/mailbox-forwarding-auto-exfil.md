---
title: Mailbox Forwarding Rule Exfil Detector
slug: mailbox-forwarding-auto-exfil
id: DET-0003
status: stable
severity: critical
last_updated: 2025-10-21
product: Splunk
author: Craig Glatt
query_language: SPL
data_sources:
  - Microsoft Defender for Office 365 Alerts
  - Exchange Online Management Activity (Unified Audit Log)
  - Domain Reputation (OTX, OpenPhish, IPQS)
mitre:
  tactic: TA0009
  tactic_name: Collection
  technique: T1114.003
  technique_name: Email Collection: Email Forwarding Rule
summary: Enriches Defender alerts and Exchange audit events for auto-forward rules with freemail, disposable, WHOIS, and phishing telemetry to expose stealth exfiltration.
query: |
  index=o365 sourcetype=o365:management:activity Workload=Exchange* Operation IN ("New-InboxRule","Set-InboxRule","Set-Mailbox")
  | spath input=Parameters
  | mvexpand Parameters{}
  | eval param_name=mvindex(Parameters{}.Name,0), param_value=mvindex(Parameters{}.Value,0)
  | eval actor=coalesce(UserId, UserKey, ActorUPN)
  | eventstats values(param_value) AS values_by_event BY _time, actor, Operation, Id
  | eval raw_values=lower(mvjoin(values_by_event,";"))
  | where like(raw_values,"%forward%") OR like(raw_values,"%redirect%")
  | rex field=raw_values max_match=10 "(?i)(?<forward_to>[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,})"
  | mvexpand forward_to
  | eval forward_to=trim(forward_to)
  | rex field=forward_to "(?i)@(?<forward_domain>[^ >;,'\"]+)$"
  | lookup freemail_domains domain AS forward_domain OUTPUT is_freemail
  | lookup disposable_domains domain AS forward_domain OUTPUT is_disposable
  | lookup whois_domains domain AS forward_domain OUTPUT created_epoch
  | eval domain_age_days=if(isnull(created_epoch), null(), round((now()-created_epoch)/86400,1))
  | lookup otx_domains domain AS forward_domain OUTPUT otx_pulse_count
  | lookup openphish_domains domain AS forward_domain OUTPUT openphish_flag
  | ipqs domain=forward_domain
  | rename ipqs.domain_risk_score AS domain_risk
  | eval risk = 25
    + case(is_freemail="Yes",10, true(),0)
    + case(is_disposable="Yes",25, true(),0)
    + case(isnotnull(domain_age_days) AND domain_age_days<=30,20, true(),0)
    + case(coalesce(otx_pulse_count,0)>=1,20, true(),0)
    + case(coalesce(openphish_flag,0)>=1,25, true(),0)
    + round(coalesce(domain_risk,0)/5,0)
  | where risk>=50
  | eval rule_display=mvjoin(values_by_event,"; ")
  | table _time actor Operation rule_display forward_to forward_domain is_freemail is_disposable domain_age_days otx_pulse_count openphish_flag domain_risk risk
  | sort - risk
how_it_works: >
  The search inspects Exchange Unified Audit Log activity for new or modified inbox rules and mailbox settings. It
  focuses on entries that include forwarding or redirect actions, enriches the destination domain with multiple
  reputation sources, and produces a blended risk score. Analysts receive a concise view of the forward target plus the
  intel context that justifies response.
tuning_notes: >
  - Maintain up-to-date freemail/disposable lists; update weekly to catch new throwaway providers.  
  - Add a lookup of approved forwarding domains (`approved_forward_domains`) to automatically suppress business-justified
    destinations.  
  - If you collect Defender alerts, combine them with this search in RBA to collapse duplicate events into one notable.
downloads:
  - label: Download PDF
    url: /pdf/Robust%20Inbox%20Forwarding%20Rule%20Exfil%20in%20Splunk.pdf
related:
  - impossible-travel-alert-risk-fusion
  - impossible-travel-adjacent-pair
---

## Dual-source coverage

This detector doubles as a triage surface for Defender’s “Suspicious inbox forwarding rule” alert and as a direct signal
from the Unified Audit Log. Even if Defender misses the forwarding rule, the Exchange telemetry still raises the flag
with the same enrichment and risk scoring.

## Quick response guidance

- Confirm whether the destination domain is business-approved. Disposable domains and newly registered domains are
  high-fidelity indicators of compromise.  
- Disable the forwarding rule and force a password reset for the impacted account.  
- Hunt for additional inbox rules across the tenant using the `rule_display` values output by the search.
