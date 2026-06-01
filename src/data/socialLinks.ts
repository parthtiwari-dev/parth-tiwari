export type SocialLinkKind = 'email' | 'github' | 'linkedin' | 'x'

export interface SocialLink {
  kind: SocialLinkKind
  label: string
  value: string
  href: string
  disabled?: boolean
}

export const socialLinks: SocialLink[] = [
  {
    kind: 'github',
    label: 'GitHub',
    value: 'parthtiwari-dev',
    href: 'https://github.com/parthtiwari-dev',
  },
  {
    kind: 'linkedin',
    label: 'LinkedIn',
    value: 'parth-tiwar1',
    href: 'https://linkedin.com/in/parth-tiwar1',
  },
  {
    kind: 'email',
    label: 'Email',
    value: 'parthti2003@gmail.com',
    href: 'mailto:parthti2003@gmail.com',
  },
  {
    kind: 'x',
    label: 'X',
    value: 'add handle',
    href: '',
    disabled: true,
  },
]
