---
layout: post
title: Exploring Noise Schedulers in DIffusion Models
permalink: /projects/noise-schedule/
---

##  Exploring Noise Schedulers in DIffusion Models

Tracking a vehicle accurately is a classic challenge in robotics and computer vision. In a recent project, I explored how to build a smarter tracking system by combining traditional Bayesian filtering with modern deep learning principles and real-world environmental knowledge.

### The Problem: From a Bounding Box to a Coherent Trajectory

The goal of this project was to track a single vehicle as it moved within an area monitored by a distributed network of four cameras. The process works like this:
1.  Image Capture & Detection: The four cameras provide raw visual data, and a fine-tuned DETR (DEtection TRansformer) model draws bounding boxes around the vehicle.
2.  World Projection: A camera model then takes these 2D bounding boxes and projects them into the real-world 2D plane. This gives us not just a position estimate, but also an associated uncertainty for each detection.
3.  Bayesian Tracking: With a stream of these uncertain measurements, we need a robust algorithm to stitch them together. I chose a **Particle Filter (PF)** for this task.

A standard Kalman Filter wouldn't work well here because it assumes linear models and Gaussian noise. Real-world vehicle maneuvers, which we can model with complex, non-linear dynamics like the **Constant Turn Rate and Velocity (CTRV) model**, violate these assumptions. Particle Filters shine in these scenarios because they can represent arbitrary, non-linear probability distributions.

---

### Additional Enhancements for Robustness

To improve the standard Bootstrap Particle Filter, I explored two key enhancements.

#### Auxiliary Particle Filter (APF)
A standard PF predicts where particles will move *without* considering the latest measurement. If a vehicle turns unexpectedly, many particles can end up in a region of low likelihood, reducing the filter's effectiveness. The **Auxiliary Particle Filter (APF)** solves this by incorporating the current measurement into the proposal mechanis. It essentially "looks ahead" to see where the new measurement is, then gives priority to parent particles that are already heading in the right direction. This makes the filter more efficient and allows it to maintain accurate tracking even with a significantly lower number of particles, reducing computational cost.

#### Birth and Death Model
In scenarios with sparse detections, a tracker can lose its lock on a target. To handle this, I implemented a **birth and death model** for track management. Each track maintains a score that increases with consecutive, successful measurements and decreases when detections are missed. If the score drops below a threshold, the track is terminated ("death"). When a new measurement appears that can't be associated with an existing track, a new one is initiated ("birth").

---

### The Deep Learning Twist: A Differentiable Particle Filter

A traditional PF has parameters, like expected vehicle acceleration, that are usually set by hand. What if the filter could *learn* these parameters on its own?This is where I implemented an end-to-end **Differentiable Particle Filter (DPF)*.By making the algorithm differentiable, we can use backpropagation to automatically learn its internal parameter. This required two key modifications:
* **The Re-parameterization Trick** to allow gradients to flow through the sampling step.
* **Soft Resampling** to ensure gradients are not lost during the resampling step.

This approach bridges the gap between classic algorithms and deep learning, creating a system that can adapt and learn the specific dynamics of the vehicles it tracks.

### The Flexibility Advantage: Particle Filters with Constraints

Another great strength of Particle Filters is their flexibility in incorporating environmental information. When detections are lost, particles propagated only by the motion model can drift into physically impossible areas, like off a road. I explored constraining particles within the known room boundaries to keep them grounded in reality. This was done in two ways:
1.  **Particle Rejection:** After predicting, if a particle's new position is outside the boundary, it is rejected and re-sampled inside the valid area.
2.  **Weight Modification:** Alternatively, an out-of-bounds particle is penalized by drastically reducing its importance weight, making it highly unlikely to survive the resampling phase.

While this project used simple room boundaries, I plan to extend this as part of my future work to handle complex road networks, making the tracker even more robust in the real world.

<br>
[← Back to Home]({{ site.baseurl }}/)
