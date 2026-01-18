# 🧠 Task 2: Automated Resolution for LOW & MEDIUM Alerts

## 🎯 Objective

Implement **automatic response and auto-resolution** for **LOW** and **MEDIUM** severity alerts in the system.

---

## ✅ Desired Behavior

### 🟢 LOW Severity
- Must be **automatically mitigated**
- Must automatically move **Operational State**:


LIVE_THREAT → RESOLVED

- No human intervention required

### 🟡 MEDIUM Severity
- Must be **automatically mitigated**
- Must automatically move **Operational State**:


LIVE_THREAT → RESOLVED

- No human intervention required

### 🔴 HIGH Severity
- Must remain **manual**
- Must stay in:


LIVE_THREAT

- Must require **human action** to resolve
- ⚠️ This behavior already works — **DO NOT BREAK IT**

---

## 🧱 Current System Context

- The system already:
- Classifies alerts as: `LOW | MEDIUM | HIGH`
- Displays **Operational State** on the Dashboard
- Has a working **manual resolution flow** for HIGH severity

- We are adding:
- An **automatic resolution pipeline** for LOW and MEDIUM only

---

## 🛠️ Implementation Requirements

1. When an alert is created with:
 ```js
 severity === "LOW" || severity === "MEDIUM"
the system must:

Trigger an automated response handler

Mark the alert as:

status = "RESOLVED"
operational_state = "RESOLVED"
resolution_type = "AUTOMATED"


This should happen automatically (no button click, no UI action)

When:

severity === "HIGH"

Do nothing

Keep existing manual workflow untouched

The Dashboard must:

Briefly show LOW / MEDIUM as LIVE_THREAT (optional)

Then automatically transition to:

RESOLVED


Architecture Rules

❌ Do NOT change:

ML models

Severity logic

Classification pipeline

✅ Only modify:

Alert lifecycle handling

Alert state machine

Backend resolution flow

🧪 Acceptance Criteria

 Sending a LOW alert:

Automatically becomes RESOLVED

Dashboard shows RESOLVED

resolution_type = "AUTOMATED"

 Sending a MEDIUM alert:

Automatically becomes RESOLVED

Dashboard shows RESOLVED

resolution_type = "AUTOMATED"

 Sending a HIGH alert:

Remains LIVE_THREAT

Requires manual action

Existing behavior remains unchanged

🧾 Optional Enhancements

Add log entry: "Auto-resolved LOW/MEDIUM severity alert"


## Final Goal

LOW and MEDIUM alerts should behave like self-healing incidents.
Only HIGH alerts should behave like true incidents requiring human intervention.