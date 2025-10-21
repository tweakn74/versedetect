---
layout: default
title: Versedetect
---

# Versedetect
*Advanced Threat Detection & Response Engineering by Craig Glatt*

![Bart MFA](assets/bart-mfa.jpg)

Welcome -- this is my working notebook for high-fidelity **SIEM detections**, **enrichment logic**, and **threat-hunting** patterns across Splunk and friends.

## Featured Detections
- [Robust "Impossible Travel" in Splunk -- Risk-Based Enrichment (SPL Included)](impossible-travel.md)
- [Robust Inbox Forwarding Rule Exfil in Splunk -- Risk-Based Enrichment (SPL Included)](inbox-forwarding.md)

## Detection Coverage

<div class="mitre-section">
  <p>Quick glance at how the current detections light up the MITRE ATT&CK matrix. New content will continue to expand coverage tactic-by-tactic.</p>

  <div class="mitre-matrix">
    <div class="tactic-card">
      <h3>Credential Access</h3>
      <ul>
        <li>
          <a href="impossible-travel.html#spl-a-triage-defender-impossible-travel-alerts">Impossible Travel Alert Triage</a>
          <span class="tech-id">T1078 - Valid Accounts</span>
        </li>
        <li>
          <a href="impossible-travel.html#spl-b-direct-impossible-travel-from-sign-ins">Adjacent-Pair Impossible Travel Detector</a>
          <span class="tech-id">T1078 - Valid Accounts</span>
        </li>
      </ul>
    </div>
    <div class="tactic-card">
      <h3>Collection</h3>
      <ul>
        <li>
          <a href="inbox-forwarding.html#spl-b-direct-detector-from-exchange-unified-audit-log">Mailbox Forwarding Rule Exfil</a>
          <span class="tech-id">T1114.003 - Exfil via Forwarding Rule</span>
        </li>
      </ul>
    </div>
    <div class="tactic-card">
      <h3>Roadmap</h3>
      <ul>
        <li>More detections coming online soon.</li>
      </ul>
    </div>
  </div>
</div>

---
**About**  
15 years in threat detection & response, SOC leadership, and automation.  
Connect: [LinkedIn](https://www.linkedin.com/in/craig-glatt-8a06362)
