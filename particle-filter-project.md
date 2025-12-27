---
layout: post
title: Particle Filter Tracker Project
permalink: /projects/particle-filter/
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

<style>
a {
    color: #c3e88d !important; /* A warm amber for links */
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
h1, h2, h3 {
    color: #91b859 !important; /* A slightly deeper orange for headings */
}

</style>


# Particle Filter based Tracker for Geospatial Tracking

**Objective:** To build a robust single-object tracker using Bayesian filtering, enhanced with deep learning (Differentiable PFs) and environmental constraints.

---

## 1. The Problem: From a Bounding Box to a Coherent Trajectory

The goal of this project was to track a single vehicle (car, bus, or truck) as it moved within an indoor environment monitored by a distributed network of four cameras. The pipeline operates in three stages:
1.  **Detection:** Cameras provide raw visual data, and a model extracts bounding boxes.
2.  **Projection:** A camera model projects these 2D boxes into the real-world 2D plane, providing a position mean ($\mu$) and standard deviation ($\sigma$).
3.  **Bayesian Tracking:** To stitch these uncertain measurements into a coherent trajectory, I implemented a **Bootstrap Particle Filter**.


A standard Kalman Filter is often insufficient here because vehicle motion can be highly non-linear. I implemented and compared two specific motion models:
* **Constant Velocity (CV):** Assumes linear motion, simple but struggles with sharp turns.
* **Constant Turn Rate and Velocity (CTRV):** Models the vehicle's yaw rate, allowing it to better capture curving trajectories even when detections are temporarily lost.

---

## 2. Enhancements for Robustness

To improve the baseline filter, I explored several advanced techniques to handle data sparsity and efficiency.

### Auxiliary Particle Filter (APF)
A standard Bootstrap PF predicts particle movement *without* considering the latest measurement. This often leads to "sample impoverishment," where the Effective Sample Size (ESS) drops significantly (often below 50%) because particles drift into low-likelihood regions.

I implemented an **Auxiliary Particle Filter (APF)**, which incorporates the current measurement into the proposal mechanism. By "looking ahead" and prioritizing particles compatible with the new observation, the APF maintained robust performance even with significantly fewer particles.
* **Result:** While the standard PF degraded significantly at **150 particles**, the APF maintained high accuracy, drastically reducing computational cost.

![PF vs APF at 150 Particles]({{ site.baseurl }}/media/pf_vs_apf.png)
<div class="caption">Figure: At 150 particles, the standard PF (left) fails to track, while the APF (right) maintains a stable lock.</div>

### Birth and Death Model
Real-world tracking requires handling vehicles entering and leaving the frame. I implemented a logic-based **birth and death model**:
* **Birth:** A new track is initiated when measurements cannot be associated with existing tracks.
* **Death:** A track score is decremented during missed detections; if it drops below a threshold, the track is terminated.

---

## 3. The Deep Learning Twist: A Differentiable Particle Filter

A traditional PF relies on hand-tuned parameters like process noise covariance. To automate this, I developed an end-to-end **Differentiable Particle Filter (DPF)**. This allows the filter to *learn* its own parameters (e.g., acceleration standard deviation) via backpropagation.

This required two critical technical modifications to make the algorithm differentiable:
1.  **Re-parameterization Trick:** Used to allow gradients to flow through the stochastic sampling step.
2.  **Soft Resampling:** Replaced standard multinomial resampling with a "soft" approach that blends uniform distributions, ensuring gradients aren't cut off.

**Training Challenges:** I trained the model using a Negative Log-Likelihood (NLL) loss. The process revealed that the loss landscape for PFs is highly rugged due to Monte Carlo noise, often requiring techniques like gradient clipping or diagonal jitter for stability.

---

## 4. The Flexibility Advantage: Particle Filters with Constraints

When detections are lost, particles can drift into impossible areas (e.g., through walls). I constrained particles within known room boundaries using two methods:
1.  **Particle Rejection/Clamping:** If a predicted particle falls out of bounds, it is either resampled or clamped to the boundary edge with zero perpendicular velocity.
2.  **Weight Modification:** Out-of-bounds particles are heavily penalized during the weight update, effectively killing them off during resampling.

![Constraints Visualization]({{ site.baseurl }}/media/pf_constraints.png)
<div class="caption">Figure: Without constraints (top), particles drift through walls. With constraints (bottom), the particles remain bounded and generate a physically realistic track.</div>

---

[**Read Project Report (PDF)**](https://drive.google.com/file/d/1TMgfTS-SR8dvIsYoiP7W4151wfYf4U2Y/view?usp=drive_link)

<br>
[← Back to Home]({{ site.baseurl }}/)
