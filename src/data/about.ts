export interface AboutFact {
  label: string
  output: string[]
}

/**
 * The owner's photo (PLAN.md 1.5.8).
 *
 * Deliberately not a headshot against a backdrop. The buyer this site is written
 * for is hiring someone to build a thing, and a posed corporate portrait argues
 * for a category of person this work is not — the brief was creativity, not
 * professionalism. `alt` describes the frame, not the vibe, because a screen
 * reader user is owed the picture rather than an adjective.
 *
 * Two sizes so a phone does not download a 900px image to render it at 220.
 * Cropped to 4:5 from the original 3264x2448.
 */
export const aboutPortrait = {
  src: '/media/parth-portrait.jpg',
  srcSmall: '/media/parth-portrait-sm.jpg',
  width: 900,
  height: 1125,
  alt: 'Parth Tiwari standing in front of river rapids at golden hour, in a black '
    + 'tee, pale jeans, sunglasses and a cream cap, looking off to one side.',
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
