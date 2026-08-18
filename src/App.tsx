import './App.css'
import { Footer, Header } from './components/SiteChrome'
import {
     GroupAndBookingSections,
     HeroSection,
     ProcessSection,
     ReportSection,
     TeachersSection,
} from './components/LandingSections'

function App() {
     return (
          <div className='site-shell'>
               <Header />
               <main id='top'>
                    <HeroSection />
                    <ProcessSection />
                    <ReportSection />
                    <TeachersSection />
                    <GroupAndBookingSections />
               </main>
               <Footer />
          </div>
     )
}

export default App
