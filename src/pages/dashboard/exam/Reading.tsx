import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent, type MouseEvent, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import ExamIntro from '../../../components/ExamIntro'
import { trackEvent, postInfraction } from '../../../lib/analytics'
import { fetchReadingTest, submitReadingTest, type ReadingPassage, type ReadingQuestionGroup, type ReadingTest } from '../../../lib/readingApi'
import './exam.css'

const headingKeys = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']

function formatSeconds(totalSeconds: number) {
     const minutes = Math.floor(totalSeconds / 60)
     const seconds = totalSeconds % 60
     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function calculateScore(test: ReadingTest, answers: Record<string, string>) {
     let correct = 0
     let total = 0

     for (const passage of test.passages) {
         for (const group of passage.questions) {
              const items = Array.isArray(group.items) ? group.items : Array.isArray(group.questions) ? group.questions : []
              for (const item of items) {
                   total += 1
                   const key = `${passage.id}:${group.qtype}:${item.id}`
                   const userValue = String(answers[key] ?? '').trim().toLowerCase()
                   const expectedValue = String(item.answer ?? '').trim().toLowerCase()
                   if (userValue === expectedValue) {
                        correct += 1
                   }
              }
         }
     }

     return {
         score: correct,
         total,
         percentage: total ? Math.round((correct / total) * 100) : 0,
         passed: total ? correct >= Math.ceil(total * 0.5) : false,
     }
}

function getQuestionKey(passageId: string, group: ReadingQuestionGroup, itemId: string | number) {
     return `${passageId}:${group.qtype}:${itemId}`
}

export default function ReadingPage() {
     const [view, setView] = useState<'intro' | 'test' | 'result'>('intro')
     const [confirmModalOpen, setConfirmModalOpen] = useState(false)
     const [modalClosing, setModalClosing] = useState(false)
     const [infractions, setInfractions] = useState(0)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)
     const [test, setTest] = useState<ReadingTest | null>(null)
     const [currentPassageIndex, setCurrentPassageIndex] = useState(0)
     const [answers, setAnswers] = useState<Record<string, string>>({})
     const [timeLeft, setTimeLeft] = useState(60 * 60)
     const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null)
     const [tabWarnings, setTabWarnings] = useState(0)
     const cancelBtnRef = useRef<HTMLButtonElement | null>(null)
     const lastActiveRef = useRef<HTMLElement | null>(null)
     const lastTabWarningRef = useRef<number>(0)

     const loadTest = async () => {
         setLoading(true)
         setError(null)
         try {
              const nextTest = await fetchReadingTest()
              setTest(nextTest)
              setCurrentPassageIndex(0)
              setAnswers({})
              setTimeLeft(nextTest.totalDurationSeconds ?? 60 * 60)
              setView('test')
         } catch (loadError) {
              const message = loadError instanceof Error ? loadError.message : 'Unable to load the reading test. Please check that the backend is running.'
              setError(message)
              setView('intro')
              setTest(null)
         } finally {
              setLoading(false)
         }
     }

     const submitExam = async (forcedByTimer = false) => {
         if (!test) return
         if (!forcedByTimer && view !== 'test') return

         const computed = calculateScore(test, answers)
         try {
              const serverResult = await submitReadingTest(test, answers)
              setResult({
                   score: serverResult.score,
                   total: serverResult.total,
                   percentage: serverResult.percentage,
                   passed: serverResult.passed,
              })
         } catch {
              setResult(computed)
         }

         setView('result')
         trackEvent('reading_exam_submitted', {
              target: '/dashboard/exams/reading',
              forcedByTimer,
              percentage: computed.percentage,
         })
     }

     useEffect(() => {
         if (view !== 'test' || !test) return
         const timerId = window.setInterval(() => {
              setTimeLeft((previous) => {
                   if (previous <= 1) {
                        window.clearInterval(timerId)
                        void submitExam(true)
                        return 0
                   }
                   return previous - 1
              })
         }, 1000)
         return () => window.clearInterval(timerId)
     }, [view, test])

     useEffect(() => {
         if (view !== 'test') return

         const handleTabSwitch = () => {
              if (document.hidden) {
                   const now = Date.now()
                   if (now - lastTabWarningRef.current < 1200) return
                   lastTabWarningRef.current = now
                   setTabWarnings((previous) => {
                        const nextWarnings = previous + 1
                        if (nextWarnings >= 2) {
                             void submitExam(true)
                        }
                        return nextWarnings
                   })
              }
         }

         document.addEventListener('visibilitychange', handleTabSwitch)
         window.addEventListener('blur', handleTabSwitch)
         return () => {
              document.removeEventListener('visibilitychange', handleTabSwitch)
              window.removeEventListener('blur', handleTabSwitch)
         }
     }, [view, test])

     useEffect(() => {
         if (!confirmModalOpen) return
         lastActiveRef.current = document.activeElement as HTMLElement | null
         const focusTimer = window.setTimeout(() => cancelBtnRef.current?.focus(), 80)

         const onKey = (event: KeyboardEvent) => {
              if (event.key === 'Escape' && !modalClosing) {
                   setModalClosing(true)
                   trackEvent('exam_instructions_cancel', {
                        target: '/dashboard/exams/reading',
                        infractions,
                   })
                   postInfraction('reading', infractions, { reason: 'escape' })
                   window.setTimeout(() => {
                        setConfirmModalOpen(false)
                        setModalClosing(false)
                        lastActiveRef.current?.focus()
                   }, 320)
              }
         }

         document.addEventListener('keydown', onKey)
         return () => {
              window.clearTimeout(focusTimer)
              document.removeEventListener('keydown', onKey)
         }
     }, [confirmModalOpen, infractions, modalClosing])

     useEffect(() => {
         if (confirmModalOpen && !modalClosing) {
              document.body.classList.add('no-scroll')
         } else {
              document.body.classList.remove('no-scroll')
         }
         return () => document.body.classList.remove('no-scroll')
     }, [confirmModalOpen, modalClosing])

     const openConfirm = () => {
         setInfractions(0)
         setTabWarnings(0)
         setConfirmModalOpen(true)
         trackEvent('exam_instructions_open', {
              target: '/dashboard/exams/reading',
              skill: 'Reading',
         })
     }

     const visiblePassage = test?.passages[currentPassageIndex] ?? null
     const isLastPassage = Boolean(test && currentPassageIndex >= (test.passages.length - 1))

     const preventCopy = (event: ClipboardEvent | MouseEvent | DragEvent | SyntheticEvent) => {
          event.preventDefault()
     }

     const renderQuestionGroup = (passage: ReadingPassage, group: ReadingQuestionGroup) => {
         if (group.qtype === 'MatchingHeadings') {
              return (
                   <div key={`${passage.id}-${group.qtype}`} className='reading-question-group'>
                        <div className='reading-group-header'>
                             <h4>{group.sectionLabel ?? 'Matching headings'}</h4>
                             {group.timeMinutes ? <span className='reading-group-time'>{group.timeMinutes} min</span> : null}
                        </div>
                        <p>{group.instructions}</p>
                        <div className='reading-heading-list'>
                             {group.headings?.map((heading, index) => (
                                  <span key={`${passage.id}-heading-${heading}`} className='reading-heading-option'>
                                       {headingKeys[index] ?? String(index + 1)}. {heading.replace(/^[^\.]+\.\s*/, '')}
                                  </span>
                             ))}
                        </div>
                        {group.questions?.map((question) => {
                             const key = getQuestionKey(passage.id, group, question.id)
                             return (
                                  <div key={`${passage.id}-${question.id}`} className='reading-answer-row'>
                                       <label>{question.label ?? `Question ${question.id}`}</label>
                                       <select value={answers[key] ?? ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [key]: event.target.value }))}>
                                            <option value=''>Select</option>
                                            {headingKeys.map((label) => (
                                                 <option key={`${passage.id}-${question.id}-${label}`} value={label}>{label}</option>
                                            ))}
                                       </select>
                                  </div>
                             )
                        })}
                   </div>
              )
         }

         if (group.qtype === 'TrueFalseNotGiven') {
              return (
                   <div key={`${passage.id}-${group.qtype}`} className='reading-question-group'>
                        <div className='reading-group-header'>
                             <h4>{group.sectionLabel ?? 'True / False / Not Given'}</h4>
                             {group.timeMinutes ? <span className='reading-group-time'>{group.timeMinutes} min</span> : null}
                        </div>
                        <p>{group.instructions}</p>
                        {group.items?.map((item) => {
                             const key = getQuestionKey(passage.id, group, item.id)
                             const selected = answers[key] ?? ''
                             return (
                                  <div key={`${passage.id}-${item.id}`} className='reading-answer-row'>
                                       <p className='reading-statement'>{String(item.id)}. {item.statement}</p>
                                       <div className='reading-choice-row'>
                                            {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                                                 <button
                                                      key={`${passage.id}-${item.id}-${option}`}
                                                      type='button'
                                                      className={selected === option ? 'reading-option selected' : 'reading-option'}
                                                      onClick={() => setAnswers((previous) => ({ ...previous, [key]: option }))}
                                                 >
                                                      {option}
                                                 </button>
                                            ))}
                                       </div>
                                  </div>
                             )
                        })}
                   </div>
              )
         }

         if (group.qtype === 'MultipleChoice') {
              return (
                   <div key={`${passage.id}-${group.qtype}`} className='reading-question-group'>
                        <div className='reading-group-header'>
                             <h4>{group.sectionLabel ?? 'Multiple choice'}</h4>
                             {group.timeMinutes ? <span className='reading-group-time'>{group.timeMinutes} min</span> : null}
                        </div>
                        <p>{group.instructions}</p>
                        {group.items?.map((item) => {
                             const key = getQuestionKey(passage.id, group, item.id)
                             const selected = answers[key] ?? ''
                             return (
                                  <div key={`${passage.id}-${item.id}`} className='reading-answer-row'>
                                       <p className='reading-statement'>{String(item.id)}. {item.question}</p>
                                       <div className='reading-choice-row'>
                                            {Object.entries(item.options ?? {}).map(([optionKey, optionValue]) => (
                                                 <button
                                                      key={`${passage.id}-${item.id}-${optionKey}`}
                                                      type='button'
                                                      className={selected === optionKey ? 'reading-option selected' : 'reading-option'}
                                                      onClick={() => setAnswers((previous) => ({ ...previous, [key]: optionKey }))}
                                                 >
                                                      {optionKey}. {optionValue}
                                                 </button>
                                            ))}
                                       </div>
                                  </div>
                             )
                        })}
                   </div>
              )
         }

         return (
              <div key={`${passage.id}-${group.qtype}`} className='reading-question-group'>
                   <div className='reading-group-header'>
                        <h4>{group.sectionLabel ?? 'Sentence completion'}</h4>
                        {group.timeMinutes ? <span className='reading-group-time'>{group.timeMinutes} min</span> : null}
                   </div>
                   <p>{group.instructions}</p>
                   {group.items?.map((item) => {
                        const key = getQuestionKey(passage.id, group, item.id)
                        return (
                             <div key={`${passage.id}-${item.id}`} className='reading-answer-row'>
                                  <label>{String(item.id)}. {item.prompt}</label>
                                  <input
                                       type='text'
                                       value={answers[key] ?? ''}
                                       onChange={(event) => setAnswers((previous) => ({ ...previous, [key]: event.target.value }))}
                                       placeholder='Type answer'
                                  />
                             </div>
                        )
                   })}
              </div>
         )
     }

     if (view === 'result' && result) {
         return (
              <main className='exam-page'>
                   <DashboardHeader />
                   <section className='exam-card reading-result-card'>
                        <p className='exam-kicker'>Reading result</p>
                        <h1>{result.percentage}%</h1>
                        <p className='exam-prompt'>You scored {result.score} out of {result.total}. {result.passed ? 'You passed this reading test.' : 'Review the passages and try another attempt.'}</p>
                        <div className='reading-result-grid'>
                             <div><span>Score</span><strong>{result.score}/{result.total}</strong></div>
                             <div><span>Accuracy</span><strong>{result.percentage}%</strong></div>
                             <div><span>Outcome</span><strong>{result.passed ? 'Pass' : 'Review'}</strong></div>
                        </div>
                        <div className='reading-result-actions'>
                             <button type='button' className='exam-submit' onClick={() => { setView('intro'); setTest(null); setResult(null); setAnswers({}); setTimeLeft(60 * 60) }}>Start another reading test</button>
                             <Link to='/dashboard/tests' className='exam-submit secondary-link'>Back to tests</Link>
                        </div>
                   </section>
              </main>
         )
     }

     return (
         <main className='exam-page'>
              <DashboardHeader />
              <section className='exam-card'>
                   <div className='reading-header-row'>
                        <div>
                             <p className='exam-kicker'>Reading</p>
                             <h1>Reading test</h1>
                        </div>
                        <div className='reading-timer'>{formatSeconds(timeLeft)}</div>
                   </div>

                   {tabWarnings > 0 && (
                        <div className='reading-warning'>Warning: tab switching is not allowed. A second switch will auto-submit the test.</div>
                   )}

                   {error ? (
                        <div className='reading-warning' style={{ marginTop: 12 }}>
                             <strong>Unable to load the reading test.</strong>
                             <p style={{ margin: '8px 0 0' }}>{error}</p>
                             <button type='button' className='exam-submit' onClick={() => void loadTest()} style={{ marginTop: 12 }}>
                                  Retry loading test
                             </button>
                        </div>
                   ) : !test && view === 'intro' ? (
                        <>
                             <p className='exam-prompt'>
                                  <ul className='reading-info-list'>
                                       <li>Total time: 60 minutes</li>
                                       <li>Number of passages: 3</li>
                                       <li>Total questions: up to 40</li>
                                       <li>Marks: 1 mark per question</li>
                                  </ul>
                             </p>
                             <div style={{ marginTop: 6, marginBottom: 12 }}>
                                  <table className='section-what-difficulty' aria-label='Passage difficulty and suggested time'>
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
                                                 <td>Shorter / simpler academic text</td>
                                                 <td>🟢 Easy — 15–17 min</td>
                                            </tr>
                                            <tr>
                                                 <td>Part 2</td>
                                                 <td>Moderate-length academic text</td>
                                                 <td>🟠 Medium — 18–20 min</td>
                                            </tr>
                                            <tr>
                                                 <td>Part 3</td>
                                                 <td>Longer or more complex academic text</td>
                                                 <td>🔴 Hard — 23–25 min</td>
                                            </tr>
                                       </tbody>
                                  </table>
                             </div>
                             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                  <button className='exam-submit' type='button' onClick={openConfirm} disabled={loading}>
                                       {loading ? 'Loading test…' : 'Start reading →'}
                                  </button>
                                  <Link to='/dashboard' className='exam-submit' style={{ background: '#eee', color: '#17233d', textDecoration: 'none' }}>← Quit exam</Link>
                             </div>
                             {confirmModalOpen && (
                                  <div className={`reading-confirm-modal ${modalClosing ? 'is-closing' : 'is-open'}`} role='dialog' aria-modal='true' style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 1200, background: 'rgba(11,17,26,0.6)', transition: 'background-color 220ms ease' }} onMouseDown={(event) => {
                                       if (event.target === event.currentTarget) {
                                            setModalClosing(true)
                                            trackEvent('exam_instructions_dismiss', { target: '/dashboard/exams/reading', infractions })
                                            postInfraction('reading', infractions, { reason: 'dismiss' })
                                            window.setTimeout(() => {
                                                 setConfirmModalOpen(false)
                                                 setModalClosing(false)
                                            }, 320)
                                       }
                                  }}>
                                       <div className='reading-modal-panel' style={{ maxWidth: 680, width: 'min(96%,720px)', padding: 28, boxShadow: '0 20px 50px rgba(23,35,61,0.08)', background: 'linear-gradient(180deg,#fbfffb,#ffffff)', color: '#17233d', border: '1px solid #e9e5dc', borderRadius: 12, overflow: 'hidden' }}>
                                            <div style={{ marginBottom: 12 }}>
                                                 <ExamIntro infractions={infractions} skill='reading' />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                                                 <button ref={cancelBtnRef} className='exam-submit' type='button' style={{ background: '#eee', color: '#17233d' }} onClick={() => {
                                                      setModalClosing(true)
                                                      trackEvent('exam_instructions_cancel', { target: '/dashboard/exams/reading', infractions })
                                                      postInfraction('reading', infractions, { reason: 'cancel' })
                                                      window.setTimeout(() => {
                                                           setConfirmModalOpen(false)
                                                           setModalClosing(false)
                                                      }, 320)
                                                 }}>Cancel</button>
                                                 <button className='exam-submit' type='button' onClick={() => {
                                                      setModalClosing(true)
                                                      trackEvent('exam_instructions_confirm', { target: '/dashboard/exams/reading', infractions })
                                                      postInfraction('reading', infractions, { reason: 'confirm' })
                                                      window.setTimeout(() => {
                                                           setConfirmModalOpen(false)
                                                           setModalClosing(false)
                                                           void loadTest()
                                                      }, 320)
                                                 }}>Confirm and start exam</button>
                                            </div>
                                       </div>
                                  </div>
                             )}
                        </>
                   ) : (
                        <>
                             {!test && loading ? (
                                  <div className='reading-warning' style={{ marginTop: 12 }}>Loading your IELTS reading test…</div>
                             ) : null}
                             {visiblePassage ? (
                                  <article className='reading-passage-block' onCopy={preventCopy} onCut={preventCopy} onPaste={preventCopy} onContextMenu={preventCopy} onDragStart={preventCopy}>
                                       <div className='reading-passage-header'>
                                            <span className='reading-difficulty-badge'>{visiblePassage.difficulty}</span>
                                            <strong>{visiblePassage.title}</strong>
                                       </div>
                                       <div className='reading-passage-meta'>Passage {currentPassageIndex + 1} of {test?.passages.length ?? 0}</div>
                                       <p className='reading-passage-text'>{visiblePassage.passage}</p>
                                       {visiblePassage.questions.map((group) => renderQuestionGroup(visiblePassage, group))}
                                  </article>
                             ) : null}

                             {test ? (
                                  <div className='reading-nav-row'>
                                       <button
                                            type='button'
                                            className='exam-submit secondary-button'
                                            disabled={currentPassageIndex === 0}
                                            onClick={() => setCurrentPassageIndex((index) => Math.max(0, index - 1))}
                                       >
                                            ← Previous passage
                                       </button>
                                       <button
                                            type='button'
                                            className='exam-submit'
                                            onClick={() => {
                                                 if (isLastPassage) {
                                                      void submitExam(false)
                                                      return
                                                 }
                                                 setCurrentPassageIndex((index) => index + 1)
                                            }}
                                       >
                                            {isLastPassage ? 'Submit answers →' : 'Next passage →'}
                                       </button>
                                  </div>
                             ) : null}
                        </>
                   )}
              </section>
          </main>
     )
}
