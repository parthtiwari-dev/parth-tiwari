# Portfolio Discovery And Ideas

Date: 2026-05-28

Owner: Parth Tiwari

Purpose: this is the working source-of-truth for building Parth's portfolio site. It captures what was found in the local project folders, what should be claimed, what should not be claimed, how the projects connect into one story, and 12 portfolio concepts strong enough to build from.

## Scope

Local folders reviewed:

- `C:\great learning self paced\z Final Projects\secondself`
- `C:\great learning self paced\z Final Projects\Evidence-Bound-Drug-RAG`
- `C:\great learning self paced\z Final Projects\querypilot`
- `C:\great learning self paced\z Final Projects\upi-fraud-engine`
- `C:\great learning self paced\z Final Projects\Fraud-Risk-Intelligence-System`
- `C:\great learning self paced\z Final Projects\oncoverse`
- `C:\great learning self paced\z Final Projects\order-supervisor`
- `C:\great learning self paced\z Final Projects\oracle-auto-provision`
- `C:\great learning self paced\Stick and dot\Vivid`
- `C:\great learning self paced\Stick and dot\stick-and-dot-app`

Folders intentionally not treated as personal flagship work:

- `C:\great learning self paced\z Final Projects\Understand-Anything` - cloned/reference project, not Parth's project.
- `C:\great learning self paced\z Final Projects\New folder` and `C:\great learning self paced\z Final Projects\text to sql` - duplicate/older QueryPilot-like folders; use `querypilot` as the canonical source.
- `C:\great learning self paced\z Final Projects\secondself1` - duplicate/venv-heavy follow-on folder; use `secondself` as canonical.
- Generated or dependency folders such as `.venv`, `node_modules`, `dist`, `.next`, model caches, zips, and private `.env` files were not used as evidence.

External reference sweep:

