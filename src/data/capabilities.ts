export interface CapabilityGroup {
  id: string
  label: string
  summary: string
  skills: string[]
}

export const capabilityGroups: CapabilityGroup[] = [
  {
    id: 'genai-llms',
    label: 'GenAI + LLMs',
    summary: 'Grounded generation, agent control, retrieval quality, and refusal behavior.',
    skills: [
      'LangGraph',
      'LangChain',
      'RAG',
      'BM25',
      'RAGAS eval',
      'Multi-agent orchestration',
      'Prompt engineering',
      'Groq',
      'OpenAI API',
    ],
  },
  {
    id: 'diffusion-vision',
    label: 'Diffusion + Vision',
    summary: 'Identity-aware visual generation, scoring, and creative pipeline control.',
    skills: [
      'FLUX.1-dev',
      'PuLID',
      'LoRA',
      'img2img pipelines',
      'Diffusers',
      'PyTorch',
      'CLIP scoring',
    ],
  },
  {
    id: 'ml-engineering',
    label: 'ML Engineering',
    summary: 'Modeling under leakage, imbalance, explainability, and alert-budget constraints.',
    skills: [
      'XGBoost',
      'Isolation Forest',
      'Autoencoder',
      'SHAP',
      'Backtesting',
      'Leakage-safe features',
      'ROC-AUC',
      'Class imbalance',
    ],
  },
  {
    id: 'systems-infra',
    label: 'Systems + Infra',
    summary: 'APIs, storage, vector databases, workflows, automations, and deployable tooling.',
    skills: [
      'FastAPI',
      'Docker',
      'PostgreSQL',
      'Qdrant',
      'ChromaDB',
      'DuckDB',
      'SentenceTransformers',
      'Temporal',
      'n8n',
      'GitHub Actions',
      'Python',
      'SQL',
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interactive product surfaces, 3D scenes, evidence overlays, and app shells.',
    skills: [
      'Next.js',
      'React 19',
      'Vue 3',
      'TresJS',
      'Three.js',
      'React Three Fiber',
      'Tailwind CSS v4',
      'Supabase',
      'Streamlit',
    ],
  },
]

export function normalizeCapability(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}
