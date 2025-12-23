---
layout: post
title: GPU-GLMB - Assessing the Scalability of GPU-Accelerated Multi-Hypothesis Tracking
permalink: /projects/gpu-glmb/
---

<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
  };
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>

## GPU-GLMB: Assessing the Scalability of GPU-Accelerated Multi-Hypothesis Tracking

**Objective:** To develop and evaluate a scalable, GPU-accelerated implementation of the Generalized Labeled Multi-Bernoulli (GLMB) filter that supports multiple detections per object.

---

## 1. Motivation
Multi-object tracking (MOT) is fundamental to autonomous systems, but rigorous Bayesian approaches face significant computational hurdles.
* **The Computational Bottleneck:** The standard GLMB filter provides an exact closed-form solution to the multi-target Bayes recursion, but its complexity grows combinatorially with the number of tracks and measurements.
* **The Sensor Problem:** Standard formulations assume point-target models (at most one detection per object). However, modern computer vision-based sensors often generate multiple overlapping detections for a single object, breaking these assumptions.
* **The Parallelization Gap:** Existing approximations (like K-best or Gibbs sampling) are inherently sequential, making them poor candidates for GPU acceleration. We aimed to break these dependencies to unlock massive parallelism.

---

## 2. Approach: A Parallelizable GLMB Filter
We proposed a modified GLMB filter designed specifically to break the inter-dependence between detections during the hypothesis generation step.

### The Modified Formulation
Instead of enforcing a strict one-to-one measurement-to-track constraint, we allow multiple detections per object. By ignoring cardinality priors during the proposal generation, we can sample associations from a completely independent proposal distribution.

This allows us to construct the **Joint Compatibility Matrix** $C_k$ in parallel:

$$C_k[i,j] = \begin{cases} g_{ijk} \cdot L(z_{i,k} | x_{j,k}) & \text{for } j=1,\dots,T_k \\ \kappa & \text{for } j=0 \text{ (clutter)} \end{cases}$$

Where $L(z|x)$ is the measurement likelihood and $\kappa$ is the clutter intensity.

### Parallel Hypothesis Generation
Because our formulation breaks the coupling between measurement assignments, we can perform the entire update step—including hypothesis generation, weighting, and pruning—as batch operations parallelized across hypotheses, measurements, and tracks.

---

## 3. Technical Implementation
We developed **GPU-GLMB**, a fully vectorized implementation of this tracker.
* **Framework:** Implemented in Python using **PyTorch** to leverage tensor acceleration on GPUs while remaining accessible for research.
* **Hardware Tested:** We evaluated scalability across a range of devices:
    * **Server GPU:** Nvidia L40S, Nvidia 2080Ti
    * **Edge GPU:** Nvidia Orin NX
    * **CPU:** Intel 6526Y
* **Dataset:** We created a benchmark using high-precision GPS ground truth data from the IoBT-MAX testbed, simulating convoys of objects to control density ($N \in \{1, \dots, 20\}$ objects).

> **Visualization of Ground Truth**
>
> ![Visualization of testbed ground truth track]({{ site.baseurl }}/media/gpu_glmb_groundtruth.png)
> *Figure: The ground truth trajectory collected using high-precision GPS, used to simulate multi-object scenarios.*

---

## 4. Key Results

### Computational Scalability
Our results demonstrate that the GPU-accelerated implementation dramatically outperforms CPU baselines as the problem size increases.
* **Real-Time Performance:** The Nvidia L40S GPU maintained an average update time well under the real-time threshold (0.1s) even for the most intensive scenarios (20 objects, 100 hypotheses).
* **Scaling:** While the Edge GPU (Orin NX) struggled with high object counts, Server GPUs showed excellent scalability, with the L40S exhibiting almost flat run-time growth as the number of hypotheses increased.

> **Run Time Analysis**
>
> ![Time per Update vs Hmax for different GPUs]({{ site.baseurl }}/media/gpu_glmb_runtime.png)
> *Figure: Update time vs. Maximum Hypotheses ($H_{max}$). The Server GPUs (L40S, 2080Ti) significantly outperform the CPU for scenarios with 5+ objects.*

### Tracking Accuracy
Despite the approximations required for speed, the tracker maintained high accuracy.
* **Cardinality Error:** The relative error in estimating the number of objects was less than **2%** for scenarios with up to 10 objects.
* **Localization Error:** The average tracking error was consistently below **0.15m** across all configurations.

> **Accuracy Metrics**
>
> ![Cardinality and Tracking Error plots]({{ site.baseurl }}/media/gpu_glmb_accuracy.png)
> *Figure: (Left) Relative cardinality error remains low (<2%) for most configurations. (Right) Tracking error remains stable regardless of the hypothesis count.*

---

## 5. Conclusion
We successfully demonstrated that by modifying the GLMB formulation to allow multiple detections per object, we can break the dependencies that traditionally force sequential processing. The resulting **GPU-GLMB** tracker leverages modern GPU parallelism to achieve real-time performance on server-class hardware, enabling robust tracking for complex multi-object scenarios.

Future work will focus on integrating this into heterogeneous compute networks, where edge nodes handle detection and server nodes handle fusion.

---

### Read the Full Publication
For the complete derivation of the modified GLMB update and detailed experimental graphs, please refer to the preprint.

[**Download Publication (PDF)**]([INSERT_YOUR_GOOGLE_DRIVE_LINK_HERE](https://www.arxiv.org/abs/2512.06230))

<br>
[← Back to Home]({{ site.baseurl }}/)
