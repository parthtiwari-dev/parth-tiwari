# Phase 2 worlds animation research memo

Written 2026-08-29. This memo covers only the seven projects marked `📐 specced` in
[`WORLDS.md`](WORLDS.md). It is input to the owner-approved storyboard review required
before Phase 5 starts; the remaining project storyboards then continue through Phase 6.
It does not authorize implementation, a canvas, a runtime fetch or a placeholder graphic.

The test for every candidate is the same: the graphic must use a reproducible export from
the real project. An aggregate metric can support copy, but it cannot stand in for the
per-event or per-sample data needed to draw a truthful animation.

## Candidate inventory

### QueryPilot

- **Real data source required:** a build-time export from the named 70-query core run,
  containing the query identifier, retrieved schema identifiers, first SQL, critic failure
  reason, corrected SQL and final acceptance or execution result. `WORLDS.md` verifies the
  aggregate correction result but does not name or attach this trace export.
- **Interaction demonstrated:** scroll advances one real failed query through schema
  retrieval, rejection, correction and acceptance. The static frame places rejected and
  corrected SQL together.
- **Accent:** blue for the forward path and oxblood for the rejection edge. The exact blue
  is not specified yet.
- **Status:** **data blocked.** The current Swagger capture proves an API exists but is not
  the required real correction trace.

### SecondSelf

- **Real data source required:** an anonymized build-time review-queue event export from the
  real workflow, including evidence inputs, unsupported-claim removals, enqueue time, queue
  depth and the later human decision event. `WORLDS.md` names the Telegram review queue but
  does not identify an export or durable event artifact.
- **Interaction demonstrated:** evidence enters, a packet is assembled, unsupported claims
  are removed and the flow stops visibly at the human gate until a separate decision event
  arrives.
- **Accent:** one flow colour with oxblood reserved for the queue. The flow colour is not
  specified yet.
- **Status:** **data blocked.** The absence of a capture is acceptable; the absence of a
  real queue trace is not.

### OncoVerse

- **Real data source required:** a build-time atlas export containing real region geometry
  or stable region identifiers, each region's sourced or unsourced state and its citation
  mapping. The current build notes discuss a 2D, sprite-sheet or isolated Three.js rendering
  choice but do not name this export.
- **Interaction demonstrated:** scroll reveals one source-backed region, attaches its
  citation boundary, contrasts it with deliberately dim unsourced regions and returns to the
  whole atlas.
- **Accent:** one highlight colour for sourced regions and grey for unsourced regions. Exact
  colours are not specified yet.
- **Status:** **data and owner-decision blocked.** The storyboard must choose the 2D or
  pre-rendered treatment before Three.js can even be considered.

### UPI Fraud Engine

- **Real data source required:** a build-time export of per-transaction model scores and
  labels from the named held-out evaluation, plus the documented alert-budget threshold.
  Any operational replay data must remain a separate export and visual layer. `WORLDS.md`
  does not name an attached distribution artifact.
- **Interaction demonstrated:** transactions form a score distribution, the alert-budget
  threshold moves, and precision changes before returning to the documented operating
  point. A labelled static distribution remains complete without the control.
- **Accent:** one colour for legitimate transactions and oxblood for flagged transactions.
  The legitimate colour is not specified yet.
- **Status:** **data blocked.** The two evaluation contexts cannot be merged to manufacture
  a smoother distribution.

### Spur Chat

- **Real data source required:** a real build-time retrieval trace from the take-home,
  containing token timestamps, retrieved catalogue or policy identifiers, excluded
  unsupported material and the final bounded response. `WORLDS.md` provides no build note
  or attached trace for this graphic.
- **Interaction demonstrated:** a question arrives, catalogue scope becomes visible,
  unsupported material is excluded and only then does the bounded answer stream.
- **Accent:** not specified in `WORLDS.md`.
- **Status:** **data and accent blocked.** Do not animate synthetic tokens or invent a brand
  palette.

### Fraud Risk Intel

- **Real data source required:** a build-time export containing the frozen preprocessing
  version, per-sample reconstruction errors, labels, the anomaly threshold and the real
  explanation fields for a flagged sample. `WORLDS.md` provides no build note or named
  distribution artifact.
- **Interaction demonstrated:** preprocessing freezes, reconstruction errors settle around
  the boundary and one real anomaly receives its explanation.
- **Accent:** not specified in `WORLDS.md`.
- **Status:** **data and accent blocked.** A mathematically plausible distribution would
  still be invented evidence.

### Oracle Auto Provision

- **Real data source required:** a build-time scheduler or workflow-log export containing
  run timestamps, the existing-instance check, a real failed attempt, its retry wait and the
  later successful attempt. The five-minute configuration and duplicate guard are verified,
  but `WORLDS.md` names no run-history source.
- **Interaction demonstrated:** scheduled heartbeats accumulate, one attempt fails, the
  retry waits and a later attempt succeeds without creating a duplicate instance.
- **Accent:** not specified in `WORLDS.md`.
- **Status:** **data and accent blocked.** Configuration must not be drawn as uptime history.

## Owner decisions required before storyboards

1. Approve or replace each unresolved accent using the real product interface or data.
2. Identify the exact repository artifact or reproducible export command for every blocked
   data source.
3. Choose OncoVerse's 2D or pre-rendered baseline before considering a measured Three.js
   exception.
4. Decide whether UPI's threshold should be a labelled scroll demonstration only or also an
   optional keyboard-and-touch control.

Until those decisions and exports exist, the honest output for each blocked project is a
reserved static-world slot, not a fabricated graphic.
