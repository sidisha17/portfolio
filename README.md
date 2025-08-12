# A little bit about me

## Education
- M.S., Computer Science | University of Massachusetts, Amherst (Aug 2024 - May 2026)
- B.Sc., Programming and Data Science | Indian Institute of Technology Madras, India (Jan 2021 - May 2024)
- B.E., Mechanical Engineering | Birla Institute of Technology and Science Pilani, India (Aug 2016 – May 2020)

## Work Experience
** Senior Analyst, Product Development @ American Express, India (Aug 2022 – May 2024) ** 
                                                                                                          
•	Enhanced an XGBoost-based credit risk model by orchestrating a comprehensive analysis of its effectiveness and collaborating with the Data Science team to refine its predictive logic. This initiative directly led to the recovery of $14.7MM by significantly improving default prediction accuracy.
•	Engineered and deployed robust, end-to-end ETL pipelines to construct and enrich training datasets for the updated credit risk model. Sourced and integrated data from multiple systems to create novel features, providing the foundational data structure that enabled the model's success.
•	Architected and implemented an automated daily reporting system to continuously monitor live model performance. This system provided actionable insights to stakeholders, enabling the proactive identification and rapid mitigation of potential performance degradation or data drift issues.

** Programmer Analyst, Product Development @ American Express, India (Aug 2020 – Jul 2022) ** 
•	Led a team of 7 in the successful migration and enhancement of over 300 critical credit decision variables from a legacy Teradata system to a modern Hadoop big data framework. This complex initiative culminated in the decommissioning of the legacy infrastructure, achieving $50MM in annual operational cost savings.
•	Spearheaded the end-to-end migration of the mission-critical Merchant Exposure Calculation system to a scalable big data platform, an achievement recognized with the Q2 Star Award. The new architecture reduced data processing time by 25% and streamlined a complex codebase, improving system maintainability and future scalability.

## Projects
### Particle Filter based Tracker for Geospatial Tracking Dataset built using data from Distributed Camera Networks
•	Engineered a robust Bayesian particle filter to track objects within a challenging real-world geospatial dataset from a distributed camera network, successfully overcoming issues of non-linear motion, sensor noise, and intermittent detections.
•	Developed a Differentiable Particle Filter with soft resampling and reparameterization to enable an end-to-end, data-driven learning framework for diverse vehicle motion behaviors observed in the dataset.
•	Addressed non-linear object motion and high sensor noise by integrating a physics-based Constant Turn Rate and Velocity (CTRV) model, ensuring robust tracking despite frequent missed detections.
•	Mitigated severe particle degeneracy by implementing an Auxiliary Particle Filter (APF), which doubled the effective sample size (100% average increase) over a standard Bootstrap Filter and significantly enhanced tracker stability.

### Autonomous Human Following Robot
•	Architected and deployed a real-time human-following system on a 3-wheeled omnidirectional robot, leveraging ROS for control, an NVIDIA Jetson Nano for onboard computation, and an RGB-D camera for perception.
•	Enhanced target persistence by integrating a Simple Online Realtime Tracking (SORT) algorithm with a custom-developed re-identification module, using color histogram features to successfully maintain tracking through temporary occlusions.
•	Optimized the control system by implementing a Proportional (P) controller, achieving a low system latency of 1.2 seconds and enabling smooth, continuous tracking of targets moving at speeds up to 10 m/s.

### Exploring Noise Schedulers in Diffusion Models
•	Conducted a comparative analysis of noise schedulers (Cosine, Sine, Laplace) to benchmark their impact on the training efficiency and final sample quality of Denoising Diffusion Probabilistic Models (DDPMs).
•	Designed a novel sine-based noise scheduler that demonstrated superior performance over the standard cosine scheduler, resulting in a significant improvement in generated image quality (FID/IS scores) and a reduction in model training time.


## Publications
### IEEE MILCOM 2025 - GPU-GLMB: Assessing the Scalability of GPU-Accelerated Multi-Hypothesis Tracking
•	Created the first fully vectorized and scalable implementation of a Random Finite Set (RFS) based Multi Sensor Sequential Monte Carlo (SMC) Generalized Labelled Multi Bernoulli filter capable of handling one or more detections from each sensor per object. 
•	Innovated a novel, measurement-focused Categorical sampling method to replace the computationally expensive and sequential Gibbs sampling bottleneck, enabling massive parallelization of the track-to-measurement assignment step.
•	Achieved unprecedented computational efficiency by leveraging GPU parallel processing, demonstrating that a 100x increase in scenario complexity resulted in only a 3x increase in processing time.
•	Benchmarked the filter's performance across diverse CPUs and GPUs, quantifying significant speed improvements on modern GPUs and validating its effectiveness for deployment on resource-constrained edge devices.
