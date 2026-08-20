import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import DashboardLanding from './pages/dashboard/landing/DashboardLanding'
import DashboardExam from './pages/dashboard/exam/DashboardExam'
import ClassroomSetup from './pages/dashboard/classroom/ClassroomSetup'
import EditSavedClass from './pages/dashboard/classroom/EditSavedClass'
import DashboardSettings from './pages/dashboard/settings/DashboardSettings'
import DashboardTests from './pages/dashboard/tests/DashboardTests'

function App() {
     const location = useLocation()
     useEffect(() => {
          const hashTarget = location.hash.slice(1)
          document.getElementById(hashTarget)?.scrollIntoView()
     }, [location.hash])

     return (
          <>
               <Routes>
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/dashboard' element={<DashboardLanding />} />
                    <Route path='/dashboard/exams/:skill' element={<DashboardExam />} />
                    <Route path='/dashboard/classrooms/new' element={<ClassroomSetup />} />
                    <Route path='/dashboard/classrooms/edit/:id' element={<EditSavedClass />} />
                    <Route path='/dashboard/settings' element={<DashboardSettings />} />
                    <Route path='/dashboard/tests' element={<DashboardTests />} />
                    <Route path='*' element={<div className='site-shell'><Header /><main id='top'><HeroSection /><ProcessSection /><ReportSection /><TeachersSection /><GroupAndBookingSections /></main><Footer /></div>} />
               </Routes>
               <ToastContainer
                    position='top-right'
                    autoClose={2600}
                    hideProgressBar={false}
                    pauseOnHover
                    closeOnClick={false}
                    theme='light'
                    toastClassName='toast-brand'
               />
          </>
     )
}

export default App
