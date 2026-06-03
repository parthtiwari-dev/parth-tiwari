export interface TrainingRecord {
  id: string
  institution: string
  location: string
  period: string
  program: string
  focus: string
  proofChips: string[]
  note: string
}

export const trainingRecords: TrainingRecord[] = [
  {
    id: 'great-learning',
    institution: 'Great Learning',
    location: 'Bangalore',
    period: 'Jul 2025 - Feb 2026',
    program: 'Post Graduate Program',
    focus: 'Data Science - GenAI',
    proofChips: ['specialization: GenAI', 'PGP certified'],
    note: 'Structured the GenAI, retrieval, evaluation, and applied data-science base behind the evidence systems.',
  },
  {
    id: 'ips-academy',
    institution: 'IPS Academy',
    location: 'Indore',
    period: '2021 - 2025',
    program: 'B.Tech Computer Science',
    focus: 'AI and ML',
    proofChips: ['CGPA: 6.4', 'work speaks louder'],
    note: 'The formal engineering base; the portfolio evidence carries the practical proof of range and execution.',
  },
]
