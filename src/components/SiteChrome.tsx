import { Arrow } from './LandingSections'
import { isLoggedIn } from '../lib/auth'
import { Link } from 'react-router-dom'
import { ScrollLink } from './ScrollLink'

export function Header() {
     const bookingHref = '/auth'

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
                    <ScrollLink targetId='how-it-works'>How it works</ScrollLink>
                    <ScrollLink targetId='teachers'>Our teachers</ScrollLink>
                    <ScrollLink targetId='for-schools'>For schools</ScrollLink>
               </nav>
               {isLoggedIn() ? (
                    <ScrollLink className='nav-cta' targetId='book' style={{
                         background: '#245d50',
                         color: '#fffaf0',
                         fontFamily: 'Georgia, serif',
                         fontSize: '15px',
                         fontWeight: 600,
                         letterSpacing: '-0.2px',
                         padding: '12px 18px',
                         boxShadow: '0 8px 16px rgb(36 93 80 / 19%)',
                    }}>Book a mock <Arrow /></ScrollLink>
               ) : (
                    <Link className='nav-cta' to={bookingHref} style={{
                         background: '#245d50', color: '#fffaf0', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.2px', padding: '12px 18px', boxShadow: '0 8px 16px rgb(36 93 80 / 19%)',
                    }}>Book a mock <Arrow /></Link>
               )}
          </header>
     )
}

export function Footer() {
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
                    <span>&copy; 2026 iMock IELTS</span>
               </div>
          </footer>
     )
}
