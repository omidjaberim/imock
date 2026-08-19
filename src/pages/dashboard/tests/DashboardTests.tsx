import { Link, Navigate } from 'react-router-dom'
import { getCurrentUser } from '../../../lib/auth'
import './tests.css'

const skills = [['Speaking', 'Not started'], ['Writing', 'Not started'], ['Listening', 'Not started'], ['Reading', 'Not started']]

export default function DashboardTests() {
     const user = getCurrentUser()
     if (!user) return <Navigate to='/auth' replace />

     return <main className='tests-page'>
          <header className='tests-header'><Link to='/dashboard' className='dashboard-brand'><i>i</i>mock<span>.</span></Link><Link to='/dashboard' className='tests-back'>← Back to dashboard</Link></header>
          <section className='tests-content'>
               <p className='tests-kicker'>TESTS &amp; RESULTS</p>
               <h1>Your IELTS practice journey.</h1>
               <p className='tests-intro'>Track every practice exam and use your results to decide what to work on next.</p>
               <div className='results-summary'><div><span>0</span><small>tests completed</small></div><div><span>—</span><small>current overall band</small></div><div><span>0</span><small>hours practised</small></div></div>
               <section className='skill-results'><h2>Skill practice</h2>{skills.map(([skill, status]) => <div key={skill}><b>{skill}</b><span>{status}</span><Link to={`/dashboard/exams/${skill.toLowerCase()}`}>Start exam →</Link></div>)}</section>
          </section>
     </main>
}
