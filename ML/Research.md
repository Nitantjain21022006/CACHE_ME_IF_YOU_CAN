# Research & Model Selection Rationale

## Overview

This project focuses on building a **practical, production-aware security monitoring system** across multiple sectors (Healthcare, Agriculture, Urban Infrastructure).  
Rather than optimizing purely for academic metrics, our goal was to balance:

- Detection capability
- Explainability
- Low operational overhead
- Real-world deployability

To achieve this, we adopted a **hybrid ML architecture** combining:
- Unsupervised anomaly detection
- Supervised attack classification

---

## Problem Breakdown

Security monitoring presents two distinct ML tasks:

1. **Detecting anomalous behavior** in high-volume, noisy environments  
2. **Classifying detected events** into meaningful security severities

These tasks have fundamentally different data characteristics and constraints, which motivated a **two-model approach**.

---

## Model Selection Summary

| Task                  | Model                | Why                                                                 |
| --------------------- | -------------------- | ------------------------------------------------------------------- |
| Anomaly Detection     | **Isolation Forest** | Unsupervised, scalable, low false-positive bias                      |
| Attack Classification | **XGBoost**          | High accuracy, explainable, robust on tabular security data          |

---

## Anomaly Detection: Isolation Forest

### Why Anomaly Detection Is Unsupervised

In real-world security systems:
- True attack data is **rare**
- Labels are **incomplete or noisy**
- New attack patterns emerge constantly

This makes supervised anomaly detection impractical.

### Why Isolation Forest

Isolation Forest (IF) works by **isolating anomalies instead of profiling normal behavior**, making it well-suited for security telemetry.

**Key advantages:**
- No labeled attack data required
- Linear scalability with large datasets
- Low computational overhead
- Resistant to feature scaling issues
- Effective for high-dimensional telemetry data

**Why not alternatives?**
- Autoencoders require careful tuning and large clean datasets
- One-Class SVMs scale poorly with large volumes
- Statistical thresholds are brittle and domain-specific

Isolation Forest is widely used in **production security systems** for first-pass anomaly filtering.

---

## Attack Classification: XGBoost

### Why Classification Is Needed

Not all anomalies are attacks.  
Classification allows us to:
- Distinguish benign anomalies from malicious behavior
- Assign meaningful severity levels (LOW / MEDIUM / HIGH)
- Improve analyst trust through explainability

### Why XGBoost

XGBoost is a gradient-boosted decision tree model optimized for structured data.

**Key advantages:**
- State-of-the-art performance on tabular datasets
- Handles non-linear feature interactions naturally
- Robust to missing and noisy data
- Built-in feature importance for explainability
- Fast inference suitable for real-time pipelines

**Why not deep learning?**
- Neural networks reduce explainability
- Require significantly more labeled data
- Higher operational and tuning cost
- Poor fit for structured security telemetry

XGBoost strikes the ideal balance between **accuracy and interpretability**, which is critical in security contexts.

---

## Hybrid Architecture Rationale

Our architecture deliberately separates:
- **Detection** (Isolation Forest)
- **Decision-making** (XGBoost + contextual logic)

This design mirrors real-world SOC systems where:
- ML is conservative by default
- Severity escalation requires contextual validation
- False positives are managed at the alerting layer

This separation allows:
- Better false-positive control
- Sector-specific severity interpretation
- Safer deployment in critical environments

---

## Explainability & Operational Trust

Explainability was a core requirement.

- Isolation Forest provides anomaly scores for transparency
- XGBoost provides feature importance for severity reasoning
- Backend logic adds contextual explanations (event rate, integrity, operation type)

This layered explanation improves:
- Analyst confidence
- Debuggability
- Regulatory acceptability

---

## Limitations & Future Work

Current limitations:
- Per-event ML inference (temporal context handled outside ML)
- Limited labeled attack diversity

Future improvements:
- ML-side temporal aggregation
- Adaptive confidence calibration
- Semi-supervised learning with analyst feedback loops

---

## References

1. Liu, F. T., Ting, K. M., & Zhou, Z.-H. (2008).  
   **Isolation Forest**.  
   *Proceedings of the 8th IEEE International Conference on Data Mining.*  
   https://ieeexplore.ieee.org/document/4781136

2. Chen, T., & Guestrin, C. (2016).  
   **XGBoost: A Scalable Tree Boosting System**.  
   *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining.*  
   https://dl.acm.org/doi/10.1145/2939672.2939785

3. Sommer, R., & Paxson, V. (2010).  
   **Outside the Closed World: On Using Machine Learning for Network Intrusion Detection**.  
   *IEEE Symposium on Security and Privacy.*  

4. Chandola, V., Banerjee, A., & Kumar, V. (2009).  
   **Anomaly Detection: A Survey**.  
   *ACM Computing Surveys.*

5. Google Cloud Security Whitepaper (2021).  
   **Practical ML for Security Operations**.

---

## Conclusion

The combination of Isolation Forest and XGBoost provides a **robust, explainable, and production-ready ML foundation** for security monitoring.  
Rather than pursuing purely academic novelty, this approach prioritizes **reliability, interpretability, and operational realism**, which are essential for real-world security systems.