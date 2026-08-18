import { Arrow } from './LandingSections'

export function Header() {
     return (
          <header className='topbar container'>
               <a
                    className='brand'
                    href='#top'
                    aria-label='iMock home'
               >
                    <span className='brand-mark'>i</span>mock
                    <span className='brand-dot'>.</span>
               </a>
               <nav aria-label='Main navigation'>
                    <a href='#how-it-works'>How it works</a>
                    <a href='#teachers'>Our teachers</a>
                    <a href='#for-schools'>For schools</a>
               </nav>
               <a
                    className='nav-cta'
                    href='#book'
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
                    Book a mock <Arrow />
               </a>
          </header>
     )
}

export function Footer() {
     return (
          <footer>
               <div className='container'>
                    <a
                         className='brand'
                         href='#top'
                    >
                         <span className='brand-mark'>i</span>mock
                         <span className='brand-dot'>.</span>
                    </a>
                    <p>Practice with purpose. Progress with clarity.</p>
                    <span>&copy; 2026 iMock IELTS</span>
               </div>
          </footer>
     )
}
