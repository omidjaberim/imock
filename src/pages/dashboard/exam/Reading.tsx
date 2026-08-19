import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import './exam.css'

export default function ReadingPage() {
     const [started, setStarted] = useState(false)
     // const timeLeft = 60 * 60 // example: 60 minutes for this practice

     // Modal state for confirmation
     const [confirmModalOpen, setConfirmModalOpen] = useState(false)
     const [modalClosing, setModalClosing] = useState(false)
     const [infractions, setInfractions] = useState(0)
     const cancelBtnRef = React.useRef<HTMLButtonElement | null>(null)
     const lastActiveRef = React.useRef<HTMLElement | null>(null)

     // Minimal timer - only runs locally for demonstration
     // React.useEffect(() => {
     //      if (!started) return
     //      const id = setInterval(() => {
     //           setTimeLeft((t) => (t > 0 ? t - 1 : 0))
     //      }, 1000)
     //      return () => clearInterval(id)
     // }, [started])

     // infractions tracking while modal open
     React.useEffect(() => {
          if (!confirmModalOpen) return
          const onVisibility = () => {
               if (document.hidden) {
                    setInfractions((n) => {
                         const next = n + 1
                         // do not await
                         import('../../../lib/analytics').then(
                              ({ trackEvent }) =>
                                   trackEvent('exam_instruction_infraction', {
                                        count: next,
                                   }),
                         )
                         return next
                    })
               }
          }
          document.addEventListener('visibilitychange', onVisibility)
          return () =>
               document.removeEventListener('visibilitychange', onVisibility)
     }, [confirmModalOpen])

     // lock body scroll while modal open
     React.useEffect(() => {
          if (confirmModalOpen && !modalClosing) {
               document.body.classList.add('no-scroll')
          } else {
               document.body.classList.remove('no-scroll')
          }
          return () => document.body.classList.remove('no-scroll')
     }, [confirmModalOpen, modalClosing])

     // Focus and keyboard handling for the modal
     React.useEffect(() => {
          if (!confirmModalOpen) return
          lastActiveRef.current = document.activeElement as HTMLElement | null
          const focusTimer = setTimeout(() => cancelBtnRef.current?.focus(), 80)
          const onKey = (e: KeyboardEvent) => {
               if (e.key === 'Escape' && !modalClosing) {
                    setModalClosing(true)
                    import('../../../lib/analytics').then(({ trackEvent }) =>
                         trackEvent('exam_instructions_cancel', {
                              target: '/dashboard/exams/reading',
                              infractions,
                         }),
                    )
                    import('../../../lib/analytics').then(
                         ({ postInfraction }) =>
                              postInfraction('reading', infractions, {
                                   reason: 'escape',
                              }),
                    )
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
               if (!confirmModalOpen) {
                    try {
                         lastActiveRef.current?.focus()
                    } catch {}
               }
          }
     }, [confirmModalOpen, modalClosing, infractions])

     const openConfirm = () => {
          setInfractions(0)
          setConfirmModalOpen(true)
          import('../../../lib/analytics').then(({ trackEvent }) =>
               trackEvent('exam_instructions_open', {
                    target: '/dashboard/exams/reading',
                    skill: 'Reading',
               }),
          )
     }
     return (
          <main className='exam-page'>
               <header className='exam-header'>
                    <Link
                         to='/dashboard'
                         className='dashboard-brand'
                    >
                         <i>sasi</i>mock<span>.</span>
                    </Link>
               </header>

               <section className='exam-card'>
                    <h1>Reading passages</h1>
                    {!started ? (
                         <>
                              <p className='exam-prompt'>
                                   <ul className='reading-info-list'>
                                        <li>Total time: 60 minutes</li>
                                        <li>Number of passages: 3</li>
                                        <li>Total questions: 40</li>
                                        <li>
                                             Marks: 1 mark per question → 40
                                             marks
                                        </li>
                                   </ul>
                              </p>

                              {/* Passage difficulty table styled like other parts tables */}
                              <div style={{ marginTop: 6, marginBottom: 12 }}>
                                   <table
                                        className='section-what-difficulty '
                                        aria-label='Passage difficulty and suggested time'
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
                                                       Shorter / simpler texts
                                                       (usually the easiest)
                                                  </td>
                                                  <td>🟢 Easy — 15–17 min</td>
                                             </tr>
                                             <tr>
                                                  <td>Part 2</td>
                                                  <td>
                                                       Moderate-length
                                                       academic-style text
                                                  </td>
                                                  <td>🟠 Medium — 18–20 min</td>
                                             </tr>
                                             <tr>
                                                  <td>Part 3</td>
                                                  <td>
                                                       Longer or more complex
                                                       academic text (hardest)
                                                  </td>
                                                  <td>🔴 Hard — 23–25 min</td>
                                             </tr>
                                        </tbody>
                                   </table>
                              </div>
                              <div
                                   style={{
                                        display: 'flex',
                                        gap: 10,
                                   }}
                              >
                                   <button
                                        className='exam-submit'
                                        type='button'
                                        onClick={() => openConfirm()}
                                   >
                                        Start reading →
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

                              {/* Confirmation modal (centered) */}
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
                                                            target: '/dashboard/exams/reading',
                                                            infractions,
                                                       },
                                                  )
                                                  postInfraction(
                                                       'reading',
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
                                                       skill={'reading'}
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
                                                                      target: '/dashboard/exams/reading',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'reading',
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
                                                                      target: '/dashboard/exams/reading',
                                                                      infractions,
                                                                 },
                                                            )
                                                            postInfraction(
                                                                 'reading',
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
                         <>
                              <article
                                   style={{
                                        background: '#fff',
                                        padding: 18,
                                        borderRadius: 8,
                                        color: '#17233d',
                                        marginTop: 12,
                                   }}
                              >
                                   <h3>The rise of urban green spaces</h3>
                                   <p>
                                        Urban green spaces are becoming an
                                        increasingly important feature of modern
                                        cities. They provide residents with
                                        opportunities for recreation, improve
                                        air quality, and help mitigate the
                                        heat-island effect. Research shows that
                                        accessible parks and community gardens
                                        also promote social cohesion and mental
                                        well-being among city dwellers. In the
                                        decades ahead, urban planners will need
                                        to balance the demand for housing with
                                        the preservation of natural areas to
                                        ensure sustainable, liveable cities.
                                   </p>
                              </article>

                              <div style={{ marginTop: 12 }}>
                                   <h4>Questions</h4>
                                   <ol>
                                        <li>
                                             According to the passage, name two
                                             benefits of urban green spaces.
                                        </li>
                                        <li>
                                             What challenge must urban planners
                                             balance in the future?
                                        </li>
                                   </ol>
                                   <div style={{ marginTop: 12 }}>
                                        <textarea
                                             placeholder='Type your answers here'
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
                         </>
                    )}
               </section>
          </main>
     )
}
