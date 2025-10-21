---
title: Adjacent Pair Impossible Travel Detector
slug: impossible-travel-adjacent-pair
id: DET-0002
status: preview
severity: high
last_updated: 2025-10-21
product: Splunk
author: Craig Glatt
query_language: SPL
data_sources:
  - Entra ID Sign-in Logs
  - Azure AD Sign-in Risk
  - IP Reputation (AbuseIPDB, IPQS)
mitre:
  tactic: TA0006
  tactic_name: Credential Access
  technique: T1078
  technique_name: Valid Accounts
summary: Streams Entra sign-ins, pairs consecutive logons per user, and flags impossible travel using Haversine distance plus IP intelligence.
query: |
  | tstats summariesonly=t allow_old_summaries=t count FROM datamodel=Authentication WHERE nodename=Authentication.Successful_Authentication BY Authentication.user, Authentication.src, _time
  | rename Authentication.user AS user Authentication.src AS src_ip
  | lookup geo_by_src ip AS src_ip OUTPUTNEW lat AS src_lat lon AS src_lon country
  | where isnotnull(user) AND isnotnull(src_ip) AND isnotnull(src_lat) AND isnotnull(src_lon)
  | sort 0 user _time
  | streamstats current=f window=1 last(_time) AS prev_time last(src_ip) AS prev_ip last(src_lat) AS prev_lat last(src_lon) AS prev_lon last(country) AS prev_country BY user
  | where isnotnull(prev_time) AND prev_ip != src_ip
  | eval delta_min=round((_time - prev_time)/60,1)
  | where delta_min>0 AND delta_min<=1440
  | eval dlat=(src_lat-prev_lat)*pi()/180, dlon=(src_lon-prev_lon)*pi()/180
  | eval a=pow(sin(dlat/2),2)+cos(prev_lat*pi()/180)*cos(src_lat*pi()/180)*pow(sin(dlon/2),2)
  | eval distance_km=round(6371*2*asin(min(1,sqrt(a))),1)
  | eval speed_kmph=round(distance_km/(delta_min/60),1)
  | eval impossible=if(distance_km>=500 AND speed_kmph>=900,1,0)
  | lookup abuseipdb_all_ips ip AS src_ip OUTPUTNEW abuseConfidenceScore AS abuse_score
  | ipqs ip=src_ip
  | rename ipqs.vpn_and_proxy_score AS vpn_score
  | eval risk = (impossible*60) + round(coalesce(abuse_score,0),0) + if(vpn_score>=75,20,0)
  | where impossible=1 OR risk>=60
  | eval reasons = mvappend(
      if(impossible=1,"Impossible travel geometry",null()),
      if(coalesce(abuse_score,0)>=40,"High AbuseIPDB confidence",null()),
      if(vpn_score>=75,"Likely VPN or proxy infrastructure",null())
    )
  | eval reason=if(mvcount(reasons)>0, mvjoin(mvfilter(isnotnull(reasons)),"; "), "Impossible travel with supporting intel")
  | table _time user prev_time prev_ip src_ip prev_country country distance_km speed_kmph abuse_score vpn_score risk reason
  | sort - _time
how_it_works: >
  A streaming pairing model compares each successful logon to the prior entry for the same user. It calculates
  geodesic distance and travel speed, then layers AbuseIPDB and IPQS intel. High-risk pairs (>= 500 km and >= 900 km/h)
  or any pair with a fused risk of 60 are emitted.
tuning_notes: >
  - If airline travel is common, increase the distance threshold to 800 km or require speed >= 1100 km/h.  
  - Add `lookup trusted_vpn_ip dest_ip OUTPUT disposition` to suppress corporate VPN endpoints.  
  - Enrich with Azure AD sign-in risk by joining to the `Risk` datamodel if available.
downloads:
  - label: Download PDF
    url: /pdf/Robust%20%E2%80%9CImpossible%20Travel%E2%80%9D%20in%20Splunk.pdf
related:
  - impossible-travel-alert-risk-fusion
  - mailbox-forwarding-auto-exfil
---

## Analyst workflow

1. Operates as a scheduled search (every 5 minutes works well) against the Authentication datamodel populated with Entra
   sign-in logs.  
2. Emit triaged events to your notable index or RBA framework with `risk_object=user` and the computed `risk` score.  
3. Analysts review the travel geometry, IP intel, and paired context directly in their case queue.

## Enrichment dependencies

- `geo_by_src` lookup (Splunk-provided) for latitude/longitude.  
- `abuseipdb_all_ips` lookup (day-old feed is acceptable).  
- `ipqs` custom command or macro to retrieve VPN/proxy likelihood scores.
