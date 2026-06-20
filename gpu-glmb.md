---
layout: post
title: GPU-GLMB — Real-Time Multi-Sensor Vehicle Tracking at the Edge
permalink: /projects/gpu-glmb/
---

# GPU-GLMB: Real-Time Multi-Sensor Vehicle Tracking at the Edge

> Turn live video from a network of smart cameras into accurate, map-aware trajectories of **every vehicle moving through an area** — by making the mathematically *exact* gold-standard tracking algorithm run in **real time on a GPU**.

**IEEE MILCOM 2025** &middot; 5th Int'l Workshop on the Internet of Things for Adversarial Environments
**Authors:** P. Balakrishnan\*, **S. Barik\***, S. M. O'Rourke, B. M. Marlin &middot; *\*equal contribution*

[**Read the paper (arXiv) →**](https://www.arxiv.org/abs/2512.06230)

<!-- DEMO — to use a high-quality video instead of the GIF:
     1. Drop your clip at  media/gpu_glmb_demo.mp4  (H.264 MP4, muted).
     2. Replace the blockquote figure below with:

     <figure>
       <video src="{{ site.baseurl }}/media/gpu_glmb_demo.mp4" autoplay loop muted playsinline></video>
       <figcaption>Our tracker fusing multiple sensor nodes to follow vehicles in real time.</figcaption>
     </figure>
-->
> ![GPU-GLMB live tracking demo]({{ site.baseurl }}/media/glmb_map_gif_2.gif)
> *Our tracker fusing multiple sensor nodes to follow vehicles in real time across the test area. (A higher-quality video replaces this clip soon.)*

## At a glance
- **Real-time, multi-camera, map-accurate tracking.** Fuses detections from many overlapping camera nodes into a single set of world-space (geospatial) vehicle trajectories — not flat image-plane boxes.
- **Made the gold standard fast.** Re-architected the GLMB filter — the *exact* Bayesian solution to multi-object tracking, but famously too slow for real time — to run **fully in parallel on GPUs**.
- **Sub-100 ms latency everywhere.** Validated from edge (Jetson Orin) to consumer (RTX 4090) to server (L40S) GPUs, with our custom parallel association up to **~20× faster** than the standard sequential sampler.
- **Physics- and map-aware.** A vehicle bicycle-kinematics motion model plus road/map constraints keep tracks realistic through occlusions and blind spots.
- **Differentiable by design.** Implemented end-to-end in PyTorch, opening the door to *learning* the tracker — and ultimately to language-queryable spatial awareness.

## The problem: watching a whole area at once
Picture an area dotted with buildings, each rooftop carrying a **sensor node** — a camera (alongside other sensors) with its own onboard edge GPU. Together the nodes look down over a shared tracking area, but each one sees only *part* of it: their fields of view overlap in some places and leave **blind spots** in others.

Now put **many vehicles** in motion through that area. The goal is to take the raw video from every node and, **in real time**, maintain an accurate trajectory for each vehicle in real-world coordinates — continuously fusing what all the sensors see into one coherent picture.

<!-- FIGURE TO ADD: the 3-stage pipeline / problem-setup diagram from the paper (portfolio Fig. 1 or 2).
     Export it to  media/gpu_glmb_pipeline.png  and enable:
     > ![From image detections to fused world-space tracks]({{ site.baseurl }}/media/gpu_glmb_pipeline.png)
     > *Each node detects objects in the image, projects them into world coordinates with uncertainty, and the tracker fuses all nodes into geospatial trajectories.* -->

On a single node, running frame-by-frame at ~10 fps, the pipeline is:

1. A **real-time YOLO detector** finds vehicles and returns bounding boxes.
2. A **probabilistic camera model** projects each box into geospatial coordinates, attaching a covariance that captures how *uncertain* that measurement is.
3. Each node streams its set of uncertain world-space detections to our **tracker**, which fuses every node and outputs live trajectories.

## Why this is hard
The hard part of multi-object tracking is **data association** — deciding which detection belongs to which track, frame after frame. At every step the tracker must also allow that tracks may have *left* the area, new vehicles may have *entered*, and existing vehicles may have been *missed* by every sensor. The number of consistent ways to explain a single frame grows **combinatorially**.

Existing approaches each leave a gap:

- **Deep trackers (SORT / DeepSORT)** track in the *image plane* of a *single* camera — they don't fuse multiple sensors or produce world-space trajectories.
- **MHT / PMBM** and similar methods are largely *heuristic*, without a full probabilistic foundation.
- **GLMB** is the elegant exception. It models the whole scene as a *random finite set* and is provably an **exact, closed-form Bayesian solution** to multi-object tracking — which is exactly why it's considered the gold standard. The catch: in practice it's **too slow to run in real time**.

Why is GLMB slow? To tame the combinatorial association problem it samples only the most likely hypotheses using a **Gibbs sampler** — and Gibbs sampling is inherently *sequential*, so it can't exploit a GPU.

## Our idea: remove the bottleneck, then parallelize everything
The Gibbs sampler is there to enforce a classical assumption: *a target generates at most one detection per sensor.* But we feed the tracker **modern deep detectors**, where that assumption routinely breaks — YOLO can fire several boxes for the same vehicle.

We turned that into an opportunity. By **relaxing the one-detection-per-target coupling**, we replaced sequential Gibbs sampling with a **custom parallel categorical sampler (ABA)** that draws many high-likelihood association hypotheses *simultaneously*. From there we **parallelized every stage of the GLMB filter** so the whole pipeline runs on the GPU.

The payoff: the filter went from "too slow for real time" to running **comfortably under the real-time budget** — with the association step alone up to **~20× faster** than Gibbs, and a 100× increase in scenario complexity costing only ~3× more compute.

<!-- FIGURE TO ADD: ABA-vs-Gibbs speedup-by-device bar chart from the paper (portfolio Fig. 3).
     Export to  media/gpu_glmb_speedup.png  and enable:
     > ![ABA speedup over Gibbs across devices]({{ site.baseurl }}/media/gpu_glmb_speedup.png)
     > *Our parallel association (ABA) vs. sequential Gibbs across edge, consumer, and server GPUs.* -->

## Making the tracker robust
Speed only matters if the tracks are trustworthy, so we made several deliberate choices to keep them physically faithful:

- **Particle-filter state.** Each object's state is represented with a particle filter rather than a Gaussian, giving us the flexibility to encode hard physical rules directly into the distribution.
- **A real vehicle motion model.** Instead of a generic constant-velocity assumption, we use a **non-linear bicycle-kinematics model** derived for realistic vehicle motion, with a closed-form linearization that keeps the update **differentiable**.
- **Map and road-network constraints.** Particles are confined to *drivable* space. Approaching a T-intersection, the distribution naturally **splits into "left" and "right" modes** — with *zero* probability mass passing through the building ahead — and collapses back to the correct answer once a detection reappears. This is what lets the tracker **ride through occlusions and blind spots** instead of drifting through walls.

<!-- FIGURE TO ADD (optional): map-constraint / multimodal-at-intersection figure.
     Export to  media/gpu_glmb_map.png  and enable a blockquote figure here. -->

## Results: real data, real hardware
This isn't a toy benchmark. We evaluated on **complex vehicle trajectories**, then synthesized convoy-style multi-object scenarios from them — with crossings, vehicles moving in parallel in opposite directions, sharp maneuvers, and genuine blind spots. These scenarios are deliberately *harder* than typical road networks, and far more challenging than the simple datasets GLMB methods are usually demonstrated on.

> ![Test-bed ground-truth trajectories]({{ site.baseurl }}/media/gpu_glmb_groundtruth.png)
> *High-precision GPS ground truth from the testbed, used to synthesize dense multi-object scenarios.*

**Accuracy.** Even with the approximations that make it fast, the tracker stays accurate — object-count (cardinality) error under **2%** for up to 10 objects, and localization error consistently below **0.15 m**.

> ![Cardinality and tracking-error results]({{ site.baseurl }}/media/gpu_glmb_accuracy.png)
> *(Left) Relative cardinality error stays low. (Right) Tracking error remains stable as the number of hypotheses grows.*

**Speed.** We measured sub-100 ms update latency across a **Dockerized edge (Jetson Orin), consumer (RTX 4090), and server-class (L40S)** stack — and ran it live, tracking real vehicles in the setup. On server GPUs, run-time stays almost flat even as the number of hypotheses climbs.

> ![Run-time across GPUs]({{ site.baseurl }}/media/gpu_glmb_runtime.png)
> *Update time vs. number of hypotheses. Server GPUs stay well under the real-time budget even in the densest scenes.*

## Why it matters — and what's next
At its core this project delivers something unusual: a **mathematically rigorous, fully Bayesian** solution to multi-object tracking that is also **fast, physics-aware, and end-to-end differentiable**. Those last properties are the exciting part:

- **Learnable tracking.** Because the whole filter is differentiable PyTorch, parameters like the motion-model dynamics can be *learned* by backpropagation instead of hand-tuned.
- **End-to-end perception.** We plan to couple it with a real-time detector (e.g. DETR) and train the *entire* detect-to-track pipeline end to end — while keeping the exact Bayesian tracking core. A pure transformer would have to learn physics from scratch and would not be the exact Bayesian solution; here we get that structure for free.
- **Toward language-queryable awareness.** The live trajectories are a form of **spatial awareness**. By extending the state with attributes such as object class or color (fused from a vision-language model), the system could answer natural-language questions that mix physics and semantics — for example, *"show me all the red cars currently over the speed limit."* This is the foundation for a **neurosymbolic** perception system.

A more detailed journal version of this work is currently **in preparation**.

---

[**Read the paper (arXiv) →**](https://www.arxiv.org/abs/2512.06230)

[← Back to portfolio]({{ site.baseurl }}/)
