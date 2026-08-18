import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Footer, Header } from './components/SiteChrome'
import {
     GroupAndBookingSections,
     HeroSection,
     ProcessSection,
     ReportSection,
     TeachersSection,
} from './components/LandingSections'
import AuthPage from './pages/auth/AuthPage'

function App() {
     const location = useLocation()
     useEffect(() => {
          const hashTarget = location.hash.slice(1)
          document.getElementById(hashTarget)?.scrollIntoView()
     }, [location.hash])

     return (
          <Routes>
               <Route path='/auth' element={<AuthPage />} />
               <Route path='*' element={<div className='site-shell'><Header /><main id='top'><HeroSection /><ProcessSection /><ReportSection /><TeachersSection /><GroupAndBookingSections /></main><Footer /></div>} />
          </Routes>
     )
}

export default App
