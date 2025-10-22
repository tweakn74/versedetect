export interface MitreTechniqueDefinition {
  id: string;
  name: string;
}

export interface MitreTacticDefinition {
  id: string;
  name: string;
  techniques: MitreTechniqueDefinition[];
}

export const enterpriseMitreMatrix: MitreTacticDefinition[] = [
  {
    id: "TA0001",
    name: "Initial Access",
    techniques: [
      { id: "T1133", name: "External Remote Services" },
      { id: "T1190", name: "Exploit Public-Facing Application" },
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1566.001", name: "Phishing: Spearphishing Attachment" },
      { id: "T1189", name: "Drive-by Compromise" },
    ],
  },
  {
    id: "TA0002",
    name: "Execution",
    techniques: [
      { id: "T1059", name: "Command and Scripting Interpreter" },
      { id: "T1203", name: "Exploitation for Client Execution" },
      { id: "T1106", name: "Native API" },
      { id: "T1569.002", name: "System Services: Service Execution" },
      { id: "T1047", name: "Windows Management Instrumentation" },
    ],
  },
  {
    id: "TA0003",
    name: "Persistence",
    techniques: [
      { id: "T1547", name: "Boot or Logon Autostart Execution" },
      { id: "T1136", name: "Create Account" },
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1098", name: "Account Manipulation" },
      { id: "T1546", name: "Event Triggered Execution" },
    ],
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    techniques: [
      { id: "T1068", name: "Exploitation for Privilege Escalation" },
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1134", name: "Access Token Manipulation" },
      { id: "T1055", name: "Process Injection" },
      { id: "T1548", name: "Abuse Elevation Control Mechanism" },
    ],
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    techniques: [
      { id: "T1070", name: "Indicator Removal on Host" },
      { id: "T1027", name: "Obfuscated/Compressed Files & Information" },
      { id: "T1562", name: "Impair Defenses" },
      { id: "T1218", name: "System Binary Proxy Execution" },
      { id: "T1574", name: "Hijack Execution Flow" },
    ],
  },
  {
    id: "TA0006",
    name: "Credential Access",
    techniques: [
      { id: "T1003", name: "OS Credential Dumping" },
      { id: "T1555", name: "Credentials from Password Stores" },
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1110", name: "Brute Force" },
      { id: "T1552", name: "Unsecured Credentials" },
    ],
  },
  {
    id: "TA0007",
    name: "Discovery",
    techniques: [
      { id: "T1087", name: "Account Discovery" },
      { id: "T1046", name: "Network Service Discovery" },
      { id: "T1482", name: "Domain Trust Discovery" },
      { id: "T1083", name: "File and Directory Discovery" },
      { id: "T1016", name: "System Network Configuration Discovery" },
    ],
  },
  {
    id: "TA0008",
    name: "Lateral Movement",
    techniques: [
      { id: "T1021", name: "Remote Services" },
      { id: "T1072", name: "Software Deployment Tools" },
      { id: "T1046", name: "Network Service Discovery" },
      { id: "T1550", name: "Use Alternate Authentication Material" },
      { id: "T1563", name: "Remote Service Session Hijacking" },
    ],
  },
  {
    id: "TA0009",
    name: "Collection",
    techniques: [
      { id: "T1114", name: "Email Collection" },
      { id: "T1114.003", name: "Email Collection: Email Forwarding Rule" },
      { id: "T1056", name: "Input Capture" },
      { id: "T1530", name: "Data from Cloud Storage" },
      { id: "T1115", name: "Clipboard Data" },
    ],
  },
  {
    id: "TA0010",
    name: "Command and Control",
    techniques: [
      { id: "T1071", name: "Application Layer Protocol" },
      { id: "T1132", name: "Data Encoding" },
      { id: "T1001", name: "Data Obfuscation" },
      { id: "T1105", name: "Ingress Tool Transfer" },
      { id: "T1090", name: "Proxy" },
    ],
  },
  {
    id: "TA0011",
    name: "Exfiltration",
    techniques: [
      { id: "T1041", name: "Exfiltration Over C2 Channel" },
      { id: "T1048", name: "Exfiltration Over Alternative Protocol" },
      { id: "T1567", name: "Exfiltration Over Web Service" },
      { id: "T1020", name: "Automated Exfiltration" },
      { id: "T1651", name: "Exfiltration for Impact" },
    ],
  },
  {
    id: "TA0040",
    name: "Impact",
    techniques: [
      { id: "T1489", name: "Service Stop" },
      { id: "T1490", name: "Inhibit System Recovery" },
      { id: "T1499", name: "Endpoint Denial of Service" },
      { id: "T1486", name: "Data Encrypted for Impact" },
      { id: "T1565", name: "Data Manipulation" },
    ],
  },
  {
    id: "TA0042",
    name: "Resource Development",
    techniques: [
      { id: "T1583", name: "Acquire Infrastructure" },
      { id: "T1584", name: "Compromise Infrastructure" },
      { id: "T1608", name: "Stage Capabilities" },
      { id: "T1587", name: "Develop Capabilities" },
      { id: "T1585", name: "Establish Accounts" },
    ],
  },
  {
    id: "TA0043",
    name: "Reconnaissance",
    techniques: [
      { id: "T1590", name: "Gather Victim Network Information" },
      { id: "T1591", name: "Gather Victim Org Information" },
      { id: "T1598", name: "Phishing for Information" },
      { id: "T1595", name: "Active Scanning" },
      { id: "T1592", name: "Gather Victim Identity Information" },
    ],
  },
];