- [Codrops: More Than a Portfolio, Building a Scroll-Driven 3D World](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- [Bruno Simon portfolio](https://bruno-simon.com/)
- [Awwwards portfolio inspiration](https://www.awwwards.com/websites/portfolio/)
- [Awwwards 3D websites](https://www.awwwards.com/websites/3d/)
- [Awwwards Three.js collection](https://www.awwwards.com/awwwards/collections/three-js/)
- [TresJS introduction](https://docs.tresjs.org/getting-started)
- [Three.js fundamentals](https://threejs.org/manual/en/fundamentals.html)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Vite features docs](https://vite.dev/guide/features.html)
- [Tailwind utility-class docs](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Runway AIF 2026](https://aif.runwayml.com/)
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

## Portfolio Thesis

Parth's portfolio should not read like "I made AI apps." That is too common.

The stronger thesis:

> I build AI systems that make decisions under constraints: evidence, latency, cost, identity consistency, safety, schemas, workflow state, and real deployment budgets.

The recurring pattern across the work:

- Evidence-bound generation: MedRAG, SecondSelf, OncoVerse.
- Self-correcting systems: QueryPilot, SecondSelf, Order Supervisor.
- Production pragmatism: Oracle automation, Render/RunPod/Modal/VPS deployment, Docker, Temporal, Supabase, FastAPI.
- Measured claims: RAGAS, ROC-AUC, PR-AUC, p95 latency, precision under alert budget, cost per storyboard, refusal accuracy.
- Creative AI systems: Vivid's storyboard generation, FLUX.1-dev, PuLID, LoRA routing, CLIP scoring.
- Honest caveats: synthetic fraud data, in-progress medical review, not a deep ML researcher, not claiming full auto-submit where manual assist remains.

Best one-line positioning:

> GenAI application engineer building evidence-grounded AI, agent workflows, and production-grade inference systems.

More cinematic version:

> I build systems where AI is allowed to act only after the evidence, schema, budget, and state machine agree.

## Identity And Voice

From `secondself/kb/global/me.md`:

- Name: Parth Tiwari.
- Age: 22.
- Based in Bengaluru, originally from Indore.
- Email: `parth.secondself@gmail.com`
- GitHub: `github.com/parthtiwari-dev`
- LinkedIn: `linkedin.com/in/parth-tiwar1`
- Education: B.Tech CSE AI/ML, IPS Academy, 2021-2025, CGPA 6.4.
- Great Learning GenAI specialization: July 2025 to February 2026.
- Experience: AI/ML Development Intern at Stick and Dot, March 2026 to present, remote contract.

Voice rules:

- Direct, specific, numbers-backed.
- No corporate fluff.
- Admit gaps without apologizing.
- Prefer engineering proof over hype.
- Avoid inflated phrases like "passionate", "synergy", "leveraged", "extensive experience", and "cutting-edge" unless quoting source text.

## Site Content Order

Recommended flagship order:

1. SecondSelf - personal AI career operating system and autonomous application pipeline.
2. Vivid / Stick and Dot - real internship work with AI storyboard generation and a role-based editorial platform.
3. QueryPilot - self-correcting Text-to-SQL multi-agent API.
4. UPI Fraud Detection Engine - production-style real-time fraud system.
5. Evidence-Bound Drug RAG / MedRAG - medical RAG with citation and refusal behavior.
6. OncoVerse - in-progress 3D cancer education atlas.
7. Order Supervisor - Temporal-based long-running LLM order agent.
8. Fraud Risk Intelligence System - earlier explainable fraud ML/API work.
9. Oracle Auto Provision - small infra automation project.

## Project Discovery

### SecondSelf

Canonical folder:

`C:\great learning self paced\z Final Projects\secondself`

What it is:

SecondSelf is a personal AI system that knows Parth's career, projects, resume evidence, preferences, and application history. It can generate tailored resumes and answers from a structured KB, score resume/JD alignment, track applications, and in V2 coordinate job discovery and application workflows.

Important components:

- KB-grounded RAG over personal career data.
- FastAPI backend and Streamlit UI.
- Qdrant vector store.
- PostgreSQL audit trail.
- GPT-4o-mini for generation.
- DOCX/PDF resume generation.
- JD analysis and gap detection.
- ATS checker.
- Cover letter generation.
- Application tracking.
- V2 autonomous application pipeline with scrapers, n8n, Telegram control, Playwright/ATS extraction, and assisted apply flows.

Key metrics and proof:

- V1 marked complete in local progress docs.
- Retrieval gold eval around 76 percent average P@10 and 79.9 percent recall.
- Later quality recovery: faithfulness 0.9753, answer relevancy 0.7339, context precision 0.8304, overall around 0.8465.
- Resume/JD quality gate example: WisdomAI match 88.8, ATS 80, review-ready.
- V2 includes 10+ scrapers and Telegram control patterns.

Portfolio angle:

This is the most personal and most strategic project. It proves Parth can build a domain-specific AI system from identity data, retrieval, generation, eval, user controls, workflow automation, and deployment. It should not be framed as "resume generator"; it is closer to a personal AI operating system for job search.

Visual metaphor:

A personal command center where documents, JDs, applications, Telegram signals, and generated resumes move through a controlled pipeline.

Claims to avoid:

- Do not imply unrestricted fully autonomous job submission.
- Do not claim CAPTCHA bypassing.
- Do not expose private VPS IPs, keys, cookies, or private job account details.

### Vivid / Cinematic Storyboard AI

Canonical folder:

`C:\great learning self paced\Stick and dot\Vivid`

What it is:

Vivid is a cinematic storyboard generation system built during the Stick and Dot internship. It turns scene descriptions or screenplay text into 4-shot storyboards using FLUX.1-dev, Groq planning, PuLID identity locking, LoRA styles, CLIP scoring, cinematic color grading, and PDF export.

Important components:

- FLUX.1-dev image generation.
- PuLID + InsightFace face locking.
- 13 LoRA styles.
- Groq `llama-3.3-70b` scene planning and script parsing.
- Shot routing for human vs non-human scenes.
- CLIP-based scoring and auto-retry.
- CPU-only cinematic grading via PIL/numpy.
- PDF export via reportlab.
- React + Vite frontend.
- FastAPI backend.
- Modal serverless deployment.
- RunPod serverless deployment path with proxy on Railway/Render.

Key technical discoveries:

- FLUX.1-dev is loaded on a single GPU with float16 T5 and NF4 transformer.
- Pipeline moved away from dual-GPU hacks into a cleaner single-device design.
- Approx VRAM from docs: 17.7 GB with T5, transformer, VAE, CLIP, PuLID, and CLIP scoring.
- PuLID scales are carefully tuned per shot:
  - shot 2: 0.40
  - shot 3: 0.75 for face action, 0.45 when ambiguous
  - shot 4: 0.85
- Guidance tuning matters heavily: higher guidance can override identity conditioning.
- System has Indian/South Asian context detection to avoid defaulting to Western faces/settings for Indian scenes.
- A UI idle bug was identified: health/lora polling could wake the RunPod GPU and create cost. The guide documents a zero-call-on-page-load fix.

Key metrics and proof:

- Full 4-shot generation around 90 seconds in the README flow.
- Modal cold starts: first compile 2-4 minutes, subsequent cold starts 30-70 seconds, warm around 5 seconds.
- RunPod A40 cost guide: around USD 0.014 to 0.020 per storyboard depending on GPU and warm/cold behavior; later guide estimates USD 0.04 to 0.08 per generation including cold-start costs.
- RunPod A40 is framed as substantially cheaper than Modal L40S for beta users.
- Network volume sizing: 70 GB tight, 100-150 GB safer depending on LoRAs/output growth.

Portfolio angle:

This is the strongest visual and creative AI experience. It proves Parth can operate large diffusion pipelines, identity consistency, style systems, GPU deployment economics, and end-user creative tooling.

Visual metaphor:

A director's table or film set where each project chapter opens as a shot list: plan, generate, lock identity, grade, score, export.

Claims to avoid:

- Do not claim model training from scratch.
- Do not expose actual API URLs, HF tokens, Groq keys, or deployment secrets.
- Do not claim perfect identity consistency; present it as tuned and measured.

### Stick and Dot App

Canonical folder:

`C:\great learning self paced\Stick and dot\stick-and-dot-app`

What it is:

Stick and Dot App is a role-based editorial and commission platform built with Next.js, Supabase Auth, Supabase Postgres, RLS, and Supabase Storage. It supports writer, reader, subject expert, and business/client flows.

Important components:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase Auth and SSR cookies.
- Supabase Postgres with RLS.
- Supabase Storage.
- Role-guarded dashboards.
- Writer article creation.
- SME review workflows.
- Reader comments and reading lists.
- Business commission creation, applications, assignment, and acceptance flows.
- Seeded dev-auth mode for controlled demos.

Database evidence:

Core tables include:

- `profiles`
- `domains`
- `profile_domains`
- `public_profiles`
- `commissions`
- `articles`
- `article_reviews`
- `article_comments`
- `commission_applications`
- `commission_payments`
- `reading_lists`
- `reading_list_items`
- `reading_progress`

RLS evidence:

- RLS enabled on profile, commission, article, review, comment, payment, reading-list, and storage flows.
- Storage buckets include profile files, article assets, and comment files.

Portfolio angle:

This is the "I can build real product surfaces, not just ML notebooks" experience. It should be shown as internship production work, not as a personal project.

Visual metaphor:

A role-based operations board: writer, reader, SME, and business lanes with arrows showing who can create, review, apply, comment, and publish.

Claims to avoid:

- Do not imply the whole company product strategy was owned by Parth.
- Do not expose `.env.local` values or Supabase keys.

### QueryPilot

Canonical folder:

`C:\great learning self paced\z Final Projects\querypilot`

What it is:

QueryPilot is a self-correcting multi-agent Text-to-SQL API. It translates natural language questions into SQL over a known schema, validates against schema and safety rules, executes queries, and self-corrects failed SQL.

Important components:

- FastAPI API.
- LangGraph orchestration.
- ChromaDB schema retrieval.
- PostgreSQL execution.
- Groq/OpenAI LLM calls.
- SentenceTransformers embeddings.
- Agents:
  - Schema Linker
  - SQL Generator
  - Critic
  - Executor
  - Corrector
  - Response layer

Key metrics and proof:

- Core ecommerce eval: 67/70 final success, 95.7 percent.
- First attempt: 63/70, 90 percent.
- Correction lift: +5.7 percentage points.
- Syntactic hallucination: 0 percent.
- Adversarial: 9/12, 75 percent.
- Library-schema transfer: 15/15, 100 percent first attempt with zero tuning.
- Adding the library schema required 14 lines across 3 files.
- Remote Render latency: p50 3.78s, p95 9.676s.
- Critic roughly 3ms, far cheaper than LLM validation.

Architecture details:

- SchemaLinker retrieves 2-4 relevant tables and expands foreign keys.
- SQLGenerator is constrained to allowed tables.
- Critic uses sqlparse, schema regex checks, safety blocklists, and semantic confidence thresholds.
- Executor uses SQLAlchemy pooling, `LIMIT 1000`, and query timeout.
- Self-correction:
  - Attempt 1: LLM generation.
  - Attempt 2: regex/fuzzy repair for column errors without LLM.
  - Attempt 3: LLM correction with classified error context.

Portfolio angle:

This is a crisp systems project: retrieval, agents, constraints, safety, correction, eval, and deployment. It is one of the strongest recruiter-readable projects.

Visual metaphor:

A city where buildings are database tables. A user question becomes a light path through the schema; the critic checkpoints block unsafe or impossible paths.

Claims to avoid:

- Evaluation measures execution success, not full semantic correctness.
- The module-level global orchestration may have concurrency issues for different schemas.
- The adversarial safety layer is keyword-based and should not be oversold.

### Evidence-Bound Drug RAG / MedRAG

Canonical folder:

`C:\great learning self paced\z Final Projects\Evidence-Bound-Drug-RAG`

What it is:

MedRAG is a medical RAG system over FDA and NICE drug documents. It answers only when it has evidence, cites sources, and refuses when the evidence is insufficient or the user asks for medical advice beyond scope.

Important components:

- FDA and NICE drug-document corpus.
- LlamaParse document parsing with table preservation.
- Semantic chunking.
- ChromaDB vector retrieval.
- BM25 and hybrid retrieval experiments.
- SentenceTransformers `all-MiniLM-L6-v2`.
- FastAPI API.
- Streamlit UI.
- Groq/OpenAI generation/evaluation.
- RAGAS evaluation.
- Runtime refusal policy.

Key corpus facts:

- 20 PDFs.
- 12 FDA documents.
- 8 NICE documents.
- 716 pages.
- 853 semantic chunks.
- 8 drugs.

Key metrics and proof:

- Overall RAGAS around 0.712.
- Faithfulness around 0.796.
- Answer relevancy around 0.696.
- Context precision around 0.644.
- 20-query final eval: 16 answered, 4 refused.
- 100 percent refusal accuracy in the final eval.
- 0 false refusals.
- When the system answered, faithfulness was around 0.99.
- Vector retrieval had 100 percent drug accuracy in experiments.
- BM25 had 40 percent drug accuracy.
- Hybrid had 64 percent drug accuracy.
- Production `/ask` uses vector-only retrieval by design after hybrid experiments showed generic-term contamination.
- Average vector retrieval around 22ms.
- Groq production path can be near USD 0/query; OpenAI eval run cost around USD 0.168.

Architecture details:

- Pydantic request validation.
- Preloaded ChromaDB, BM25, Hybrid, and LLM clients.
- Runtime-loaded refusal policy.
- Groq `llama-3.3-70b`, temperature 0, max tokens 500.
- Citation extraction via regex and JSONL logs.

Portfolio angle:

This should be the evidence/safety anchor. It proves Parth can build RAG systems that refuse and cite, not just answer.

Visual metaphor:

A clinical evidence chamber where answers are lit only when source documents support them. Refusals are not failures; they are safety boundaries.

Claims to avoid:

- Not medical advice.
- Not clinically validated.
- Context precision remains a bottleneck.
- Interaction/mechanism queries are weaker.

### UPI Fraud Detection Engine

Canonical folder:

`C:\great learning self paced\z Final Projects\upi-fraud-engine`

What it is:

A production-style real-time UPI fraud scoring system built from a synthetic UPI transformation of IEEE-CIS/Kaggle fraud data. It includes point-in-time feature engineering, leakage tests, model training, API scoring, alert-budget control, backtesting, and monitoring patterns.

Important components:

- Synthetic UPI transaction generation.
- DuckDB feature engineering.
- Point-in-time velocity and graph features.
- XGBoost model.
- Isolation Forest + XGBoost experiment.
- FastAPI scoring service.
- Great Expectations validation.
- Leakage test suite.
- OnlineFeatureStore with pre-ingest feature calculation.
- Dynamic thresholding and alert budget control.
- 7-day replay backtest.

Key data facts:

- 1,097,231 generated transactions.
- Modeling set: 590,546 rows.
- Fraud rate: 3.61 percent.
- Train: 498,108 rows from Jan-May 2025.
- Test: 85,429 rows from Jun-Jul 2025.
- Buffer: 7,009 rows.
- 48h label delay.

Key feature facts:

- 487 total training-table features.
- 482 production features.
- 11 engineered point-in-time velocity/graph features.
- 471 raw Vesta/IEEE signals.
- DuckDB feature engineering around 116s on Colab free tier.
- Peak memory around 8 GB.
- An O(N^2) time-window bottleneck created huge intermediate work; graph cardinality was changed to `ROWS BETWEEN 1000 PRECEDING AND 1 PRECEDING`, reducing a failing/120+ minute path to roughly 11s for that step and 116s total.

Key model metrics:

- Production XGBoost ROC-AUC: 0.8918.
- PR-AUC: 0.5042.
- Precision at 0.5 percent alert budget: 92.06 percent.
- Recall: 12.81 percent.
- Threshold: 0.994.
- Two-stage Isolation Forest + XGBoost: ROC-AUC 0.8953, PR-AUC 0.5166.
- Production choice remained single-stage XGBoost due lower complexity.

Backtest metrics:

- 7-day replay.
- 22,071 transactions.
- 701 frauds.
- 113 alerts.
- 85 true positives.
- 28 false positives.
- Precision: 75.22 percent.
- Recall: 12.13 percent.
- 0 budget violations.
- Best day: 100 percent precision.
- Worst day: 33.3 percent precision.
- Daily precision standard deviation: 22.06 percent.

Latency:

- Average around 233-272ms depending on run.
- p50 around 256ms.
- p95 around 386ms.
- p99 around 450ms.
- Max around 527ms.
- Target under 500ms.

Validation:

- 2 Great Expectations suites.
- 9 validation rules.
- 55+ leakage tests.
- Caught synthetic `fraud_pattern` target leakage that inflated ROC-AUC to 0.9106.

Known issue:

- Online feature store state is in-memory.
- Cold API ROC-AUC can drop to around 0.5969 until warmed.
- Needs Redis, DynamoDB, or DB-backed warm state for production reliability.

Portfolio angle:

This shows serious ML engineering: temporal leakage, alert budgets, backtesting, latency, feature contracts, and business constraints. It is much stronger than presenting only model metrics.

Visual metaphor:

A payment-risk radar over an Indian transaction network. Fraud pulses travel across nodes while a dynamic threshold line keeps alerts inside budget.

Claims to avoid:

- Do not imply real bank/UPI production data.
- Do not hide the cold-start issue.
- Do not frame recall as high; the system chooses precision under budget.

### Fraud Risk Intelligence System

Canonical folder:

`C:\great learning self paced\z Final Projects\Fraud-Risk-Intelligence-System`

What it is:

An earlier explainable fraud ML serving system on the credit card fraud dataset. It includes XGBoost, autoencoder, Isolation Forest, MLP, stacking, SHAP, FastAPI, Streamlit, and Docker.

Important components:

- Frozen preprocessing contract.
- Training equals inference equals explainability.
- XGBoost.
- PyTorch Autoencoder.
- Isolation Forest.
- MLP.
- Stacked Logistic Regression.
- SHAP explainability.
- FastAPI API.
- Streamlit UI.
- Docker.

Key data facts:

- Dataset: 284,807 transactions.
- Fraud rate: 0.17 percent.
- PCA-style V1-V28 credit card features.

Key XGBoost metrics:

- CV mean PR-AUC: 0.845.
- CV ROC-AUC: 0.984.
- Test precision at default threshold: 0.952.
- Test recall: 0.806.
- Test F1: 0.873.
- Test ROC-AUC: 0.977.
- Test PR-AUC: 0.850.
- Tuned threshold 0.01: precision 0.689, recall 0.857, F1 0.764.

Key ensemble metrics:

- CV PR-AUC mean: 0.811.
- CV recall mean: 0.899.
- Test precision: 0.280.
- Test recall: 0.867.
- Test F1: 0.423.
- Test ROC-AUC: 0.956.
- Test PR-AUC: 0.764.
- Threshold: 0.41.

Portfolio angle:

Use as "earlier ML serving and explainability project" rather than flagship. It supports a growth story from dataset-model-serving to the stronger UPI fraud system.

Visual metaphor:

A lab notebook panel beside the UPI fraud system showing earlier experiments, SHAP explanations, and model comparison.

Claims to avoid:

- Do not over-position it as newer/better than the UPI fraud system.
- The credit-card dataset is standard and widely used; make the production packaging the point.

### OncoVerse

Canonical folder:

`C:\great learning self paced\z Final Projects\oncoverse`

What it is:

OncoVerse is an in-progress open-source cancer education atlas. The goal is a 3D, explorable, source-backed cancer learning product: "You do not browse cancer. You explore it." It is not diagnostic.

Important components:

- React 19.
- Vite 8.
- TypeScript 6.
- Three.js.
- React Three Fiber.
- Drei.
- Tailwind v4.
- Framer Motion.
- Zustand.
- Lucide React.
- Typed cancer data model.
- Source-backed Medullary Thyroid Carcinoma data.
- Procedural 3D anatomy interaction slice.

Status as of local docs:

- Foundation underway around 2026-05-27.
- App shell exists.
- Typed cancer data exists.
- MTC data is the first complete cancer entry.
- Other cancer JSONs are stubs.
- Scene supports auto-orbit, drag/zoom, hover, click selection, and info-panel updates.
- Real GLB anatomy model not selected yet.
- Vite build and lint had passed according to docs.

MTC structure IDs:

- `thyroid_right_lobe`
- `thyroid_left_lobe`
- `tumor_mass`
- `jugular_vein`
- `recurrent_laryngeal_nerve`
- `lymph_nodes`
- `trachea`

Sources noted in project data:

- NCI.
- NCBI/StatPearls.
- NCBI/Endotext.

Medical review status:

- `needs-review`

Roadmap:

- v0.2 AI explainer.
- v0.3 report explainer/PDF.
- v0.4 progression simulator.
- v1: 20+ cancers.
- v2: DICOM/digital twin direction.

Portfolio angle:

OncoVerse should be framed as the current ambition project: medical education, 3D interface, source-backed content, and careful non-diagnostic boundaries.

Visual metaphor:

A living atlas: a bioluminescent anatomy scene where the user explores structures, stage changes, evidence snippets, and educational explanations.

Claims to avoid:

- Do not call it medically reviewed yet.
- Do not call it diagnostic.
- Do not imply full cancer coverage; MTC is the first real slice.

### Order Supervisor

Canonical folder:

`C:\great learning self paced\z Final Projects\order-supervisor`

What it is:

Order Supervisor is an AI-powered order supervision system where every order has a long-running Temporal workflow. The workflow sleeps, wakes on signals or timers, reasons with an LLM, takes business actions, and summarizes lifecycle events.

Important components:

- FastAPI backend.
- Temporal workflows.
- Next.js 14 frontend.
- PostgreSQL.
- OpenAI/Groq.
- Agent runtime.
- Event/state/action log.

Core architecture:

- One Temporal workflow per order.
- Workflow waits on signals/timers instead of polling with cron.
- Signals:
  - `order_event`
  - `add_instruction`
  - `interrupt`
  - `resume`
  - `terminate`
- Completion is owned by lifecycle rules, not by the LLM:
  - terminal delivery/refund/cancel event
  - manual terminate
  - max age
- LLM recommendation is advisory.
- Single `activity_log` captures events, actions, reasoning, and summaries.

Portfolio angle:

This is a strong agent-systems project because it refuses the naive "LLM loop" design. It demonstrates durable workflows, event-driven wakeups, and separation between reasoning and business authority.

Visual metaphor:

A timeline chamber where orders sleep as timelines, wake when events arrive, reason briefly, act, and sleep again.

Claims to avoid:

- Do not imply Temporal lets the LLM control lifecycle authority.
- Do not frame it as a generic chatbot; it is a workflow/state system.

### Oracle Auto Provision

Canonical folder:

`C:\great learning self paced\z Final Projects\oracle-auto-provision`

What it is:

A small automation project that repeatedly tries to provision an Oracle Cloud Always Free A1 instance and sends Telegram notifications when successful.

Important components:

- Python OCI SDK.
- GitHub Actions workflow every 5 minutes.
- Attempts multiple availability domains.
- Creates an A1 Flex instance for `secondself-v2`.
- Checks whether an instance already exists before creating.
- Retrieves public IP from VNIC.
- Sends Telegram notifications.
- Disables workflow after success.

Portfolio angle:

This is not a flagship project, but it is an excellent "I make practical infra automations when real constraints get annoying" proof point. Use as a small infrastructure badge or sidebar artifact.

Claims to avoid:

- Do not expose private keys, `.env`, tenancy OCIDs, or Telegram tokens.
- Do not make it look bigger than it is.

## Cross-Project Skill Map

AI application engineering:

- RAG systems.
- Query planning and schema retrieval.
- Multi-agent orchestration.
- LLM validation and correction.
- Refusal policies.
- Eval-driven iteration.
- Prompt and tool design.

ML engineering:

- XGBoost.
- Isolation Forest.
- Autoencoders.
- Leakage testing.
- Point-in-time feature engineering.
- Backtesting.
- Thresholding under alert budgets.
- SHAP.

Creative AI:

- FLUX.1-dev.
- PuLID.
- LoRA routing.
- CLIP scoring.
- Diffusion deployment.
- Storyboard generation.
- GPU cost control.

Backend and infra:

- FastAPI.
- Next.js.
- React.
- Vite.
- Streamlit.
- PostgreSQL.
- Supabase.
- ChromaDB.
- Qdrant.
- Docker.
- Temporal.
- GitHub Actions.
- Oracle Cloud.
- Modal.
- RunPod.
- Render/Railway/Vercel patterns.

Frontend/product:

- Role-based dashboards.
- 3D anatomy/education interface.
- Storyboard tooling.
- Auth flows.
- RLS-backed app surfaces.
- Tailwind interfaces.

## Claims To Use

Use these confidently:

- Built evidence-grounded RAG systems with measurable faithfulness, refusal behavior, and citation flows.
- Built self-correcting Text-to-SQL with schema retrieval, critic validation, and execution-based eval.
- Built real-time fraud scoring with point-in-time features, leakage tests, dynamic thresholds, and backtesting.
- Built large-model storyboard inference with FLUX.1-dev, PuLID identity locking, LoRA styles, CLIP scoring, and GPU deployment cost work.
- Built role-based full-stack product surfaces with Supabase Auth, Postgres, RLS, and Storage.
- Built long-running agent workflows with Temporal where lifecycle authority stays outside the LLM.
- Built practical infra automation on Oracle Cloud and GitHub Actions.

## Claims To Avoid

Avoid these:

- "ML researcher" or "deep learning researcher."
- "Medical-grade" or "clinically validated."
- "Production UPI bank fraud detector" on real bank data.
- "Fully autonomous job applier" if manual assist or CAPTCHA fallback remains.
- "Trained FLUX" or "trained foundation models."
- "Perfect hallucination-free SQL."
- "OncoVerse is medically reviewed."
- "Semantic correctness proven" for QueryPilot where the eval is execution-focused.
- Anything that exposes secrets, keys, service URLs, private IPs, tokens, cookies, or deployment credentials.

## Recommended Tech Stack For The Portfolio

Core:

- Vue 3.
- Vite.
- TypeScript.
- TresJS on top of Three.js.
- GSAP + ScrollTrigger.
- Tailwind CSS.

State and content:

- Pinia for Vue state.
- Local structured project data in `src/content/projects.ts` or `src/content/projects/*.md`.
- A lightweight JSON schema for every project card.
- Optional `lite=true` mode for a recruiter-friendly static version.

3D:

- Three.js base renderer.
- TresJS for Vue-native scene components.
- Cientos for TresJS helpers if needed.
- Blender-authored GLB assets only where they add value.
- Draco or meshopt compression for GLB.
- KTX2/Basis textures for serious 3D scenes.
- Instancing for repeated geometry.
- Aggressive mobile fallbacks.

Motion:

- GSAP timelines for scene choreography.
- ScrollTrigger for scrubbed/pinned sections.
- Avoid motion that competes with comprehension.
- Motion should reveal state, focus, transitions, and causality.

Extras:

- `cannon-es` or Rapier only where physics is central to the concept.
- Howler.js for optional user-controlled audio.
- `prefers-reduced-motion` support.
- Static/lite project pages for mobile and low-power devices.

Why this stack fits:

- Three.js is the practical base for 3D browser scenes.
- TresJS gives Vue a declarative 3D layer.
- GSAP/ScrollTrigger is a strong fit for scroll-driven narrative and camera choreography.
- Tailwind is fast for building dense, consistent UI surfaces.
- Vite gives fast dev and TypeScript support, but type checking should still run separately.

## Design Lessons From External Research

What the best creative portfolios do:

- They become a place, not just a page.
- The 3D layer carries a message; it is not decorative wallpaper.
- Each transition has meaning.
- The best ones still explain the work clearly.
- The 3D experience is paired with performance discipline: compressed assets, instancing, culling, mobile shader simplification, and careful scroll state.
- Optional audio can add presence, but it must be user-controlled.
- A recruiter-friendly path must exist because not every visitor wants a game.

Useful patterns:

- Bruno Simon: interactive game/world as navigation; clear behind-the-scenes stack; audio and physics as part of the identity.
- Codrops/Joseph Santamaria: scroll-driven 3D environment where technical choices serve the message; optimization is part of the craft.
- Awwwards: recurring high-end categories include 3D, WebGL, GSAP, unusual navigation, storytelling, transitions, and minimal/clean interfaces.
- Runway AIF: the creative AI world is moving beyond film into design, new media, fashion, advertising, and gaming. Parth's Vivid + OncoVerse + systems work fits this interdisciplinary territory.
- Apple motion guidance: motion should communicate context and feedback, not just decorate.

## Portfolio Data Model

When the site is built, every project should be entered in a structured form like:

```ts
type PortfolioProject = {
  id: string
  title: string
  status: "complete" | "in-progress" | "experience" | "mini"
  category: "rag" | "agents" | "ml" | "creative-ai" | "infra" | "frontend" | "medical"
  oneLine: string
  problem: string
  solution: string
  proof: string[]
  stack: string[]
  architecture: string[]
  metrics: { label: string; value: string; note?: string }[]
  caveats: string[]
  links: { label: string; href: string; type: "github" | "demo" | "video" | "case-study" }[]
  visualMetaphor: string
}
```

This avoids rewriting project copy across components. The 3D scene can consume the same data as the case-study pages.

## 12 Portfolio Ideas

These are intentionally not copies of the 24 ideas already listed in the prompt. They are designed around Parth's actual work and the internet research above.

### 1. Evidence Atlas Command Center

Core idea:

A clean, high-precision 3D evidence atlas. The hero is not a "cool AI brain"; it is a living control surface where every project is a system with visible evidence, constraints, eval metrics, and failure boundaries.

Experience:

- First screen: a quiet bioluminescent map with Parth's name as a system label, not a giant marketing hero.
- Projects are instruments around the atlas: RAG chamber, SQL city, fraud radar, storyboard studio, workflow timeline.
- Clicking a project zooms into a short 3D vignette, then lands on a readable case study.
- Every claim has a proof chip: metric, architecture, evaluation, caveat.

Why it fits:

It combines OncoVerse, MedRAG, QueryPilot, SecondSelf, and UPI Fraud under one mature idea: AI systems should be inspectable.

Risk:

Needs disciplined art direction so it does not become generic dark sci-fi.

### 2. The System That Refuses

Core idea:

A portfolio where the central mechanic is permission. AI outputs only appear when evidence, schema, state, and budget checks pass. Refusals are beautiful, not hidden.

Experience:

- The user sees requests enter a gateway.
- MedRAG passes only if citations exist.
- QueryPilot passes only if schema and safety checks pass.
- UPI Fraud passes only if alert budget allows.
- Order Supervisor passes only if workflow lifecycle rules allow.
- SecondSelf passes only if personal KB evidence supports the claim.

Why it fits:

Most AI portfolios brag about generation. This one brags about restraint, which is rarer and more senior.

Risk:

Needs excellent copywriting so "refusal" feels powerful, not negative.

### 3. Personal AI Operating System

Core idea:

The portfolio is presented as Parth's own OS. Projects are apps, logs, daemons, monitors, and command panels inside one personal machine.

Experience:

- SecondSelf is the kernel.
- Vivid is the creative GPU app.
- QueryPilot is the database interpreter.
- UPI Fraud is the risk monitor.
- MedRAG is the evidence browser.
- Order Supervisor is the workflow daemon.
- Oracle Auto Provision is the infra utility.

Why it fits:

It is personal without being sentimental, and it lets the site be both minimal and interactive.

Risk:

Avoid fake terminal overload. Use terminal only where it helps.

### 4. The Inspection Room

Core idea:

An Apple-minimal forensic lab where each project is a transparent artifact under inspection. The user can rotate the artifact, reveal metrics, reveal failure notes, and open the case study.

Experience:

- White/soft-gray interface with precise black typography.
- 3D glass instruments hold each project.
- Labels are compact: metric, stack, caveat.
- "Open evidence" expands into source-backed project details.

Why it fits:

This makes the numbers and caveats the aesthetic, which matches Parth's evidence-heavy work.

Risk:

Could feel too sterile unless the motion and materials are exceptional.

### 5. Schema City

Core idea:

A 3D city where tables are buildings, foreign keys are roads, and user questions become animated routes through QueryPilot's schema.

Experience:

- Hero starts in a quiet city from above.
- The user enters natural-language questions.
- The city lights up tables and joins.
- Unsafe queries hit red checkpoints.
- Successful queries generate result panels.
- Other projects become districts: Medical District, Fraud District, Creative Studio, Workflow Tower.

Why it fits:

QueryPilot is one of the cleanest projects visually. The metaphor naturally explains schema linking and correction.

Risk:

Might over-center QueryPilot unless other projects are woven in as districts.

### 6. Fraud Radar India

Core idea:

A payment-risk radar where transaction pulses move through a network and the user can see precision, recall, alert budget, latency, and leakage tests as live controls.

Experience:

- UPI-style transaction pulses animate across a network.
- The threshold horizon moves as alert budget changes.
- The backtest week plays like a replay.
- Leakage tests appear as warning overlays that get removed.
- A cold-start warning explains the known in-memory feature store limitation.

Why it fits:

It turns the strongest ML engineering details into something interactive and memorable.

Risk:

Should not look like a fintech product dashboard template. It needs a distinctive visual language.

### 7. Storyboard Reactor

Core idea:

The Vivid project becomes the site's cinematic engine. Every portfolio section opens like a 4-shot storyboard: establish, system, proof, caveat.

Experience:

- Selecting a project generates a 4-panel narrative structure:
  - Shot 1: problem world.
  - Shot 2: architecture.
  - Shot 3: metrics/proof.
  - Shot 4: limitation/next step.
- Transitions mimic camera blocking, grading, and storyboard frames.
- The site uses a director's table aesthetic without becoming a film-student cliche.

Why it fits:

It makes Vivid's core workflow the grammar of the whole portfolio.

Risk:

Needs real visual assets or carefully designed procedural panels.

### 8. Temporal Mission Timeline

Core idea:

The portfolio is a durable workflow. Visitors scroll through time rather than pages. Systems sleep, wake, reason, act, and summarize.

Experience:

- The hero is a long horizontal time rail.
- Order Supervisor explains the underlying metaphor.
- SecondSelf applications wake on job events.
- Fraud alerts wake on thresholds.
- MedRAG wakes on evidence requests.
- QueryPilot wakes on schema intent.
- The user's scroll is the clock.

Why it fits:

It highlights Parth's uncommon agent/workflow thinking: agents are not chat bubbles; they are processes with state.

Risk:

Horizontal timelines can become annoying. Needs mobile-first fallback.

### 9. The Living Medical Atlas

Core idea:

OncoVerse's anatomy-first language becomes the portfolio language: every project has anatomy. You inspect its data, retrieval, reasoning, serving, eval, and deployment organs.

Experience:

- The hero is a full-viewport interactive anatomy/atlas scene, abstract enough to avoid medical creepiness.
- Projects open as "system anatomies."
- Each system has layers: data, retrieval/features, model/LLM, guardrails, serving, eval.
- MedRAG and OncoVerse are literal atlas chapters; other systems become metaphorical anatomies.

Why it fits:

It creates a unique brand: systems anatomy. It also connects the current OncoVerse work to the rest of the portfolio.

Risk:

Must be careful with medical claims and visual tone.

### 10. The Cost Of Intelligence

Core idea:

A portfolio about AI under budget. Every project exposes the tradeoff between cost, latency, accuracy, faithfulness, and user control.

Experience:

- The user adjusts sliders:
  - latency vs quality
  - precision vs recall
  - cost vs scale
  - evidence strictness vs answer rate
  - automation vs human approval
- The scene responds by showing which project decisions change.
- Vivid shows Modal vs RunPod.
- UPI Fraud shows threshold/alert budget.
- MedRAG shows refusal vs answer.
- QueryPilot shows LLM correction vs cheap critic.

Why it fits:

This is highly differentiated because most portfolios hide tradeoffs. Parth's best work is full of tradeoffs.

Risk:

Needs tight UX; too many sliders can feel like a settings panel.

### 11. The Archive Of Systems That Failed First

Core idea:

A portfolio museum built around failures, recoveries, and design decisions. Instead of pretending every project was smooth, each case study starts with the problem that broke.

Experience:

- Artifacts are labeled by failure:
  - Hybrid retrieval looked good but hurt drug accuracy.
  - Fraud leakage inflated ROC-AUC.
  - High guidance broke identity consistency.
  - In-memory online store hurt cold fraud scoring.
  - Generic auto-apply needed manual assist boundaries.
- Then each artifact reveals the fix and metric.

Why it fits:

This is extremely mature. It says Parth can debug and reason, not just assemble demos.

Risk:

Needs confidence in tone; failures must feel like engineering evidence, not confession.

### 12. Split Mode: Recruiter / Builder

Core idea:

One portfolio with two synchronized modes. Recruiter mode is fast, minimal, and text-forward. Builder mode is cinematic, 3D, and interactive. Same data, two lenses.

Experience:

- A single toggle or draggable divider switches modes.
- Recruiter mode shows project cards, metrics, stack, resume, links.
- Builder mode launches the 3D scene for each project.
- The site remembers preference.
- Mobile defaults to recruiter mode with optional 3D entry points.

Why it fits:

It solves the real problem: creative portfolios impress, but hiring visitors still need to scan fast.

Risk:

Must not double the workload. The same content model must power both modes.

## Recommended Direction

Best overall concept:

Evidence Atlas Command Center.

Why:

- It is broad enough to hold all projects.
- It is not a generic dark 3D portfolio.
- It naturally supports medical, RAG, fraud, SQL, creative AI, infra, and workflow projects.
- It turns metrics and caveats into a visual language.
- It can be Apple-minimal in the UI layer while still cinematic in the 3D layer.

Suggested blend:

- 60 percent Evidence Atlas Command Center.
- 20 percent System That Refuses.
- 10 percent Storyboard Reactor.
- 10 percent Split Mode.

In plain terms:

Build a precise, cinematic evidence atlas where projects are inspectable systems. Make the first path fast and recruiter-readable. Make the second path a 3D world that rewards curiosity.

## First Build Architecture

Pages/routes:

- `/` - cinematic 3D atlas with fast project access.
- `/projects/:slug` - readable case study pages.
- `/lite` - minimal recruiter mode.
- `/resume` - resume/contact/download.
- `/lab` - optional playground for interactive tradeoffs.

Core components:

- `ProjectAtlasScene.vue`
- `ProjectNode.vue`
- `EvidencePanel.vue`
- `MetricStrip.vue`
- `CaseStudyPage.vue`
- `ProjectTimeline.vue`
- `StackBadgeGrid.vue`
- `CaveatBlock.vue`
- `SourceLinks.vue`
- `RecruiterMode.vue`

Content files:

- `src/content/profile.ts`
- `src/content/projects.ts`
- `src/content/experience.ts`
- `src/content/skills.ts`
- `src/content/claims.ts`

Performance rules:

- The first viewport must load quickly.
- Do not block the text UI on 3D assets.
- Lazy-load heavy scenes after first content paint.
- Use a static fallback if WebGL fails.
- Respect reduced-motion settings.
- Test desktop and mobile screenshots before shipping.

## Draft Homepage Narrative

Hero:

> Parth Tiwari builds AI systems that stay inside their evidence, schema, budget, and workflow state.

Subcopy:

> GenAI application engineer working across RAG, agents, fraud ML, creative diffusion pipelines, and production deployment.

Primary CTA:

- View projects.

Secondary CTA:

- Open recruiter mode.

Project section labels:

- Evidence-bound AI.
- Self-correcting systems.
- Real-time risk.
- Creative inference.
- Durable agents.
- Practical infra.

## Short Project Copy

SecondSelf:

Personal AI career OS with KB-grounded retrieval, resume/JD scoring, document generation, application tracking, Telegram controls, and autonomous job-pipeline experiments.

Vivid:

Cinematic storyboard AI using FLUX.1-dev, PuLID identity locking, 13 LoRA styles, Groq planning, CLIP scoring, grading, PDF export, and cost-aware GPU deployment.

Stick and Dot:

Role-based editorial and commission platform using Next.js, Supabase Auth/Postgres/RLS/Storage, and dashboards for writers, readers, SMEs, and business users.

QueryPilot:

Self-correcting Text-to-SQL API with schema retrieval, critic validation, execution, correction, and 95.7 percent final success on a 70-query ecommerce eval.

MedRAG:

Evidence-bound medical RAG over FDA/NICE drug documents with citations, refusal policy, RAGAS evaluation, and 100 percent refusal accuracy in final eval.

UPI Fraud:

Real-time fraud scoring system with point-in-time features, XGBoost, leakage tests, 7-day replay backtest, alert-budget thresholding, and p95 latency under 400ms.

OncoVerse:

In-progress 3D cancer education atlas with source-backed MTC data, typed medical content, interactive anatomy structures, and a non-diagnostic education boundary.

Order Supervisor:

Temporal-based order supervision where long-running workflows sleep, wake on signals, ask LLMs for advisory reasoning, act through tools, and preserve lifecycle state.

FRIS:

Explainable credit-card fraud ML/API project with XGBoost, autoencoder, Isolation Forest, stacking, SHAP, FastAPI, Streamlit, and frozen preprocessing.

Oracle Auto Provision:

Small GitHub Actions and OCI SDK automation that repeatedly attempts Always Free A1 instance provisioning and notifies via Telegram.

## Open Decisions

Decide before coding:

- Exact visual direction: Evidence Atlas vs Personal OS vs Split Mode.
- Whether to include optional audio.
- Whether to make a single hero scene or one scene per project.
- Whether project details are markdown-driven or TypeScript-object-driven.
- Whether the public portfolio should expose demos with live URLs or only case-study links.
- How much Stick and Dot work can be publicly shown without company/privacy issues.
- Which visual assets can be reused safely from local projects.

## Final Recommendation

Build the portfolio as an "Evidence Atlas" with a recruiter-fast mode.

The site should feel like a minimal Apple-quality instrument, not a dark template. The 3D should be there because it explains Parth's work: evidence chambers, schema routes, risk pulses, workflow timelines, storyboard panels, and medical atlas structures. The most differentiated thing is not the animation; it is the idea that every project can be inspected for proof, tradeoff, and limitation.

