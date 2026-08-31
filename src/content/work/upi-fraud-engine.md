---
{
  "title": "UPI Fraud Engine",
  "order": 9,
  "tier": "major",
  "effort": "substantial",
  "status": "shipped",
  "started": "2026-01",
  "startedSource": { "kind": "repository", "locator": "UPI Fraud Engine first Git commit", "public": false },
  "audience": ["employer", "client"],
  "summary": "A real-time fraud scoring system evaluated at a fixed alert budget instead of optimising a model metric in isolation.",
  "arrival": { "sentence": "Fraud scoring only matters after the alert queue has a size the team can handle." },
  "whatItIs": ["The UPI Fraud Engine scores transactions and turns the highest-risk fraction into alerts.", "The operating point is constrained by an alert budget, so precision and recall are reported at the threshold the team could actually review."],
  "problem": ["Fraud datasets are imbalanced, and a strong ROC-AUC can still produce an unusable queue.", "The model, temporal features, threshold, and replay all need separate evidence so an offline score is not mistaken for operational performance."],
  "architecture": {
    "decision": "Choose and evaluate the threshold under an explicit alert budget, then replay it across time.",
    "paragraphs": ["The pipeline builds temporal and behavioural features, trains the model, freezes production artifacts, and scores transactions through an API.", "A separate replay measures the chosen operating point across consecutive days. Its result is never merged with the held-out test result." ]
  },
  "measurement": { "claimIds": ["upi-heldout", "upi-replay"] },
  "boundary": {
    "will": ["Report precision and recall together at the chosen budget.", "Keep held-out evaluation and time replay as separate claims."],
    "refuses": ["Call a risk score a final fraud verdict.", "Hide recall to make precision look stronger."]
  },
  "whatBroke": {
    "title": "Two correct precision numbers became one misleading claim",
    "paragraphs": ["The model evaluation and the operational replay used different datasets and produced different precision values.", "Earlier copy collapsed them. The correction names each dataset, denominator, threshold context, and recall beside precision."],
    "noteSlug": "upi-two-precisions"
  },
  "stackAndLinks": {
    "stack": ["Python", "XGBoost", "FastAPI", "feature engineering", "backtesting"],
    "links": [{ "label": "View repository", "kind": "repository", "url": "https://github.com/parthtiwari-dev/upi-fraud-engine", "verifiedAt": "2026-08-28" }]
  },
  "next": { "slug": "spur-chat", "label": "Next: Spur Chat" },
  "world": {
    "story": "Transaction scores settle into a distribution, an alert-budget threshold cuts the tail, and the paired precision-recall result appears at that operating point.",
    "dataSources": ["held-out pipeline results", "seven-day replay results", "threshold configuration"],
    "storyboardStatus": "specced",
    "motionDeferred": true
  },
  "caseStudy": {
    "reviewedAt": "2026-08-31",
    "classification": "Operational fraud scoring",
    "thesis": "UPI Fraud Engine evaluates a frozen model at the alert volume an operations team can actually review, then keeps held-out testing and seven-day replay as separate evidence.",
    "credit": {
      "organization": "Personal project",
      "role": "Machine-learning engineer",
      "contribution": "I built the temporal feature pipeline, leakage controls, model evaluation, frozen serving artifacts, alert-budget thresholding, real-time API, dashboard visualisations, and seven-day operational replay.",
      "contributionSummary": "Features, model, thresholding, serving, and replay"
    },
    "cover": {
      "proof": { "kind": "image", "src": "/media/upi-precision-recall.png", "alt": "Real UPI Fraud Engine evaluation chart showing precision and recall across the seven-day replay", "width": 700, "height": 500, "fit": "contain" },
      "labels": ["Real evaluation visualisation", "Replay evidence, not a mockup"]
    },
    "headings": {
      "overview": "The threshold is an operational decision, not a decoration on the model.",
      "problem": "A strong model metric can still create an alert queue no team can review.",
      "architectureCaption": "Temporal features to frozen model to alert-budget replay",
      "evidence": "Held-out model quality and operational replay answer different questions."
    },
    "intendedUser": "A fraud operations or risk team that needs a reviewable alert queue, paired precision and recall, and a clear separation between offline evaluation and time-based replay.",
    "demo": {
      "kind": "image",
      "label": "Real replay visualisation",
      "src": "/media/upi-alert-budget.png",
      "alt": "Real UPI Fraud Engine chart showing daily alert-budget compliance during the seven-day replay",
      "width": 700,
      "height": 500,
      "fit": "contain",
      "caption": "This committed evaluation visualisation shows the alert-budget constraint across the replay. It is evidence from the repository, not simulated dashboard data."
    },
    "workflow": [
      { "title": "Build time-aware features", "description": "Behavioural and temporal features are computed without letting future information leak into an earlier transaction.", "proof": { "kind": "record", "label": "Feature record", "title": "Past only", "sourceLabel": "Committed feature pipeline at dbc43ad", "rows": [
        { "label": "Input", "value": "Transaction and historical behaviour" }, { "label": "Split", "value": "Temporal holdout" }, { "label": "Guard", "value": "No future leakage", "tone": "pass" }
      ] } },
      { "title": "Choose an alert budget", "description": "The frozen model's score distribution is cut at the 0.5 percent review budget, then precision and recall are reported together.", "proof": { "kind": "image", "src": "/media/upi-fraud-breakdown.png", "alt": "Real UPI Fraud Engine fraud breakdown visualisation from the evaluation repository", "width": 700, "height": 500, "fit": "contain" } },
      { "title": "Replay through time", "description": "A separate seven-day replay applies the chosen operating policy and records daily precision, recall, and budget compliance.", "proof": { "kind": "image", "src": "/media/upi-precision-recall.png", "alt": "Real UPI Fraud Engine daily precision and recall trend across the operational replay", "width": 700, "height": 500, "fit": "contain" } }
    ],
    "responsibilities": [
      { "label": "Data", "detail": "Temporal splitting, leakage prevention, behavioural features, imbalance handling, and reproducible artifacts." },
      { "label": "Model", "detail": "XGBoost evaluation, probability scoring, frozen preprocessing, and threshold selection." },
      { "label": "Operations", "detail": "Alert-budget policy, serving surface, daily replay, paired metrics, and evidence visualisation." }
    ],
    "research": [
      { "source": "Temporal leakage review", "finding": "Random splits and future-derived aggregates can make fraud detection look stronger than it will behave on later transactions.", "changed": "Feature construction and evaluation follow time, and the replay remains separate from the held-out model result." },
      { "source": "Alert-budget evaluation", "finding": "Optimising ROC-AUC or a default threshold does not determine whether the resulting queue is operationally reviewable.", "changed": "The operating point is selected and reported at a fixed 0.5 percent alert budget with precision and recall together." },
      { "source": "Dynamic-threshold experiments", "finding": "Score distributions can shift across time, so a static threshold may violate volume or quality expectations.", "changed": "Threshold behaviour and daily budget compliance became explicit replay outputs." },
      { "source": "Seven-day operational replay", "finding": "The same system produced different precision and recall on the replay than on the held-out model test.", "changed": "The two evaluations became separate claims with separate denominators and could no longer be collapsed into one number." }
    ],
    "decisions": [
      { "decision": "Select the operating point under an explicit alert budget.", "rejected": "Use the default probability threshold or optimise one model metric in isolation.", "tradeoff": "Recall remains low, while the alert volume stays tied to an operational capacity." },
      { "decision": "Freeze the model and preprocessing artifacts before replay.", "rejected": "Recompute or retune the pipeline while evaluating the same replay window.", "tradeoff": "The replay cannot benefit from later tuning, while its result remains attributable to one production candidate." },
      { "decision": "Publish held-out and replay evidence separately.", "rejected": "Choose the more flattering precision value as the system's headline result.", "tradeoff": "The story contains more context, while each number keeps the dataset and question it actually answers." }
    ],
    "architectureSteps": [
      { "label": "Transactions", "detail": "Chronological rows enter with historical behaviour only" },
      { "label": "Features", "detail": "Temporal and behavioural transforms follow the frozen contract" },
      { "label": "Model", "detail": "XGBoost returns a risk score rather than a final verdict" },
      { "label": "Budget threshold", "detail": "The highest-risk 0.5 percent becomes the review queue" },
      { "label": "Replay", "detail": "Seven consecutive days record paired quality and budget compliance" }
    ],
    "failures": [
      { "title": "Two precision values became one claim", "symptom": "Earlier copy quoted a precision number without saying whether it came from held-out evaluation or operational replay.", "cause": "Different datasets and purposes were collapsed into one system-level headline.", "correction": "The held-out and replay records now keep separate precision, recall, dates, and denominators.", "remainingRisk": "Readers may still overvalue precision if recall and alert budget are separated visually." },
      { "title": "A model metric ignored queue capacity", "symptom": "Offline optimisation could select a threshold that produced more alerts than a team could review.", "cause": "The evaluation treated classification quality independently from the operating budget.", "correction": "Threshold selection and reporting are anchored to a fixed 0.5 percent alert budget.", "remainingRisk": "The chosen budget is a project assumption, not evidence from a real fraud operations team." },
      { "title": "Replay performance fell below held-out performance", "symptom": "Precision moved from 92.06 percent on held-out rows to 75.22 percent across the replay.", "cause": "Time-based operational conditions differ from the static held-out test distribution.", "correction": "The replay result is published as a separate operational record rather than hidden or merged.", "remainingRisk": "Seven days are not enough to establish long-term stability or drift behaviour." }
    ],
    "limitations": [
      "The 0.5 percent alert budget is an explicit project operating assumption, not a customer-validated staffing limit.",
      "Recall is 12.81 percent on held-out rows and 12.13 percent in replay, so most fraudulent transactions are not captured at this budget.",
      "The seven-day replay is too short to establish seasonal drift, production stability, or long-term financial impact.",
      "The risk score prioritises review and is never presented as a final fraud verdict."
    ],
    "evidenceNote": "Held-out: 92.06 percent precision and 12.81 percent recall on 85,429 rows. Replay: 75.22 percent precision and 12.13 percent recall on 22,071 rows across seven days. These records remain separate.",
    "future": [
      { "status": "planned", "title": "Longer temporal replay", "detail": "Run the frozen operating policy across a larger period and report drift, daily volume, precision, recall, and budget violations together." },
      { "status": "investigating", "title": "Adaptive thresholds", "detail": "Test dynamic threshold policies without allowing daily retuning to erase the precommitted alert-budget contract." },
      { "status": "planned", "title": "Human-review feedback", "detail": "Model analyst decisions and queue outcomes before claiming operational impact or a final fraud determination." }
    ],
    "sources": [
      { "label": "UPI Fraud Engine committed repository and frozen evaluation artifacts", "locator": "private audit at main dbc43ad", "public": false },
      { "label": "UPI Fraud Engine public repository", "locator": "https://github.com/parthtiwari-dev/upi-fraud-engine", "public": true },
      { "label": "Real held-out and replay visualisations", "locator": "publication-cleared repository artifacts", "public": false }
    ],
    "relatedNoteLabel": "Read why the two precision results stay separate",
    "ending": {
      "heading": "A score becomes useful only when the review queue and missed fraud stay visible.",
      "body": "The strongest next evidence is a longer replay and real review feedback, not a threshold chosen to make one metric look better.",
      "contactLabel": "Ask me about the UPI engine"
    }
  },
  "claimRefs": ["upi-heldout", "upi-replay"]
}
---
