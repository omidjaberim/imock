import { Arrow } from './LandingSections'
import { isLoggedIn } from '../lib/auth'
import { Link } from 'react-router-dom'
import { ScrollLink } from './ScrollLink'

export function Header() {
     const bookingHref = isLoggedIn() ? '/dashboard' : '/auth'

     return (
          <header className='topbar container'>
               <ScrollLink
                    className='brand'
                    targetId='top'
                    aria-label='iMock home'
               >
                    <span className='brand-mark'>i</span>mock
                    <span className='brand-dot'>.</span>
               </ScrollLink>
               <nav aria-label='Main navigation'>
                    <ScrollLink targetId='how-it-works'>
                         How it works
                    </ScrollLink>
                    <ScrollLink targetId='teachers'>Our teachers</ScrollLink>
                    <ScrollLink targetId='for-schools'>For schools</ScrollLink>
               </nav>
               <Link
                    className='nav-cta'
                    to={bookingHref}
                    style={{
                         background: '#245d50',
                         color: '#fffaf0',
                         fontFamily: 'Georgia, serif',
                         fontSize: '15px',
                         fontWeight: 600,
                         letterSpacing: '-0.2px',
                         padding: '12px 18px',
                         boxShadow: '0 8px 16px rgb(36 93 80 / 19%)',
                    }}
               >
                    Take a mock <Arrow />
               </Link>
          </header>
     )
}

export function Footer() {
     const socialLinks = [
          {
               label: 'Instagram',
               href: 'https://www.instagram.com/imock.ielts/',
               icon: 'instagram',
          },
          {
               label: 'Telegram',
               href: 'https://t.me/imock_ielts',
               icon: 'telegram',
          },
          {
               label: 'LinkedIn',
               href: 'https://www.linkedin.com/company/imock-ielts/',
               icon: 'linkedin',
          },
          {
               label: 'YouTube',
               href: 'https://www.youtube.com/@imockielts',
               icon: 'youtube',
          },
     ]

     return (
          <footer>
               <div className='container'>
                    <ScrollLink
                         className='brand'
                         targetId='top'
                    >
                         <span className='brand-mark'>i</span>mock
                         <span className='brand-dot'>.</span>
                    </ScrollLink>
                    <p>Practice with purpose. Progress with clarity.</p>
                    <nav
                         className='footer-socials'
                         aria-label='Social media'
                    >
                         {socialLinks.map(({ label, href, icon }) => (
                              <a
                                   key={label}
                                   href={href}
                                   target='_blank'
                                   rel='noreferrer'
                                   aria-label={`Follow iMock on ${label}`}
                              >
                                   <SocialIcon name={icon} />
                              </a>
                         ))}
                    </nav>
                    <span>&copy; 2026 iMock IELTS</span>
               </div>
          </footer>
     )
}

function SocialIcon({ name }: { name: string }) {
     const shared = {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
     }

     if (name === 'instagram')
          return (
               <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    {...shared}
               >
                    <rect
                         x='3.5'
                         y='3.5'
                         width='17'
                         height='17'
                         rx='5'
                    />
                    <circle
                         cx='12'
                         cy='12'
                         r='4'
                    />
                    <path d='M17.5 6.5h.01' />
               </svg>
          )
     if (name === 'telegram')
          return (
               <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    {...shared}
               >
                    <path d='m21 4-5.4 16-4.2-6-6-3.1L21 4Z' />
                    <path d='m11.4 14.1 3-3.1' />
               </svg>
          )
     if (name === 'linkedin')
          return (
               <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    {...shared}
               >
                    <path d='M6.5 10v8M6.5 6.5v.01M11 18v-4.5a3.5 3.5 0 0 1 7 0V18M11 10v8' />
               </svg>
          )
     return (
          <svg
               viewBox='0 0 24 24'
               aria-hidden='true'
               {...shared}
          >
               <rect
                    x='3'
                    y='6'
                    width='18'
                    height='12'
                    rx='3'
               />
               <path d='m10 10 5 2-5 2v-4Z' />
          </svg>
     )
}
