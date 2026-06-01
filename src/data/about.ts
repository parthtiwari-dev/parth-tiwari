export interface AboutFact {
  label: string
  output: string[]
}

export const aboutSignal = {
  heading: "Hi, I'm Parth.",
  paragraphs: [
    'I build AI systems that are a little cinematic on the surface, but strict underneath. The part I care about most is not just making a model answer. It is making the system know what evidence it has, what it is allowed to do, and where it should stop.',
    'Most of my work sits around retrieval, agents, automation, diffusion, and workflow tools. I like building things that feel alive without becoming loose: systems with logs, gates, boundaries, and a real reason for every claim they make.',
    'This site is built like that too. The constellation is not decoration for me. Each node is a system I can explain through the problem, the architecture, the proof, and the boundary.',
  ],
  facts: [
    {
      label: 'Who I Am',
      output: ['Parth Tiwari, Bengaluru'],
    },
    {
      label: 'Currently',
      output: ['AI/ML Intern @ Stick and Dot'],
    },
    {
      label: 'Building',
      output: ['SecondSelf - evidence-bound career OS'],
    },
    {
      label: 'Interests',
      output: ['RAG - agents - diffusion - workflow systems - cinematic interfaces'],
    },
  ] satisfies AboutFact[],
}
