import type { Project } from '@/types/project'
import type { SliderConfig } from '@/types/slider'

export const sliderConfigs: SliderConfig[] = [
  {
    key: 'evidenceStrictness',
    labelLeft: 'Permissive',
    labelRight: 'Bounded',
    metricLabel: 'refusal rate',
    metricValue: '~20%',
    metricContext: 'adversarial inputs',
    affectedProjectId: 'medrag',
  },
  {
    key: 'latencyBudget',
    labelLeft: 'Fast',
    labelRight: 'Accurate',
    metricLabel: 'correction depth',
    metricValue: '+5.7pp',
    metricContext: 'on 82-query benchmark',
    affectedProjectId: 'querypilot',
  },
  {
    key: 'costPerQuery',
    labelLeft: 'Cheap',
    labelRight: 'Rich',
    metricLabel: 'cost per storyboard',
    metricValue: '$0.04-0.08',
    metricContext: 'RunPod A40',
    affectedProjectId: 'stick-and-dot',
  },
  {
    key: 'alertBudget',
    labelLeft: 'Aggressive',
    labelRight: 'Conservative',
    metricLabel: 'precision',
    metricValue: '92.06%',
    metricContext: 'at 0.5% alert budget',
    affectedProjectId: 'upi-fraud',
  },
  {
    key: 'automationVsControl',
    labelLeft: 'Autonomous',
    labelRight: 'Supervised',
    metricLabel: 'apply mode',
    metricValue: 'human-gated',
    metricContext: 'Telegram review queue',
    affectedProjectId: 'secondself',
  },
]

