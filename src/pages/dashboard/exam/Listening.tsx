import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import './exam.css'

export default function ListeningPage() {
     const [started, setStarted] = useState(false)
     const [confirmModalOpen, setConfirmModalOpen] = useState(false)
     const [modalClosing, setModalClosing] = useState(false)
     const [infractions, setInfractions] = useState(0)
     const cancelBtnRef = React.useRef<HTMLButtonElement | null>(null)
     const lastActiveRef = React.useRef<HTMLElement | null>(null)

     React.useEffect(() => {
          if (!confirmModalOpen) return
          lastActiveRef.current = document.activeElement as HTMLElement | null
          const focusTimer = setTimeout(() => cancelBtnRef.current?.focus(), 80)
          const onKey = (e: KeyboardEvent) => {
               if (e.key === 'Escape' && !modalClosing) {
                    setModalClosing(true)
                    trackEvent('exam_instructions_cancel', {
                         target: '/dashboard/exams/listening',
                         infractions,
                    })
                    postInfraction('listening', infractions, {
                         reason: 'escape',
                    })
                    setTimeout(() => {
                         setConfirmModalOpen(false)
                         setModalClosing(false)
                         try {
                              lastActiveRef.current?.focus()
                         } catch {}
                    }, 320)
               }
          }
          document.addEventListener('keydown', onKey)
          return () => {
               clearTimeout(focusTimer)
               document.removeEventListener('keydown', onKey)
          }
     }, [confirmModalOpen, modalClosing, infractions])

     const openConfirm = () => {
          setInfractions(0)
          setConfirmModalOpen(true)
          trackEvent('exam_instructions_open', {
               target: '/dashboard/exams/listening',
               skill: 'Listening',
          })
     }

     return (
          <main className='exam-page'>
               <DashboardHeader />

               <section className='exam-card'>
                    <p className='exam-kicker'>Listening practice</p>
                    <div className='exam-meta'>
                         <span>Questions 1–40</span>
                         <span>30 minutes</span>
                    </div>
                    <h1>Listening warm-up</h1>

                    {!started ? (
                         <>
                              <p className='exam-prompt'>
                                   <ul className='reading-info-list'>
                                        <li>Total time: 30 minutes</li>
                                        <li>Number of sections: 4</li>
                                        <li>Total questions: 40</li>
                                        <li>
                                             Marks: 1 mark per question → 40
                                             marks
                                        </li>
                                        <li>
                                             You hear each recording only once.
                                        </li>
                                        <li>
                                             The recordings include different
                                             accents, including British,
                                             Australian, New Zealand, American,
                                             and Canadian.
                                        </li>
                                   </ul>
                              </p>

                              <div style={{ marginTop: 6, marginBottom: 12 }}>
                                   <table
                                        className='section-what-difficulty'
                                        aria-label='Listening sections and difficulty'
                                   >
                                        <thead>
                                             <tr>
                                                  <th>Section</th>
                                                  <th>What it contains</th>
                                                  <th>Difficulty</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             <tr>
                                                  <td>Part 1</td>
                                                  <td>
                                                       Conversation between 2
                                                       people in an everyday
                                                       situation
                                                  </td>
                                                  <td>🟢 Easy</td>
                                             </tr>
                                             <tr>
                                                  <td>Part 2</td>
                                                  <td>
                                                       One person speaking about
                                                       an everyday topic
                                                  </td>
                                                  <td>🟢 Easy–Medium</td>
                                             </tr>
                                             <tr>
                                                  <td>Part 3</td>
                                                  <td>
                                                       Conversation between 2–4
                                                       people, often academic
                                                  </td>
                                                  <td>🟠 Medium–Hard</td>
                                             </tr>
                                             <tr>
                                                  <td>Part 4</td>
                                                  <td>
                                                       One person giving an
                                                       academic lecture/talk
                                                  </td>
                                                  <td>🔴 Hard</td>
                                             </tr>
                                        </tbody>
                                   </table>
                              </div>

                              <div style={{ display: 'flex', gap: 10 }}>
                                   <button
                                        className='exam-submit'
                                        type='button'
                                        onClick={() => openConfirm()}
                                   >
                                        Start listening →
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

                              {confirmModalOpen && (
                                   <div
                                        className={`reading-confirm-modal ${modalClosing ? 'is-closing' : 'is-open'}`}
                                        role='dialog'
                                        aria-modal='true'
                                        style={{
                                             position: 'fixed',
                                             inset: 0,
                                             display: 'grid',
                                             placeItems: 'center',
                                             zIndex: 1200,
                                             background: 'rgba(11,17,26,0.6)',
                                             transition:
                                                  'background-color 220ms ease',
                                        }}
                                        onMouseDown={(e) => {
                                             if (e.target === e.currentTarget) {
                                                  setModalClosing(true)
                                                  trackEvent(
                                                       'exam_instructions_dismiss',
                                                       {
                                                            target: '/dashboard/exams/listening',
                                                            infractions,
                                                       },
                                                  )
                                                  postInfraction(
                                                       'listening',
                                                       infractions,
                                                       { reason: 'dismiss' },
                                                  )
                                                  setTimeout(() => {
                                                       setConfirmModalOpen(
                                                            false,
                                                       )
                                                       setModalClosing(false)
                                                  }, 320)
                                             }
                                        }}
                                   >
                                        <div
                                             className='reading-modal-panel'
                                             style={{
                                                  maxWidth: 680,
                                                  width: 'min(96%,720px)',
                                                  padding: 28,
                                                  boxShadow:
                                                       '0 20px 50px rgba(23,35,61,0.08)',
                                                  background:
                                                       'linear-gradient(180deg,#fbfffb,#ffffff)',
                                                  color: '#17233d',
                                                  border: '1px solid #e9e5dc',
                                                  borderRadius: 12,
                                                  overflow: 'hidden',
                                             }}
                                        >
                                             <div style={{ marginBottom: 12 }}>
                                                  <ExamIntro
                                                       infractions={infractions}
                                                       skill={'listening'}
                                                  />
                                             </div>
                                             <div
                                                  style={{
                                                       display: 'flex',
                                                       justifyContent:
                                                            'flex-end',
                                                       gap: 12,
                                                       marginTop: 8,
                                                  }}
                                             >
                                                  <button
                                                       ref={cancelBtnRef}
                                                       className='exam-submit'
                                                       type='button'
                                                       style={{
                                                            background: '#eee',
                                                            color: '#17233d',
                                                       }}
                                                       onClick={() => {
                                                            setModalClosing(
                                                                 true,
                                                            )
                                                            trackEvent(
                                                                 'exam_instructions_cancel',
                                                                 {
                                                                      target: '/dashboard/exams/listening',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'listening',
                                                                 infractions,
                                                                 {
                                                                      reason: 'cancel',
                                                                 },
                                                            )
                                                            setTimeout(() => {
                                                                 setConfirmModalOpen(
                                                                      false,
                                                                 )
                                                                 setModalClosing(
                                                                      false,
                                                                 )
                                                            }, 320)
                                                       }}
                                                  >
                                                       Cancel
                                                  </button>
                                                  <button
                                                       className='exam-submit'
                                                       type='button'
                                                       onClick={() => {
                                                            setModalClosing(
                                                                 true,
                                                            )
                                                            trackEvent(
                                                                 'exam_instructions_confirm',
                                                                 {
                                                                      target: '/dashboard/exams/listening',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'listening',
                                                                 infractions,
                                                                 {
                                                                      reason: 'confirm',
                                                                 },
                                                            )
                                                            setTimeout(() => {
                                                                 setConfirmModalOpen(
                                                                      false,
                                                                 )
                                                                 setModalClosing(
                                                                      false,
                                                                 )
                                                                 setStarted(
                                                                      true,
                                                                 )
                                                            }, 320)
                                                       }}
                                                  >
                                                       Confirm and start exam
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </>
                    ) : (
                         <div style={{ marginTop: 12 }}>
                              <h4>Listening instructions</h4>
                              <p>
                                   Play the audio and answer the questions on
                                   the screen.
                              </p>
                              <div style={{ marginTop: 12 }}>
                                   <button
                                        className='exam-submit'
                                        type='button'
                                   >
                                        Start audio →
                                   </button>
                              </div>
                         </div>
                    )}
               </section>
          </main>
     )
}
