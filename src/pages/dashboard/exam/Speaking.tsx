import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import './exam.css'

export default function SpeakingPage() {
     const [started, setStarted] = useState(false)
     const [confirmModalOpen, setConfirmModalOpen] = useState(false)
     const [modalClosing, setModalClosing] = useState(false)
     const [infractions, setInfractions] = useState(0)
     const cancelBtnRef = React.useRef<HTMLButtonElement | null>(null)
     const lastActiveRef = React.useRef<HTMLElement | null>(null)

     // Focus and keyboard handling
     React.useEffect(() => {
          if (!confirmModalOpen) return
          lastActiveRef.current = document.activeElement as HTMLElement | null
          const focusTimer = setTimeout(() => cancelBtnRef.current?.focus(), 80)
          const onKey = (e: KeyboardEvent) => {
               if (e.key === 'Escape' && !modalClosing) {
                    setModalClosing(true)
                    trackEvent('exam_instructions_cancel', {
                         target: '/dashboard/exams/speaking',
                         infractions,
                    })
                    postInfraction('speaking', infractions, {
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
               target: '/dashboard/exams/speaking',
               skill: 'Speaking',
          })
     }

     return (
          <main className='exam-page'>
               <header className='exam-header'>
                    <Link
                         to='/dashboard'
                         className='dashboard-brand'
                    >
                         <i>i</i>mock<span>.</span>
                    </Link>
               </header>

               <section className='exam-card'>
                    <p className='exam-kicker'>Speaking practice</p>
                    <div className='exam-meta'>
                         <span>Part 1 of 1</span>
                         <span>11–14 minutes</span>
                    </div>
                    <h1>Speaking warm-up</h1>

                    {!started ? (
                         <>
                              <p className='exam-prompt'>
                                   <ul className='reading-info-list'>
                                        <li>Total time: 11–14 minutes</li>
                                        <li>Number of parts: 1</li>
                                        <li>Total questions: 3</li>
                                        <li>Marks: recorded for feedback</li>
                                        <li>
                                             It is a face-to-face interview with
                                             an IELTS examiner.
                                        </li>
                                        <li>
                                             The examiner records the interview.
                                        </li>
                                        <li>
                                             You answer questions without
                                             another candidate.
                                        </li>
                                   </ul>
                              </p>

                              <div style={{ marginTop: 6, marginBottom: 12 }}>
                                   <table
                                        className='speaking-parts'
                                        aria-label='Speaking parts and timings'
                                   >
                                        <thead>
                                             <tr>
                                                  <th>Part</th>
                                                  <th>What happens</th>
                                                  <th>Time</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             <tr>
                                                  <td>Part 1</td>
                                                  <td>
                                                       Introduction + questions
                                                       about familiar topics
                                                  </td>
                                                  <td>
                                                       <strong>4–5 min</strong>
                                                  </td>
                                             </tr>
                                             <tr>
                                                  <td>Part 2</td>
                                                  <td>
                                                       Long turn — speak about a
                                                       topic
                                                  </td>
                                                  <td>
                                                       <strong>3–4 min</strong>
                                                  </td>
                                             </tr>
                                             <tr>
                                                  <td>Part 3</td>
                                                  <td>
                                                       More complex discussion
                                                       related to Part 2
                                                  </td>
                                                  <td>
                                                       <strong>4–5 min</strong>
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
                                        Start speaking →
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
                                                            target: '/dashboard/exams/speaking',
                                                            infractions,
                                                       },
                                                  )
                                                  postInfraction(
                                                       'speaking',
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
                                                       skill={'speaking'}
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
                                                                 Speak
                                                                 continuously
                                                                 for 1–2 minutes
                                                                 on the
                                                                 cue-topic.
                                                            </li>
                                                            <li>
                                                                 Give a clear
                                                                 opening and
                                                                 conclude your
                                                                 answer.
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
                                                                      target: '/dashboard/exams/speaking',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'speaking',
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
                                                                      target: '/dashboard/exams/speaking',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'speaking',
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
                              <h4>Speaking prompt</h4>
                              <p>
                                   Describe a place you enjoy visiting. Explain
                                   why it is special to you.
                              </p>
                              <div style={{ marginTop: 12 }}>
                                   <textarea
                                        placeholder='Type notes here'
                                        rows={6}
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
