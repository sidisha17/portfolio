# A little bit about me

[Education](#education) • [Projects](#projects) • [Publications](#publications) • [Work Experience](#work-experience)

## Education
- M.S., Computer Science | University of Massachusetts, Amherst (Aug 2024 - May 2026)
- B.Sc., Programming and Data Science | Indian Institute of Technology Madras, India (Jan 2021 - May 2024)
- B.E., Mechanical Engineering | Birla Institute of Technology and Science Pilani, India (Aug 2016 – May 2020)

## Projects

###  Particle Filter based Tracker for Geospatial Tracking
I developed a sophisticated Bayesian particle filter to track objects in complex real-world geospatial data from a distributed camera network. To handle challenges like non-linear motion and sensor noise, I integrated a physics-based CTRV model. A key innovation was implementing an Auxiliary Particle Filter (APF), which successfully mitigated particle degeneracy by doubling the effective sample size, significantly boosting the tracker's stability and performance.

**[Read More Details →]({{ site.baseurl }}/projects/particle-filter/)**

### Exploring Noise Schedulers in Diffusion Models
In this research, I conducted a deep comparative analysis of various noise schedulers to evaluate their effect on the training efficiency and sample quality of Denoising Diffusion Probabilistic Models (DDPMs). Building on these findings, I designed a novel sine-based noise scheduler that demonstrably outperformed the standard cosine scheduler, leading to significant improvements in generated image quality and a notable reduction in model training time.

**[Read More Details →]({{ site.baseurl }}/projects/noise-schedule/)**

### Autonomous Human Following Robot
This project involved architecting a complete autonomous human-following system on a three-wheeled omnidirectional robot, using ROS for control and an NVIDIA Jetson Nano for onboard computation. To ensure robust tracking even through temporary occlusions, I enhanced a SORT algorithm with a custom re-identification module. The final implementation features a finely-tuned Proportional (P) controller, achieving smooth, real-time tracking with a low system latency of just 1.2 seconds.

## Publications

### [IEEE MILCOM 2025 - GPU-GLMB: Assessing the Scalability of GPU-Accelerated Multi-Hypothesis Tracking](https://www.arxiv.org/abs/2512.06230)
<div style="text-align: center;">
  <img src="{{ site.baseurl }}/media/glmb_5_gif.gif" alt="Tracker Demo">
</div>
My work on GPU-GLMB presents the first fully vectorized and scalable implementation of a Random Finite Set (RFS) based multi-sensor GLMB filter. A core innovation was a novel, measurement-focused categorical sampling method that replaces the traditional Gibbs sampling bottleneck, enabling massive parallelization on GPUs. This new architecture is incredibly efficient, demonstrating that a 100x increase in scenario complexity results in only a 3x increase in processing time, making it highly effective for deployment on resource-constrained edge devices.

**[Read More Details →]({{ site.baseurl }}/projects/gpu-glmb/)**

## Work Experience

### Senior Analyst, Product Development @ American Express, India
*(Aug 2022 – May 2024)*

As a Senior Analyst, I played a key role in enhancing a critical XGBoost-based credit risk model. By orchestrating a deep analysis of its performance and collaborating with the Data Science team, my work directly contributed to the recovery of $14.7MM through improved default prediction. I engineered the end-to-end ETL pipelines that served as the model's foundation, sourcing data from multiple systems to create novel features, and architected an automated daily reporting system to continuously monitor live performance and mitigate data drift.

### Programmer Analyst, Product Development @ American Express, India
*(Aug 2020 – Jul 2022)*

In this role, I led a team of seven in a complex migration project, moving over 300 critical credit decision variables from a legacy Teradata system to a modern Hadoop framework. This initiative was a major success, culminating in the decommissioning of the legacy infrastructure and achieving $50MM in annual operational cost savings. I also spearheaded the migration of the mission-critical Merchant Exposure Calculation system to a scalable big data platform, an achievement that reduced data processing time by 25% and earned me the Q2 Star Award for its technical excellence and business impact.