export const projects: Project[] = [
  {
    id: 'beatmind',
    name: 'BeatMind',
    tagline: 'Music platform that takes a track apart and lets you rebuild it.',
    status: 'active',
    nodeKind: 'current-build',
    origin: 'work',
    weight: 'flagship',
    started: '2026-07',
    stack: [
      'Next.js 16',
      'React 19',
      'Modal',
      'ACE-Step',
      'BS-RoFormer',
      'Drizzle',
      'Neon',
      'Clerk',
      'Cloudflare R2',
      'AcoustID',
    ],
    outcome:
      'Built solo in 24 days for an early-stage studio. Producers upload a track, get its stems, key, BPM and song structure back, and rebuild it in a section-by-stem editor that keeps every substitution in key and in tempo.',
    // Verified 2026-08-17: live on its own production domain with production Clerk
    // keys. The apex 308-redirects to www, so www is the canonical form — linking
    // the apex is what silently broke Modal's webhook callbacks (see the Problem
    // panel). Sign-up is invite-only for the closed pilot; the marketing surface
    // is public.
    images: [
      {
        src: '/media/beatmind-desktop.jpg',
        alt: 'BeatMind landing page: the headline "Get inside the music" beside a circular '
          + 'visualisation of a track, with navigation for the editor, what it hears and what it costs.',
        caption: 'The public marketing surface, captured 2026-08-18. The editor itself is '
          + 'invite-only for the closed pilot, so it is deliberately not shown.',
      },
      {
        src: '/media/beatmind-mobile.jpg',
        alt: 'The same BeatMind landing page on a phone-width screen.',
        caption: 'The same page at 390px.',
      },
    ],
    video: {
      src: '/media/beatmind.webm',
      poster: '/media/beatmind-desktop.jpg',
      description: 'A silent scroll through the BeatMind marketing page, captured from the live site.',
    },
    links: {
      liveUI: 'https://www.beatmind.tech',
    },
    panels: {
      problem: {
        quote: 'Production served every page correctly while the product did not work.',
        brokenFlowId: 'beatmind-infra-silent-failure',
      },
      architecture: {
        summary:
          'A Next.js BFF over four independently deployed Modal services, joined by a resumable job state machine because GPU workers fail in ways nothing reports.',
        nodes: [
          {
            id: 'upload',
            label: 'Presigned Upload',
            description: 'Audio goes straight to R2 through a presigned URL, so it never touches the serverless payload limit.',
            stackChips: ['Cloudflare R2', 'Next.js'],
            connections: ['pipeline'],
            position: { x: 10, y: 40 },
          },
          {
            id: 'pipeline',
            label: 'Job State Machine',
            description: 'Eight stages with lease tokens, per-stage timeouts, exponential retry and compare-and-swap transitions. Fencing tokens stop a stale worker overwriting a newer attempt.',
            stackChips: ['Drizzle', 'Neon', 'HMAC webhooks'],
            connections: ['workers', 'gate'],
            position: { x: 38, y: 58 },
          },
          {
            id: 'workers',
            label: 'Four GPU Services',
            description: 'Generation, two-pass separation, structure analysis and render, each deployed and scaled independently on Modal.',
            stackChips: ['ACE-Step', 'BS-RoFormer', 'UVR-MDXNET'],
            connections: ['editor'],
            position: { x: 64, y: 34 },
          },
          {
            id: 'gate',
            label: 'Provenance Gate',
            description: 'Export resolves a track’s full lineage across two independent signal paths. Anything unresolvable blocks; generated exports still need an AcoustID fingerprint check.',
            stackChips: ['AcoustID', 'fail-closed'],
            connections: [],
            position: { x: 62, y: 82 },
          },
          {
            id: 'editor',
            label: 'Section × Stem Editor',
            description: 'Regenerate one stem inside one arrangement section, repaint a dragged waveform region, retune project BPM and key. Camelot-wheel distance keeps substitutions harmonically valid.',
            stackChips: ['wavesurfer.js', 'Zustand', 'TanStack Query'],
            connections: [],
            position: { x: 88, y: 58 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Solo build', value: 24, display: '24 days' },
          { label: 'Commits', value: 307, display: '307' },
          { label: 'Separation time', value: 23.4, display: '23.4s', unit: 's' },
        ],
        caveat:
          'Separation went 70s to 23.4s on a 4-minute track after root-causing a missing libcublasLt.so.13 that had onnxruntime silently on CPU while the GPU idled. Re-verified on T4 and L4 separately, because the bug was an unchecked assumption.',
        milestones: [
          { label: 'Generation, separation, analysis and editor', status: 'complete', detail: 'shipped' },
          { label: 'Production domain and production auth', status: 'complete', detail: 'www.beatmind.tech' },
          { label: 'Fail-closed export gate with fingerprinting', status: 'complete', detail: 'AcoustID' },
          { label: 'Closed pilot, 5–10 invited users', status: 'active', detail: 'at the gate' },
        ],
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show the durable job pipeline and the provenance gate as the real engineering.' },
          { side: 'will', text: 'State that the closed pilot has not run yet, and that usage so far is zero.' },
          { side: 'will', text: 'Describe the two invisible production failures and how they were found.' },
          { side: 'refuses', text: 'Let a track be exported when its lineage cannot be fully resolved.' },
          { side: 'refuses', text: 'Claim the models are mine — ACE-Step, BS-RoFormer and UVR-MDXNET are open source.' },
          { side: 'refuses', text: 'Expose company-private endpoints, keys, or pilot user data.' },
        ],
      },
    },
  },
  {
    id: 'secondself',
    name: 'SecondSelf',
    tagline: 'Personal AI career OS with evidence-gated application workflows.',
    status: 'active',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'flagship',
    started: '2026-04',
    stack: [
      'RAG',
      'Qdrant',
      'PostgreSQL',
      'FastAPI',
      'Streamlit',
      'GPT-4o-mini',
      'n8n',
      'Telegram',
      'Playwright',
    ],
    links: {},
    panels: {
      problem: {
        quote: 'A career system should know the evidence before it writes the claim.',
        brokenFlowId: 'career-evidence-drift',
      },
      architecture: {
        summary: 'A personal KB, retrieval layer, generation gates, document outputs, and a supervised application pipeline.',
        nodes: [
          {
            id: 'kb',
            label: 'Career KB',
            description: 'Structured identity, resume, project, preference, and application evidence.',
            stackChips: ['Qdrant', 'PostgreSQL'],
            connections: ['retrieval'],
            position: { x: 12, y: 44 },
          },
          {
            id: 'retrieval',
            label: 'Evidence Retrieval',
            description: 'Retrieves grounded facts before resume, answer, or cover-letter generation.',
            stackChips: ['RAG', 'GPT-4o-mini'],
            connections: ['quality'],
            position: { x: 36, y: 28 },
          },
          {
            id: 'quality',
            label: 'Quality Gates',
            description: 'JD matching, ATS checks, and review-ready scoring keep generated outputs bounded.',
            stackChips: ['ATS', 'Eval'],
            connections: ['workflow'],
            position: { x: 62, y: 46 },
          },
          {
            id: 'workflow',
            label: 'Application Control',
            description: 'Scrapers, Telegram review, and assisted apply flows keep user approval in the loop.',
            stackChips: ['n8n', 'Telegram', 'Playwright'],
            connections: [],
            position: { x: 84, y: 32 },
          },
        ],
      },
      proof: {
        milestones: [
          { label: 'V1 career RAG and document generation', status: 'complete', detail: 'shipped' },
          { label: 'Quality recovery and RAGAS-style evaluation', status: 'complete', detail: '0.9753 faithfulness' },
          { label: 'Autonomous discovery with human-gated apply', status: 'active', detail: 'v2' },
          { label: 'Broader job pipeline hardening', status: 'roadmap', detail: 'ongoing' },
        ],
        caveat: 'Does not claim unrestricted autonomous job submission.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Generate resumes and answers from grounded personal evidence.' },
          { side: 'will', text: 'Score JD alignment and surface review-ready outputs.' },
          { side: 'will', text: 'Use Telegram control patterns for supervised application flow.' },
          { side: 'refuses', text: 'Bypass CAPTCHA or submit without human approval.' },
          { side: 'refuses', text: 'Expose private VPS, keys, cookies, or job-account data.' },
        ],
      },
    },
    sliderResponse: { sliderId: 'automationVsControl', affects: 'both' },
  },
  {
    id: 'stick-and-dot',
    name: 'Stick and Dot',
    tagline: 'AI/ML Development Intern: Vivid storyboard AI + editorial platform.',
    status: 'complete',
    nodeKind: 'work-experience',
    origin: 'work',
    weight: 'flagship',
    started: '2026-03',
    stack: [
      'FLUX.1-dev',
      'PuLID',
      'LoRA',
      'CLIP scoring',
      'Groq',
      'FastAPI',
      'React',
      'Vite',
      'RunPod',
      'Next.js',
      'Supabase',
      'RLS',
    ],
    // Vivid is the live surface of this work node. Verified 2026-08-13: HTTP 200,
    // publicly reachable with no auth, and resolved from the Vercel project's own
    // `domains` array rather than guessed. `vivid.vercel.app` is a different
    // owner's site and must never be linked here (CLAUDE.md).
    // The Stick and Dot App deployment is excluded by the owner and stays out.
    images: [
      {
        src: '/media/stick-and-dot-desktop.jpg',
        alt: 'Vivid\'s Storyboard console: a scene description field, generate and plan controls, '
          + 'a seed input, scene type and fast-mode toggles, and a grid of named style presets, '
          + 'beside an empty four-frame board reading "ready to render".',
        caption: 'Vivid\'s generation console before a render, captured 2026-08-18. No generation '
          + 'was triggered — running one costs real compute on a live product.',
      },
      {
        src: '/media/stick-and-dot-mobile.jpg',
        alt: 'The Vivid console on a phone-width screen.',
        caption: 'The same console at 390px.',
      },
    ],
    video: {
      src: '/media/stick-and-dot.webm',
      poster: '/media/stick-and-dot-desktop.jpg',
      description: 'A silent pass over the Vivid storyboard console, captured from the live app.',
    },
    links: {
      liveUI: 'https://vivid-alpha.vercel.app',
    },
    panels: {
      problem: {
        quote: 'A work node should show shipped evidence, not just a title.',
        brokenFlowId: 'storyboard-identity-drift',
      },
      architecture: {
        summary: 'An internship evidence node containing the Vivid storyboard pipeline and Stick and Dot editorial platform.',
        nodes: [
          {
            id: 'role',
            label: 'AI/ML Intern',
            description: 'Remote internship work spanning creative AI workflows and product-platform delivery.',
            stackChips: ['AI/ML', 'Product'],
            connections: ['vivid'],
            position: { x: 12, y: 34 },
          },
          {
            id: 'vivid',
            label: 'Vivid Storyboard AI',
            description: 'Plans and generates 4-shot cinematic storyboards with identity and style controls.',
            stackChips: ['FLUX.1-dev', 'PuLID', 'LoRA'],
            connections: ['platform'],
            position: { x: 36, y: 54 },
          },
          {
            id: 'platform',
            label: 'Editorial Platform',
            description: 'Role-based app for writer, reader, subject expert, and business/client workflows.',
            stackChips: ['Next.js', 'Supabase', 'RLS'],
            connections: ['deployment'],
            position: { x: 62, y: 32 },
          },
          {
            id: 'deployment',
            label: 'Deployment Evidence',
            description: 'GPU economics, beta usage, and shipped platform scope stay tied to public-safe proof.',
            stackChips: ['RunPod', 'GPU cost', 'Beta'],
            connections: [],
            position: { x: 86, y: 52 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Storyboard shots', value: 4, display: '4-shot' },
          { label: 'Beta users', value: 10, display: '10+' },
          { label: 'App build window', value: 3, display: '3 weeks' },
        ],
        radialMetricId: 'vivid-cost',
        caveat: 'Work evidence is public-safe and does not claim ownership of company strategy.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show the internship role through shipped AI and product artifacts.' },
          { side: 'will', text: 'Use Vivid as the featured creative AI evidence inside this work node.' },
          { side: 'will', text: 'Represent the Stick and Dot App as role-based platform evidence.' },
          { side: 'refuses', text: 'Claim foundation-model training from scratch.' },
          { side: 'refuses', text: 'Expose company-private data, API URLs, keys, or deployment secrets.' },
        ],
      },
    },
    artifacts: [
      {
        id: 'vivid',
        name: 'Vivid',
        label: 'Featured creative AI artifact',
        url: 'https://vivid-alpha.vercel.app',
        summary: 'Cinematic storyboard AI using Groq planning, FLUX.1-dev, PuLID, LoRA routing, CLIP scoring, color grading, and PDF export.',
        stack: ['Groq', 'FLUX.1-dev', 'PuLID', 'LoRA', 'CLIP scoring', 'FastAPI', 'React', 'RunPod'],
        proof: ['4-shot storyboard pipeline', '10+ beta users', 'Cost-aware RunPod deployment path'],
        boundary: ['Identity consistency is tuned and measured, not claimed perfect', 'No private endpoints, tokens, or company secrets'],
      },
      {
        id: 'stick-and-dot-app',
        name: 'Stick and Dot App',
        label: 'Product platform artifact',
        summary: 'Role-based editorial and commission platform for writer, reader, subject expert, and business/client flows.',
        stack: ['Next.js', 'Supabase Auth', 'Supabase Postgres', 'RLS', 'Supabase Storage'],
        proof: ['Full company web platform built in 3 weeks', 'Role dashboards and commission marketplace workflows'],
        boundary: ['Publicly show product architecture only', 'Do not expose private company workflow data'],
      },
    ],
    sliderResponse: { sliderId: 'costPerQuery', affects: 'both' },
  },
  {
    id: 'querypilot',
    name: 'QueryPilot',
    tagline: 'Self-correcting Text-to-SQL API with schema retrieval and critic gates.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'major',
    started: '2026-02',
    stack: [
      'FastAPI',
      'LangGraph',
      'ChromaDB',
      'PostgreSQL',
      'SQLAlchemy',
      'Groq',
      'OpenAI API',
      'SentenceTransformers',
      'sqlparse',
    ],
    images: [
      {
        src: '/media/querypilot-desktop.jpg',
        alt: 'QueryPilot\'s OpenAPI 3.1 documentation, describing a POST /query and GET /health '
          + 'endpoint and typed QueryRequest, QueryResponse, ValidationError and HTTPValidationError schemas.',
        caption: 'The served API contract, captured 2026-08-18. There is no UI to show — the '
          + 'evidence for this one is the typed surface itself. The endpoint is a free-tier '
          + 'instance and takes 30-60s to wake.',
      },
      {
        src: '/media/querypilot-mobile.jpg',
        alt: 'The same QueryPilot API documentation on a phone-width screen.',
        caption: 'The same documentation at 390px.',
      },
    ],
    links: {
      github: 'https://github.com/parthtiwari-dev/querypilot',
      liveAPI: 'https://querypilot-backend.onrender.com',
      apiDocs: 'https://querypilot-backend.onrender.com/docs',
    },
    panels: {
      problem: {
        quote: 'A SQL agent should fail inside a critic, not inside production data.',
        brokenFlowId: 'sql-hallucination',
      },
      architecture: {
        summary: 'Schema retrieval, constrained generation, critic validation, execution, and classified correction.',
        nodes: [
          {
            id: 'schema',
            label: 'Schema Linker',
            description: 'Retrieves 2-4 relevant tables and expands foreign keys.',
            stackChips: ['ChromaDB', 'Embeddings'],
            connections: ['generator'],
            position: { x: 12, y: 36 },
          },
          {
            id: 'generator',
            label: 'SQL Generator',
            description: 'Generates SQL constrained to allowed tables.',
            stackChips: ['Groq', 'OpenAI API'],
            connections: ['critic'],
            position: { x: 38, y: 24 },
          },
          {
            id: 'critic',
            label: 'Critic',
            description: 'Checks syntax, schema references, safety blocklists, and semantic confidence.',
            stackChips: ['sqlparse', 'Regex'],
            connections: ['executor', 'corrector'],
            position: { x: 62, y: 48 },
          },
          {
            id: 'executor',
            label: 'Executor',
            description: 'Runs safe SQL with pooling, limit, and timeout controls.',
            stackChips: ['PostgreSQL', 'SQLAlchemy'],
            connections: [],
            position: { x: 86, y: 28 },
          },
          {
            id: 'corrector',
            label: 'Corrector',
            description: 'Repairs column errors with regex/fuzzy logic before LLM correction.',
            stackChips: ['LangGraph'],
            connections: ['critic'],
            position: { x: 60, y: 76 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Final success', value: 95.7, display: '95.7%', unit: '%' },
          { label: 'Correction lift', value: 5.7, display: '+5.7pp' },
          { label: 'SQL hallucination', value: 0, display: '0%', unit: '%' },
        ],
        radialMetricId: 'querypilot-success',
        caveat: 'Evaluation measures execution success, not full semantic correctness.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Retrieve schema context before SQL generation.' },
          { side: 'will', text: 'Block unsafe or impossible queries before execution.' },
          { side: 'will', text: 'Classify failures and self-correct bounded SQL attempts.' },
          { side: 'refuses', text: 'Claim perfect hallucination-free SQL semantics.' },
          { side: 'refuses', text: 'Oversell keyword-based adversarial safety.' },
        ],
      },
    },
    sliderResponse: { sliderId: 'latencyBudget', affects: 'both' },
  },
  {
    id: 'upi-fraud',
    name: 'UPI Fraud Engine',
    tagline: 'Real-time fraud scoring under alert-budget and latency constraints.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'major',
    started: '2026-01',
    stack: [
      'XGBoost',
      'DuckDB',
      'FastAPI',
      'Great Expectations',
      'Backtesting',
      'Leakage testing',
      'SHAP',
      'Python',
    ],
    links: {
      github: 'https://github.com/parthtiwari-dev/upi-fraud-engine',
    },
    panels: {
      problem: {
        quote: 'A fraud model is only useful if time, leakage, alerts, and latency stay honest.',
        brokenFlowId: 'fraud-leakage',
      },
      architecture: {
        summary: 'Synthetic UPI transformation, point-in-time features, leakage tests, dynamic thresholds, API scoring, and replay backtests.',
        nodes: [
          {
            id: 'transactions',
            label: 'UPI Transactions',
            description: 'Synthetic UPI data generated from IEEE-CIS/Kaggle fraud data.',
            stackChips: ['Python'],
            connections: ['features'],
            position: { x: 12, y: 34 },
          },
          {
            id: 'features',
            label: 'Point-in-time Features',
            description: 'Velocity and graph features with leakage-safe temporal windows.',
            stackChips: ['DuckDB'],
            connections: ['model', 'validation'],
            position: { x: 36, y: 54 },
          },
          {
            id: 'model',
            label: 'Risk Model',
            description: 'XGBoost selected over a two-stage experiment to reduce complexity.',
            stackChips: ['XGBoost'],
            connections: ['threshold'],
            position: { x: 62, y: 30 },
          },
          {
            id: 'validation',
            label: 'Validation Layer',
            description: 'Great Expectations and leakage tests caught target leakage before serving.',
            stackChips: ['Great Expectations'],
            connections: ['threshold'],
            position: { x: 58, y: 74 },
          },
          {
            id: 'threshold',
            label: 'Alert Budget',
            description: 'Dynamic thresholding keeps precision high under a fixed alert budget.',
            stackChips: ['FastAPI', 'Backtesting'],
            connections: [],
            position: { x: 84, y: 48 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Precision at 0.5% budget', value: 92.06, display: '92.06%', unit: '%' },
          { label: 'p95 latency', value: 386, display: '~386ms', unit: 'ms' },
          { label: 'Leakage tests', value: 55, display: '55+' },
        ],
        radialMetricId: 'upi-precision',
        caveat: 'Synthetic UPI data and in-memory online state are disclosed limitations.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Score fraud with point-in-time features and alert-budget controls.' },
          { side: 'will', text: 'Report precision, recall, latency, leakage, and replay backtests.' },
          { side: 'will', text: 'Disclose cold-start risk from in-memory online features.' },
          { side: 'refuses', text: 'Claim real bank or production UPI data.' },
          { side: 'refuses', text: 'Frame recall as high when the design optimizes precision.' },
        ],
      },
    },
    sliderResponse: { sliderId: 'alertBudget', affects: 'both' },
  },
  {
    id: 'medrag',
    name: 'MedRAG',
    tagline: 'Evidence-bound medical RAG with citations and refusal behavior.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'major',
    started: '2026-01',
    stack: [
      'RAG',
      'ChromaDB',
      'BM25',
      'SentenceTransformers',
      'FastAPI',
      'Streamlit',
      'RAGAS eval',
      'Groq',
      'OpenAI API',
      'LlamaParse',
    ],
    links: {
      github: 'https://github.com/parthtiwari-dev/Evidence-Bound-Drug-RAG',
    },
    panels: {
      problem: {
        quote: 'In medical retrieval, a refusal can be the safest correct answer.',
        brokenFlowId: 'medical-unsupported-answer',
      },
      architecture: {
        summary: 'FDA/NICE documents are parsed, chunked, retrieved, cited, evaluated, and refused when evidence is insufficient.',
        nodes: [
          {
            id: 'corpus',
            label: 'FDA/NICE Corpus',
            description: '20 PDFs, 716 pages, and 853 semantic chunks across 8 drugs.',
            stackChips: ['LlamaParse'],
            connections: ['retrieval'],
            position: { x: 12, y: 40 },
          },
          {
            id: 'retrieval',
            label: 'Vector Retrieval',
            description: 'Vector-only production retrieval after hybrid experiments added contamination.',
            stackChips: ['ChromaDB', 'SentenceTransformers'],
            connections: ['policy'],
            position: { x: 38, y: 26 },
          },
          {
            id: 'policy',
            label: 'Refusal Policy',
            description: 'Runtime policy refuses insufficient evidence or medical advice beyond scope.',
            stackChips: ['FastAPI'],
            connections: ['answer'],
            position: { x: 62, y: 52 },
          },
          {
            id: 'answer',
            label: 'Cited Answer',
            description: 'Groq/OpenAI generation with citations and JSONL logging.',
            stackChips: ['Groq', 'RAGAS eval'],
            connections: [],
            position: { x: 86, y: 34 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Answered faithfulness', value: 0.99, display: '~0.99' },
          { label: 'Refusal accuracy', value: 100, display: '100%', unit: '%' },
          { label: 'Eval cost', value: 0.168, display: '$0.168', unit: '$' },
        ],
        radialMetricId: 'medrag-refusal',
        caveat: 'Not medical advice or clinically validated.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Answer only when source documents support the response.' },
          { side: 'will', text: 'Cite FDA/NICE evidence and log retrieval behavior.' },
          { side: 'will', text: 'Refuse when evidence is insufficient or advice is out of scope.' },
          { side: 'refuses', text: 'Claim clinical validation or medical-grade advice.' },
          { side: 'refuses', text: 'Hide weaker interaction and mechanism-query behavior.' },
        ],
      },
    },
    sliderResponse: { sliderId: 'evidenceStrictness', affects: 'both' },
  },
  {
    id: 'support-core',
    name: 'Spur Chat',
    tagline: 'Streaming AI support agent for a D2C brand, built to a company brief.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'minor',
    started: '2026-06',
    stack: [
      'React',
      'Vite',
      'TypeScript',
      'Node',
      'Express',
      'PostgreSQL',
      'Supabase',
      'GPT-4o-mini',
      'SSE',
    ],
    outcome:
      'Built to a real company brief as a take-home. A shopper asks about an order, a return or a product, and gets a streamed answer with the conversation persisted across reloads.',
    // Verified 2026-08-17: serves the real app ("Lumio Support Chat") over HTTPS
    // with no auth wall. The Render backend is deliberately not linked — a bare
    // API root is not a demo, and Render free instances cold-start.
    /**
     * Greeting state only, and that is the honest capture.
     *
     * The interaction was driven — the question is really sent — but the answer
     * never arrives: the frontend POSTs to `support-core.onrender.com`, which
     * returned nothing in 200s on 2026-08-18, on three separate paths. That is
     * not a free-tier cold start, which resolves in 30-60s. **The backend is
     * down**, so the linked demo accepts a question and sits on "Lumi is
     * typing…" indefinitely.
     *
     * No video for this one: a recording would document a hang. Re-capture with
     * `scripts/capture-demos.mjs` once the API answers — the interaction hook is
     * still in the script, commented with why it is disabled.
     */
    images: [
      {
        src: '/media/support-core-desktop.jpg',
        alt: 'The Lumio Support chat widget: a greeting from "Lumi, Lumio\'s support assistant" '
          + 'and four suggested questions about returns, international shipping, warranty claims '
          + 'and discounts, above a message input.',
        caption: 'The entry state, captured 2026-08-18.',
      },
      {
        src: '/media/support-core-mobile.jpg',
        alt: 'The same Lumio Support chat widget on a phone-width screen.',
        caption: 'The same widget at 390px.',
      },
    ],
    links: {
      github: 'https://github.com/parthtiwari-dev/support-core',
      liveUI: 'https://support-core-nine.vercel.app',
    },
    panels: {
      problem: {
        quote: 'A support bot that answers confidently from nothing is worse than no bot.',
        brokenFlowId: 'support-workflow-llm-authority',
      },
      architecture: {
        summary:
          'A typed React client over an Express API that streams tokens as they arrive and persists the thread, so a reload does not lose the conversation.',
        nodes: [
          {
            id: 'client',
            label: 'Chat Client',
            description: 'React + Vite + TypeScript. Renders tokens as they stream rather than waiting for a complete reply.',
            stackChips: ['React', 'Vite', 'TypeScript'],
            connections: ['api'],
            position: { x: 14, y: 46 },
          },
          {
            id: 'api',
            label: 'Streaming API',
            description: 'Express over server-sent events. The model call is one hop from the client with no queue in between, because a support reply that takes a round trip through a job system feels broken.',
            stackChips: ['Node', 'Express', 'SSE'],
            connections: ['model', 'store'],
            position: { x: 48, y: 60 },
          },
          {
            id: 'model',
            label: 'GPT-4o-mini',
            description: 'Scoped to the brand’s own catalogue and policies. Chosen for cost and latency — a support turn is short and high-volume, which is the wrong place for a frontier model.',
            stackChips: ['OpenAI'],
            connections: [],
            position: { x: 80, y: 38 },
          },
          {
            id: 'store',
            label: 'Session Store',
            description: 'Threads start in localStorage and are promoted to Postgres, so history survives a reload without forcing a signup before the first message.',
            stackChips: ['PostgreSQL', 'Supabase'],
            connections: [],
            position: { x: 76, y: 80 },
          },
        ],
      },
      proof: {
        milestones: [
          { label: 'Streaming chat end to end', status: 'complete', detail: 'SSE' },
          { label: 'Thread persistence across reloads', status: 'complete', detail: 'localStorage → Postgres' },
          { label: 'Deployed frontend, backend and database', status: 'complete', detail: 'Vercel + Render + Supabase' },
        ],
        caveat:
          'Built as a take-home against a company brief, for a fictional brand. Small by design — it is evidence of scoping and shipping to someone else’s spec, not of scale.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show that a brief from a real company was scoped and shipped end to end.' },
          { side: 'will', text: 'State plainly that the brand is fictional and the build is small.' },
          { side: 'refuses', text: 'Claim production traffic or real customers — it has neither.' },
          { side: 'refuses', text: 'Link the bare API root and call it a demo.' },
        ],
      },
    },
  },
  {
    id: 'tathya',
    name: 'Tathya',
    tagline: 'An autonomous record of India’s Union Government. No topic chosen by hand.',
    status: 'in-progress',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'major',
    started: '2026-07',
    stack: [
      'Python',
      'FastAPI',
      'Next.js',
      'Supabase',
      'PostgreSQL',
      'Gemini',
      'clustering',
      'Render',
      'Vercel',
    ],
    outcome:
      'Watches configured public sources continuously and clusters what it finds into sourced case files showing what government, media and citizens each said. It issues no verdict — the reader decides.',
    // Verified 2026-08-17: live and actively ingesting, with topics dated this
    // month. The Render API is intentionally not linked — free tier, sleeps after
    // 15 minutes, 30-60s cold start. A link that might take a minute to answer is
    // not evidence.
    images: [
      {
        src: '/media/tathya-desktop.jpg',
        alt: 'Tathya\'s feed, "The Record": automatically clustered topics, each showing a live '
          + 'badge, an actor, an age, a sourced summary, and a source breakdown counting official, '
          + 'media and citizen sources.',
        caption: 'The live feed, captured 2026-08-18, with topics dated eleven days earlier. '
          + 'The header states the rule the system runs on: no topic on the feed was chosen by hand.',
      },
      {
        src: '/media/tathya-mobile.jpg',
        alt: 'The same Tathya feed on a phone-width screen.',
        caption: 'The same feed at 390px.',
      },
    ],
    video: {
      src: '/media/tathya.webm',
      poster: '/media/tathya-desktop.jpg',
      description: 'A silent scroll through Tathya\'s live case-file feed, captured from the running system.',
    },
    links: {
      github: 'https://github.com/parthtiwari-dev/tathya',
      liveUI: 'https://tathya-1.vercel.app',
    },
    panels: {
      problem: {
        quote: 'Every tracker of government is somebody choosing what counts.',
        brokenFlowId: 'tathya-atlas-source-boundary',
      },
      architecture: {
        summary:
          'A five-stage pipeline from ingestion to persistence, fronted by a typed API. The editorial decision is removed by construction: sources are configured once, and nothing downstream picks topics.',
        nodes: [
          {
            id: 'ingest',
            label: 'Continuous Ingestion',
            description: 'Configured public sources — government releases, media, citizen signal — watched on a schedule rather than sampled when someone remembers.',
            stackChips: ['Python'],
            connections: ['snapshot'],
            position: { x: 8, y: 50 },
          },
          {
            id: 'snapshot',
            label: 'Snapshotting',
            description: 'What a source said at a point in time is stored, so a later edit or deletion does not quietly rewrite the record.',
            stackChips: ['Supabase', 'PostgreSQL'],
            connections: ['cluster'],
            position: { x: 30, y: 72 },
          },
          {
            id: 'cluster',
            label: 'Clustering',
            description: 'Related signal across sources collapses into one topic. This is the step that replaces an editor, and it is where the system is most fallible.',
            stackChips: ['clustering'],
            connections: ['generate'],
            position: { x: 54, y: 44 },
          },
          {
            id: 'generate',
            label: 'Case File Generation',
            description: 'A deterministic extractive builder assembles the case file. A Gemini-grounded path exists for narrative titles and summaries but is not yet the default in the deployed persist step.',
            stackChips: ['Gemini', 'extractive'],
            connections: ['api'],
            position: { x: 76, y: 70 },
          },
          {
            id: 'api',
            label: 'API v1 + Reader',
            description: 'FastAPI typed against the frontend’s own type definitions, with a Next.js reader wired to the real API — no mock data anywhere in the deployed path.',
            stackChips: ['FastAPI', 'Next.js', 'Vercel'],
            connections: [],
            position: { x: 92, y: 34 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Pipeline stages', value: 5, display: '5' },
          { label: 'Commits', value: 62, display: '62' },
        ],
        milestones: [
          { label: 'Ingestion, snapshotting, clustering, persistence', status: 'complete', detail: 'deployed' },
          { label: 'API v1 typed against the frontend', status: 'complete', detail: 'FastAPI' },
          { label: 'Reader wired to the real API, no mock data', status: 'complete', detail: 'Next.js' },
          { label: 'Gemini-grounded generation as the default path', status: 'active', detail: 'extractive for now' },
          { label: 'Manual audit gate', status: 'roadmap', detail: 'not yet run' },
        ],
        caveat:
          'Live topics currently show cluster titles and templated summaries, not final generated case files — the deployed persist step still calls the deterministic extractive builder. The repo’s own docs track this rather than the README, which lags.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show what each source actually said, with attribution, and let the reader decide.' },
          { side: 'will', text: 'State that clustering is the fallible step, because it is the one replacing an editor.' },
          { side: 'will', text: 'Say plainly that the Gemini-grounded path is built but not yet the deployed default.' },
          { side: 'refuses', text: 'Issue a verdict, a rating, or a partisan framing of any topic.' },
          { side: 'refuses', text: 'Choose topics by hand — the moment it does, it is a publication, not a record.' },
          { side: 'refuses', text: 'Link the Render API as a demo while it cold-starts for a minute on the free tier.' },
        ],
      },
    },
  },
  {
    id: 'oncoverse',
    name: 'OncoVerse',
    tagline: 'In-progress 3D cancer education atlas with source-backed boundaries.',
    status: 'in-progress',
    nodeKind: 'current-build',
    origin: 'personal',
    weight: 'major',
    started: '2026-05',
    stack: [
      'React 19',
      'Vite',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'Drei',
      'Tailwind CSS v4',
      'Framer Motion',
      'Zustand',
      'Lucide React',
    ],
    // Intentionally empty. OncoVerse has never successfully deployed to production
    // — its latest production deploy is in ERROR state and no URL resolves. An
    // empty links panel is the accurate result, not a gap to fill (PRD.md 10).
    links: {},
    panels: {
      problem: {
        quote: 'Cancer education should be explored with sources, not flattened into generic pages.',
        brokenFlowId: 'atlas-content-gap',
      },
      architecture: {
        summary: 'A typed cancer data model and interactive anatomy slice for source-backed, non-diagnostic learning.',
        nodes: [
          {
            id: 'data',
            label: 'Typed Cancer Data',
            description: 'MTC is the first complete entry; other cancer JSON files are stubs.',
            stackChips: ['TypeScript'],
            connections: ['scene'],
            position: { x: 14, y: 42 },
          },
          {
            id: 'scene',
            label: 'Anatomy Scene',
            description: 'Procedural 3D slice supports orbit, drag, zoom, hover, and selection.',
            stackChips: ['Three.js', 'R3F', 'Drei'],
            connections: ['sources'],
            position: { x: 42, y: 26 },
          },
          {
            id: 'sources',
            label: 'Source Boundary',
            description: 'NCI, NCBI/StatPearls, and NCBI/Endotext sources back the MTC content.',
            stackChips: ['Education'],
            connections: ['roadmap'],
            position: { x: 66, y: 54 },
          },
          {
            id: 'roadmap',
            label: 'Atlas Roadmap',
            description: 'Future slices include AI explainer, report explainer, simulator, and 20+ cancers.',
            stackChips: ['Roadmap'],
            connections: [],
            position: { x: 86, y: 34 },
          },
        ],
      },
      proof: {
        milestones: [
          { label: 'App shell and typed model', status: 'complete', detail: 'foundation' },
          { label: 'Medullary Thyroid Carcinoma data', status: 'complete', detail: 'MTC' },
          { label: 'Procedural anatomy interaction slice', status: 'active', detail: 'v0.1' },
          { label: 'AI explainer and report/PDF direction', status: 'roadmap', detail: 'v0.2+' },
        ],
        progressPercent: 20,
        caveat: 'Needs medical review and is non-diagnostic.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show source-backed cancer education content.' },
          { side: 'will', text: 'Expose anatomy structures and educational explanations.' },
          { side: 'will', text: 'State medical review status honestly.' },
          { side: 'refuses', text: 'Call the product diagnostic.' },
          { side: 'refuses', text: 'Claim full cancer coverage or medical review today.' },
        ],
      },
    },
  },
  {
    id: 'order-supervisor',
    name: 'Order Supervisor',
    tagline: 'Temporal order workflows where lifecycle authority stays outside the LLM.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'minor',
    started: '2026-05',
    stack: [
      'Temporal',
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'OpenAI API',
      'Groq',
      'Agent workflows',
      'Event logs',
    ],
    links: {},
    panels: {
      problem: {
        quote: 'Agents should sleep, wake, reason, act, and then give control back to the workflow.',
        brokenFlowId: 'workflow-llm-loop',
      },
      architecture: {
        summary: 'One Temporal workflow per order waits on signals and timers while LLM reasoning remains advisory.',
        nodes: [
          {
            id: 'workflow',
            label: 'Order Workflow',
            description: 'One durable Temporal workflow owns each order lifecycle.',
            stackChips: ['Temporal'],
            connections: ['signals'],
            position: { x: 14, y: 38 },
          },
          {
            id: 'signals',
            label: 'Signals And Timers',
            description: 'Order events, instructions, interrupt, resume, and terminate wake the workflow.',
            stackChips: ['Signals'],
            connections: ['reasoner'],
            position: { x: 38, y: 58 },
          },
          {
            id: 'reasoner',
            label: 'Advisory Reasoner',
            description: 'LLM recommendations are advisory and cannot own completion authority.',
            stackChips: ['OpenAI API', 'Groq'],
            connections: ['actions'],
            position: { x: 62, y: 32 },
          },
          {
            id: 'actions',
            label: 'Action Log',
            description: 'Events, actions, reasoning, and summaries are stored in one activity log.',
            stackChips: ['PostgreSQL', 'FastAPI'],
            connections: [],
            position: { x: 84, y: 50 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Workflow per order', value: 1, display: '1:1' },
          { label: 'Control signals', value: 5, display: '5' },
          { label: 'Polling loops', value: 0, display: '0' },
        ],
        radialMetricId: 'order-supervisor-workflow',
        caveat: 'Lifecycle completion is rule-owned, not LLM-owned.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Use durable workflows for long-running order state.' },
          { side: 'will', text: 'Wake on signals and timers instead of cron polling.' },
          { side: 'will', text: 'Let LLM reasoning advise business actions.' },
          { side: 'refuses', text: 'Give the LLM lifecycle authority.' },
          { side: 'refuses', text: 'Frame the system as a generic chatbot.' },
        ],
      },
    },
  },
  {
    id: 'fraud-risk-intel',
    name: 'Fraud Risk Intel',
    tagline: 'Earlier explainable fraud ML/API system with frozen preprocessing.',
    status: 'complete',
    nodeKind: 'personal-project',
    origin: 'personal',
    weight: 'minor',
    started: '2025-12',
    stack: [
      'XGBoost',
      'PyTorch',
      'Autoencoder',
      'Isolation Forest',
      'MLP',
      'SHAP',
      'FastAPI',
      'Streamlit',
      'Docker',
    ],
    links: {},
    panels: {
      problem: {
        quote: 'Fraud explainability breaks when training, inference, and SHAP do not share one contract.',
        brokenFlowId: 'fraud-contract-drift',
      },
      architecture: {
        summary: 'Frozen preprocessing aligns training, API inference, Streamlit UI, and SHAP explanations.',
        nodes: [
          {
            id: 'dataset',
            label: 'Credit Card Dataset',
            description: 'Standard 284,807-row credit-card fraud dataset with 0.17 percent fraud rate.',
            stackChips: ['Dataset'],
            connections: ['preprocess'],
            position: { x: 12, y: 42 },
          },
          {
            id: 'preprocess',
            label: 'Frozen Contract',
            description: 'One preprocessing path feeds training, serving, and explainability.',
            stackChips: ['Python'],
            connections: ['models'],
            position: { x: 36, y: 24 },
          },
          {
            id: 'models',
            label: 'Model Bench',
            description: 'XGBoost, autoencoder, Isolation Forest, MLP, and stacking were compared.',
            stackChips: ['XGBoost', 'PyTorch', 'SHAP'],
            connections: ['serving'],
            position: { x: 62, y: 54 },
          },
          {
            id: 'serving',
            label: 'Serving Surface',
            description: 'FastAPI, Streamlit, Docker, and SHAP expose predictions and explanations.',
            stackChips: ['FastAPI', 'Streamlit', 'Docker'],
            connections: [],
            position: { x: 86, y: 34 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'XGBoost PR-AUC', value: 0.85, display: '0.850' },
          { label: 'XGBoost ROC-AUC', value: 0.977, display: '0.977' },
          { label: 'Default precision', value: 0.952, display: '0.952' },
        ],
        radialMetricId: 'fris-pr-auc',
        caveat: 'Earlier project; UPI Fraud Engine is the stronger later system.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Show frozen preprocessing across model, API, and SHAP.' },
          { side: 'will', text: 'Present model comparison as growth evidence.' },
          { side: 'will', text: 'Use explainability as the core serving proof.' },
          { side: 'refuses', text: 'Over-position a standard dataset as novel data.' },
          { side: 'refuses', text: 'Claim it is newer or stronger than the UPI system.' },
        ],
      },
    },
  },
  {
    id: 'oracle-auto-provision',
    name: 'Oracle Auto Provision',
    tagline: 'Practical OCI Always Free automation with GitHub Actions and Telegram alerts.',
    status: 'experience',
    nodeKind: 'utility',
    origin: 'personal',
    weight: 'minor',
    started: '2026-05',
    stack: [
      'Python',
      'OCI SDK',
      'GitHub Actions',
      'Oracle Cloud',
      'Telegram',
      'Infrastructure automation',
    ],
    links: {},
    panels: {
      problem: {
        quote: 'When capacity is scarce, the useful system is the one that keeps trying safely.',
        brokenFlowId: 'infra-capacity-loop',
      },
      architecture: {
        summary: 'A scheduled GitHub Actions workflow attempts OCI A1 provisioning, guards duplicates, notifies Telegram, and disables after success.',
        nodes: [
          {
            id: 'scheduler',
            label: 'Scheduler',
            description: 'GitHub Actions runs the provisioning attempt every 5 minutes.',
            stackChips: ['GitHub Actions'],
            connections: ['guard'],
            position: { x: 14, y: 36 },
          },
          {
            id: 'guard',
            label: 'Existing Instance Guard',
            description: 'Checks whether an instance already exists before creating another.',
            stackChips: ['OCI SDK'],
            connections: ['provision'],
            position: { x: 40, y: 58 },
          },
          {
            id: 'provision',
            label: 'A1 Provision Attempt',
            description: 'Attempts Always Free A1 Flex capacity across availability domains.',
            stackChips: ['Oracle Cloud', 'Python'],
            connections: ['notify'],
            position: { x: 64, y: 32 },
          },
          {
            id: 'notify',
            label: 'Notify And Disable',
            description: 'Retrieves public IP, sends Telegram notification, and disables workflow after success.',
            stackChips: ['Telegram'],
            connections: [],
            position: { x: 86, y: 52 },
          },
        ],
      },
      proof: {
        metrics: [
          { label: 'Schedule cadence', value: 5, display: '5 min', unit: 'min' },
          { label: 'Duplicate guard', value: 1, display: '1 guard' },
          { label: 'Workflow disable', value: 1, display: 'auto-off' },
        ],
        radialMetricId: 'oracle-cadence',
        caveat: 'Small infra utility, not a flagship product.',
      },
      boundary: {
        items: [
          { side: 'will', text: 'Automate repeated OCI provisioning attempts safely.' },
          { side: 'will', text: 'Notify success through Telegram and stop after success.' },
          { side: 'will', text: 'Stay framed as a practical infrastructure utility.' },
          { side: 'refuses', text: 'Expose private keys, tenancy OCIDs, or Telegram tokens.' },
          { side: 'refuses', text: 'Make the utility look larger than it is.' },
        ],
      },
    },
  },
]
