# 🧠 Automated Resolution for LOW & MEDIUM Alerts

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

Briefly show LOW / MEDIUM as LIVE_THREAT 

Then automatically transition to:

RESOLVED

