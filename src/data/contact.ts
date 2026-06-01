export type ContactMethodKind = 'email' | 'github' | 'linkedin'

export interface ContactMethod {
  kind: ContactMethodKind
  label: string
  value: string
  href: string
  copyValue: string
  actionLabel: string
}

export const contactMethods: ContactMethod[] = [
  {
    kind: 'email',
    label: 'Email',
    value: 'parthti2003@gmail.com',
    href: 'mailto:parthti2003@gmail.com',
    copyValue: 'parthti2003@gmail.com',
    actionLabel: 'Compose',
  },
  {
    kind: 'github',
    label: 'GitHub',
    value: 'github.com/parthtiwari-dev',
    href: 'https://github.com/parthtiwari-dev',
    copyValue: 'https://github.com/parthtiwari-dev',
    actionLabel: 'Open',
  },
  {
    kind: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/parth-tiwar1',
    href: 'https://linkedin.com/in/parth-tiwar1',
    copyValue: 'https://linkedin.com/in/parth-tiwar1',
    actionLabel: 'Open',
  },
]
