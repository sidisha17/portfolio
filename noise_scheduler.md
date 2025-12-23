---
layout: post
title: Exploring Noise Schedulers in DIffusion Models
permalink: /projects/noise-schedule/
---

##  Exploring Noise Schedulers in DIffusion Models

**Objective:** To investigate the impact of different noise schedulers (Cosine, Sine, Laplace) and formulations (VP vs. Sub-VP) on the training and sampling quality of Denoising Diffusion Probabilistic Models (DDPM).
**Role:** Researcher (Course Project)
**Tech Stack:** Python, PyTorch, CIFAR-10, Diffusion Models, UNet Architecture.

---

## 1. Motivation
Diffusion models have gained significant attention for high-quality generation, but their performance depends heavily on the noise schedule—how noise is introduced during training and removed during sampling.
* **The Problem:** Standard noise schedules often lead to suboptimal training. Analogous to human "eyes and ears," models are more sensitive to specific frequencies (noise levels).
* **The Goal:** We aimed to identify whether allowing models to prioritize lower frequencies (higher noise levels) or high frequencies (texture) via specific schedulers yields better image quality. We specifically investigated if aggressively focusing on mid-range noise levels (using Laplace schedules) outperforms standard baselines.

---

## 2. Methodology & Formulations
We formulated all computations in terms of the Log-Signal-to-Noise Ratio ($\lambda = \log \text{SNR}$) to directly measure information obscured by noise and allow fair comparison across formulations.

### Formulations Tested
* **Variance Preserving (VP):** The standard formulation where $\alpha(t) = \sqrt{1-\sigma(t)^2}$, ensuring total variance remains 1. We used the Cosine schedule as a baseline here.
* **Sub-Variance Preserving (Sub-VP):** A formulation where $\alpha(t) = 1-\sigma(t)$, leading to $Var[x_t] \le 1$, which can potentially allow for straighter sampling paths.

### Noise Schedulers
We implemented and compared three distinct noise probability distributions $p(\lambda)$:
1.  **Cosine Schedule (Baseline):** Used in the VP formulation, providing a broad distribution of noise levels.
2.  **Sine Schedule (Custom for Sub-VP):** Since the standard Cosine math applies specifically to VP, we derived a "Sine" schedule for the Sub-VP formulation to mimic similar behavior.
3.  **Laplace Schedule:** Focuses aggressively on specific noise levels (typically near $\lambda=0$), hypothesized to improve training efficiency.

> **Visualizing the Noise**
>
> ![Comparison of Noise Probability Density Functions]({{ site.baseurl }}/media/noise-schedule.png)
> *Figure: Comparison between the probability density functions of $\lambda$, $p(\lambda)$, in different model formulations. The Laplace schedule shows a much sharper peak compared to Cosine or Sine.*

---

## 3. Technical Implementation
* **Architecture:** A standard DDPM with a UNet backbone (~100M parameters) trained from scratch on CIFAR-10.
* **Training:** Batch size of 256 for 130 epochs using the AdamW optimizer with OneCycleLR.
* **Sampling Strategies:** We compared Bayesian sampling against EDM (Elucidating Design Space), Cosine, and Shifted Cosine samplers.
* **Evaluation:** We used **FID-3k** (calculated on 3000 images due to compute limitations) and a custom classification score tuned for CIFAR-10 for rapid iteration.

---

## 4. Key Results

### Quantitative Analysis
We found that the **Cosine VP (Baseline)** and **EDM Samplers** generally performed best in our limited-compute setting. While the Laplace schedule is theoretically superior for efficiency, the broad coverage of the Cosine schedule produced consistent results.

| Model / Schedule | Formulation | FID Score (3k) |
| :--- | :--- | :--- |
| **Cosine (s=1)** | VP | **167.86** |
| Laplace (b=3) | VP | 168.26 |
| Sine (s=1) | Sub-VP | 168.75 |
| Laplace (b=2) | Sub-VP | 169.61 |

### Qualitative Analysis
We observed that aggressively focusing too much on mid-range noise levels (as seen in certain Laplace configurations) did not yield significant visual improvements over the baseline in this specific setup.

> **Generated Samples**
>
> <div style="display: flex; gap: 10px;">
>   <div style="flex: 1;">
>     <img src="{{ site.baseurl }}/media/cosine.png" alt="Cosine VP Samples" />
>     <p><em>Samples generated using Cosine (s=1) VP.</em></p>
>   </div>
>   <div style="flex: 1;">
>     <img src="{{ site.baseurl }}/media/laplace.png" alt="Laplace VP Samples" />
>     <p><em>Samples generated using Laplace (b=2) VP.</em></p>
>   </div>
> </div>

---

## 5. Conclusion & Future Work
In this study, we observed that while advanced schedules like Laplace offer theoretical benefits, the Cosine and EDM samplers remain highly robust baselines. The "Sine" schedule we derived for Sub-VP was competitive but did not outperform the VP formulation.

**Future directions:**
* **Expanded Training:** Extend training to millions of iterations to capture long-term trends.
* **Robust Metrics:** Calculate FID on 50k samples to align with industry standards.
* **Shifted Schedules:** Further investigate the trade-offs of focusing on specific noise levels (Shifted Left/Right).

---

### Read the Full Report
For the complete mathematical derivations of the Sine/Laplace schedules and detailed training configurations, please view the full project report.

[**Read Project Report (PDF)**](https://drive.google.com/file/d/1RvblAjdm7GzypdYL2D2kuFxjf2APbt4d/view?usp=drive_link)

<br>
[← Back to Home]({{ site.baseurl }}/)
