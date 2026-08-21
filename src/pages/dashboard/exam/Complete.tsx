import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import './exam.css'

export default function CompletePage() {
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
                         target: '/dashboard/exams/complete',
                         infractions,
                    })
                    postInfraction('complete', infractions, {
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
               target: '/dashboard/exams/complete',
               skill: 'Complete',
          })
     }

     return (
          <main className='exam-page'>
               <DashboardHeader />

               <section className='exam-card'>
                    <p className='exam-kicker'>Complete IELTS mock</p>
                    <div className='exam-meta'>
                         <span></span>
                         <span>2 hours 45 minutes</span>
                    </div>
                    <h1>Complete mock exam</h1>

                    {!started ? (
                         <>
                              <p className='exam-prompt'>
                                   <ul className='reading-info-list'>
                                        <li>Total time: 2 hours 45 minutes</li>
                                        <li>Number of passages/parts: 4</li>
                                        <li>
                                             Total questions: 40+ (varies per
                                             section)
                                        </li>
                                        <li>Marks: calibrated per section</li>
                                   </ul>
                              </p>

                              {/* Section / Time / Questions table for complete mock */}
                              <div style={{ marginTop: 6, marginBottom: 12 }}>
                                   <table
                                        className='section-time-questions'
                                        aria-label='Section times and questions'
                                   >
                                        <thead>
                                             <tr>
                                                  <th>Section</th>
                                                  <th>Time</th>
                                                  <th>Questions</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             <tr>
                                                  <td>🎧 Listening</td>
                                                  <td>
                                                       <strong>
                                                            30 minutes
                                                       </strong>
                                                  </td>
                                                  <td>40</td>
                                             </tr>
                                             <tr>
                                                  <td>📖 Reading</td>
                                                  <td>
                                                       <strong>
                                                            60 minutes
                                                       </strong>
                                                  </td>
                                                  <td>40</td>
                                             </tr>
                                             <tr>
                                                  <td>✍️ Writing</td>
                                                  <td>
                                                       <strong>
                                                            60 minutes
                                                       </strong>
                                                  </td>
                                                  <td>2 tasks</td>
                                             </tr>
                                             <tr>
                                                  <td>🗣️ Speaking</td>
                                                  <td>
                                                       <strong>
                                                            11–14 minutes
                                                       </strong>
                                                  </td>
                                                  <td>Interview</td>
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
                                        Start complete IELTS exam →
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
                                                            target: '/dashboard/exams/complete',
                                                            infractions,
                                                       },
                                                  )
                                                  postInfraction(
                                                       'complete',
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
                                                  padding: 24,
                                                  boxShadow:
                                                       '0 20px 50px rgba(23,35,61,0.08)',
                                                  background:
                                                       'linear-gradient(180deg,#fbfffb,#ffffff)',
                                                  color: '#17233d',
                                                  border: '1px solid #e9e5dc',
                                                  borderRadius: 12,
                                                  // Limit panel height so it never exceeds the viewport
                                                  maxHeight:
                                                       'calc(100vh - 120px)',
                                                  overflowY: 'auto',
                                             }}
                                        >
                                             <div style={{ marginBottom: 12 }}>
                                                  <ExamIntro
                                                       infractions={infractions}
                                                       skill={'complete'}
                                                  />
                                                  <div
                                                       style={{ marginTop: 12 }}
                                                  >
                                                       <p
                                                            style={{
                                                                 margin: '6px 0 8px',
                                                                 fontWeight: 800,
                                                                 color: '#17233d',
                                                            }}
                                                       >
                                                            Quick tips
                                                       </p>
                                                       <ul className='reading-info-list'>
                                                            <li>
                                                                 Manage time
                                                                 across sections
                                                                 according to
                                                                 suggested
                                                                 timings.
                                                            </li>
                                                            <li>
                                                                 Keep answers
                                                                 concise and
                                                                 move on when
                                                                 stuck.
                                                            </li>
                                                       </ul>
                                                  </div>
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
                                                                      target: '/dashboard/exams/complete',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'complete',
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
                                                       cancel
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
                                                                      target: '/dashboard/exams/complete',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'complete',
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
                              <h4>Complete exam started</h4>
                              <p>
                                   Your exam timer has started. Navigate between
                                   sections using the exam UI.
                              </p>
                         </div>
                    )}
               </section>
          </main>
     )
}
