import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/config/site'

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
    value: CONTACT_EMAIL,
    href: CONTACT_EMAIL_HREF,
  },
  {
    kind: 'x',
    label: 'X',
    value: 'Parth___tiwari',
    href: 'https://x.com/Parth___tiwari',
  },
]
