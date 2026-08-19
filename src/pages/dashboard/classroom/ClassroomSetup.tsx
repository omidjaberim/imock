import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getCurrentUser } from '../../../lib/auth'
import './classroom.css'

export default function ClassroomSetup() {
     const user = getCurrentUser()
     const [created, setCreated] = useState(false)

     if (!user)
          return (
               <Navigate
                    to='/auth'
                    replace
               />
          )

     const createClassroom = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          setCreated(true)
     }

     return (
          <main className='classroom-page'>
               <header className='classroom-header'>
                    <Link
                         to='/dashboard'
                         className='dashboard-brand'
                    >
                         <i>i</i>mock<span>.</span>
                    </Link>
               </header>
               <section className='classroom-setup-card'>
                    <p className='classroom-kicker'>CLASSROOM SETUP</p>
                    <h1>Plan a shared mock exam.</h1>
                    <p>
                         Set up your class now, then invite learners when you
                         are ready.
                    </p>
                    {created ? (
                         <div className='classroom-success'>
                              <h2>Your classroom is ready.</h2>
                              <p>
                                   Share the private invite link with your
                                   learners and they can join before the
                                   scheduled exam.
                              </p>
                              <Link to='/dashboard'>Return to dashboard →</Link>
                         </div>
                    ) : (
                         <form onSubmit={createClassroom}>
                              <label>
                                   Classroom name
                                   <input
                                        name='name'
                                        required
                                        placeholder='e.g. Autumn IELTS cohort'
                                   />
                              </label>
                              <label>
                                   Number of learners
                                   <input
                                        name='learners'
                                        type='number'
                                        min='1'
                                        required
                                        placeholder='24'
                                   />
                              </label>
                              <label>
                                   Exam date and time
                                   <input
                                        name='schedule'
                                        type='datetime-local'
                                        required
                                   />
                              </label>
                              <div style={{ display: 'flex', gap: 10 }}>
                                   <button
                                        className='exam-submit'
                                        type='button'
                                   >
                                        Create Exam →
                                   </button>
                                   <Link
                                        to='/dashboard'
                                        className='exam-submit'
                                        style={{
                                             background: '#eee',
                                             color: '#17233d',
                                             textDecoration: 'none',
                                        }}
                                   >
                                        ← Quit exam
                                   </Link>
                              </div>
                         </form>
                    )}
               </section>
          </main>
     )
}
