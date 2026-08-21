import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import './exam.css'

export default function WritingPage() {
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
                         target: '/dashboard/exams/writing',
                         infractions,
                    })
                    postInfraction('writing', infractions, { reason: 'escape' })
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
               target: '/dashboard/exams/writing',
               skill: 'Writing',
          })
     }

     return (
          <main className='exam-page'>
               <DashboardHeader />

               <section className='exam-card'>
                    <p className='exam-kicker'>Writing practice</p>
                    <div className='exam-meta'>
                         <span>Task 1 & 2</span>
                         <span>60 minutes</span>
                    </div>
                    <h1>Writing warm-up</h1>

                    {!started ? (
                         <>
                              <p className='exam-prompt'>
                                   <ul className='reading-info-list'>
                                        <li>Total time: 60 minutes</li>
                                        <li>Number of tasks: 2</li>
                                        <li>Total questions: 2</li>
                                        <li>Marks: graded for feedback</li>
                                        <li>
                                             No extra time is given at the end.
                                        </li>
                                        <li>
                                             You should manage the full 60
                                             minutes yourself.
                                        </li>
                                   </ul>
                              </p>

                              <div style={{ marginTop: 6, marginBottom: 12 }}>
                                   <table
                                        className='writing-tasks'
                                        aria-label='Writing tasks and guidance'
                                   >
                                        <thead>
                                             <tr>
                                                  <th>Task</th>
                                                  <th>What you do</th>
                                                  <th>Recommended time</th>
                                                  <th>Minimum words</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             <tr>
                                                  <td>Task 1</td>
                                                  <td>
                                                       Describe/compare visual
                                                       information
                                                  </td>
                                                  <td>
                                                       <strong>20 min</strong>
                                                  </td>
                                                  <td>
                                                       <strong>
                                                            150 words
                                                       </strong>
                                                  </td>
                                             </tr>
                                             <tr>
                                                  <td>Task 2</td>
                                                  <td>
                                                       Write an essay responding
                                                       to a question
                                                  </td>
                                                  <td>
                                                       <strong>40 min</strong>
                                                  </td>
                                                  <td>
                                                       <strong>
                                                            250 words
                                                       </strong>
                                                  </td>
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
                                        Start writing →
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
                                                            target: '/dashboard/exams/writing',
                                                            infractions,
                                                       },
                                                  )
                                                  postInfraction(
                                                       'writing',
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
                                                       skill={'writing'}
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
                                                                      target: '/dashboard/exams/writing',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'writing',
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
                                                                      target: '/dashboard/exams/writing',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'writing',
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
                              <h4>Writing tasks</h4>
                              <p>
                                   Task 1: Describe the data. Task 2: Present
                                   and justify an opinion.
                              </p>
                              <div style={{ marginTop: 12 }}>
                                   <textarea
                                        placeholder='Type your answers here'
                                        rows={8}
                                        style={{
                                             width: '100%',
                                             padding: 10,
                                             borderRadius: 6,
                                             border: '1px solid #dcdcdc',
                                        }}
                                   />
                              </div>
                              <div style={{ marginTop: 12 }}>
                                   <button
                                        className='exam-submit'
                                        type='button'
                                   >
                                        Submit answers →
                                   </button>
                              </div>
                         </div>
                    )}
               </section>
          </main>
     )
}
