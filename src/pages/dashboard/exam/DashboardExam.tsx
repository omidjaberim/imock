import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import ReadingPage from './Reading'
import SpeakingPage from './Speaking'
import WritingPage from './Writing'
import ListeningPage from './Listening'
import CompletePage from './Complete'
import './exam.css'

const exams = {
     speaking: { title: 'Speaking', duration: '11–14 minutes', prompt: 'Describe a place you enjoy visiting. Explain why it is special to you.', options: ['Start recording', 'Review a sample answer'] },
     writing: { title: 'Writing', duration: '20 minutes', prompt: 'Some people believe technology makes learning more effective. To what extent do you agree?', options: ['I strongly agree', 'I partly agree', 'I disagree'] },
     listening: { title: 'Listening', duration: '30 minutes', prompt: 'Listen to the introduction and choose the best answer to continue.', options: ['Start audio', 'Read instructions first'] },
     reading: { title: 'Reading', duration: '60 minutes', prompt: 'Read the passage carefully, then choose the statement supported by the text.', options: ['Begin passage', 'View question guide'] },
     complete: { title: 'Complete IELTS', duration: '2 hours 45 minutes', prompt: 'Your complete IELTS mock includes Listening, Reading, Writing, and Speaking. Choose when you are ready to begin.', options: ['Start full mock exam', 'Review exam instructions'] },
} as const

type ExamKey = keyof typeof exams

export default function DashboardExam() {
     const { skill } = useParams()
     const [answer, setAnswer] = useState<string | null>(null)
     const [submitted, setSubmitted] = useState(false)

     if (!skill || !(skill in exams)) return <Navigate to='/dashboard' replace />

     const exam = exams[skill as ExamKey]

     // Delegate to dedicated page components
     if (skill === 'reading') return <ReadingPage />
     if (skill === 'speaking') return <SpeakingPage />
     if (skill === 'writing') return <WritingPage />
     if (skill === 'listening') return <ListeningPage />
     if (skill === 'complete') return <CompletePage />

     return (
          <main className='exam-page'>
               <DashboardHeader />
               <section className='exam-card'>
                    <p className='exam-kicker'>{exam.title} practice exam</p>
                    <div className='exam-meta'><span>Question 1 of 1</span><span>{exam.duration}</span></div>
                    <h1>{exam.title} warm-up</h1>
                    <p className='exam-prompt'>{exam.prompt}</p>
                    <div className='exam-options' aria-label='Answer options'>
                         {exam.options.map((option) => <button key={option} type='button' className={answer === option ? 'selected' : ''} onClick={() => { setAnswer(option); setSubmitted(false) }}>{option}</button>)}
                    </div>
                    <button className='exam-submit' type='button' disabled={!answer} onClick={() => setSubmitted(true)}>Submit answer →</button>
                    {submitted && <p className='exam-feedback'>Answer saved. Your next question will be ready soon.</p>}
               </section>
          </main>
     )
}
