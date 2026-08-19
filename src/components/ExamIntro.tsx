import './exam-intro.css'

type Props = {
     infractions: number
     skill?: string | null
}

export default function ExamIntro({ infractions, skill }: Props) {
     const info: Record<
          string,
          { title: string; duration: string; prompt: string; tips: string[] }
     > = {
          speaking: {
               title: 'Speaking',
               duration: '11–14 minutes',
               prompt: 'Describe a place you enjoy visiting. Explain why it is special to you.',
               tips: [
                    'Speak continuously for 1–2 minutes on the cue-card topic.',
                    'Give a clear opening and conclude your answer.',
               ],
          },
          writing: {
               title: 'Writing',
               duration: '20–60 minutes',
               prompt: 'Task 1: describe the data. Task 2: present and justify an opinion with examples.',
               tips: [
                    'Spend 5–10 minutes planning Task 2.',
                    'Use clear paragraph structure and support ideas with examples.',
               ],
          },
          listening: {
               title: 'Listening',
               duration: '30–40 minutes',
               prompt: 'Listen carefully and select the best response. Focus on keywords and paraphrases.',
               tips: [
                    'Underline keywords in questions.',
                    'Watch for synonyms and paraphrasing in audio.',
               ],
          },
          reading: {
               title: 'Reading',
               duration: '60 minutes',
               prompt: 'Read passages and answer a variety of question types under time pressure.',
               tips: [
                    'Skim passages for structure, then scan for details.',
                    "Don't spend too long on a single question.",
               ],
          },
     }

     const key = skill ? skill.toLowerCase() : null
     const entry = key && info[key] ? info[key] : null
     const isComplete = key === 'complete'
     const skillClass = key ? `skill-accent--${key}` : ''

     return (
          <div className={`exam-intro ${skillClass}`}>
               {/* decorative orbs */}
               {/* decorative orbs rendered with SVG for crispness */}
               <div
                    className='exam-modal-orbs'
                    aria-hidden='true'
               >
                    {(() => {
                         const uid = Math.random().toString(36).slice(2, 8)
                         return (
                              <>
                                   <svg
                                        className='exam-modal-orb orb-one'
                                        viewBox='0 0 320 320'
                                        preserveAspectRatio='xMidYMid slice'
                                        aria-hidden='true'
                                   >
                                        <defs>
                                             <radialGradient
                                                  id={`g1-${uid}`}
                                                  cx='30%'
                                                  cy='30%'
                                                  r='70%'
                                             >
                                                  <stop
                                                       offset='0%'
                                                       stopColor='var(--orb-one-1)'
                                                  />
                                                  <stop
                                                       offset='40%'
                                                       stopColor='var(--orb-one-2)'
                                                  />
                                                  <stop
                                                       offset='100%'
                                                       stopColor='transparent'
                                                  />
                                             </radialGradient>
                                        </defs>
                                        <circle
                                             cx='160'
                                             cy='160'
                                             r='160'
                                             fill={`url(#g1-${uid})`}
                                        />
                                   </svg>
                                   <svg
                                        className='exam-modal-orb orb-two'
                                        viewBox='0 0 220 220'
                                        preserveAspectRatio='xMidYMid slice'
                                        aria-hidden='true'
                                   >
                                        <defs>
                                             <radialGradient
                                                  id={`g2-${uid}`}
                                                  cx='40%'
                                                  cy='40%'
                                                  r='70%'
                                             >
                                                  <stop
                                                       offset='0%'
                                                       stopColor='var(--orb-two-1)'
                                                  />
                                                  <stop
                                                       offset='40%'
                                                       stopColor='var(--orb-two-2)'
                                                  />
                                                  <stop
                                                       offset='100%'
                                                       stopColor='transparent'
                                                  />
                                             </radialGradient>
                                        </defs>
                                        <circle
                                             cx='110'
                                             cy='110'
                                             r='110'
                                             fill={`url(#g2-${uid})`}
                                        />
                                   </svg>
                                   <svg
                                        className='exam-modal-orb orb-three'
                                        viewBox='0 0 140 140'
                                        preserveAspectRatio='xMidYMid slice'
                                        aria-hidden='true'
                                   >
                                        <defs>
                                             <radialGradient
                                                  id={`g3-${uid}`}
                                                  cx='30%'
                                                  cy='30%'
                                                  r='70%'
                                             >
                                                  <stop
                                                       offset='0%'
                                                       stopColor='var(--orb-three-1)'
                                                  />
                                                  <stop
                                                       offset='40%'
                                                       stopColor='var(--orb-three-2)'
                                                  />
                                                  <stop
                                                       offset='100%'
                                                       stopColor='transparent'
                                                  />
                                             </radialGradient>
                                        </defs>
                                        <circle
                                             cx='70'
                                             cy='70'
                                             r='70'
                                             fill={`url(#g3-${uid})`}
                                        />
                                   </svg>
                              </>
                         )
                    })()}
               </div>

               <header className='exam-intro__header'>
                    <h2>
                         {entry
                              ? `${entry.title} — Warm-up`
                              : 'Exam — Instructions & Hints'}
                    </h2>
                    <p className='muted'>
                         Please read carefully before starting the mock.
                    </p>
               </header>

               <section className='exam-intro__notice'>
                    <strong>Important:</strong> Do NOT switch tabs and do NOT
                    close the browser during the exam. Leaving the exam page may
                    automatically submit your attempt or trigger an integrity
                    warning.
               </section>

               {isComplete ? (
                    <div
                         className='exam-intro__grid'
                         style={{ padding: 16 }}
                    >
                         {Object.keys(info).map((k) => {
                              const it = info[k]
                              return (
                                   <div
                                        key={k}
                                        className='card'
                                   >
                                        <strong>{it.title}</strong>
                                        <div
                                             style={{
                                                  color: '#82A2C8',
                                                  marginTop: 6,
                                             }}
                                        >
                                             {it.duration}
                                        </div>

                                        <ul
                                             style={{
                                                  color: '#648BB8',
                                                  marginTop: 8,
                                             }}
                                        >
                                             {it.tips.map((t) => (
                                                  <li key={t}>{t}</li>
                                             ))}
                                        </ul>
                                   </div>
                              )
                         })}
                    </div>
               ) : entry ? (
                    <div className='exam-intro__entry'>
                         <div className='exam-intro__entry-card'>
                              <div className='exam-intro__entry-head'>
                                   <div
                                        style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             gap: 12,
                                        }}
                                   >
                                        <span
                                             className='exam-intro__icon'
                                             aria-hidden='true'
                                        >
                                             {(() => {
                                                  const k = key || ''
                                                  if (k === 'speaking')
                                                       return (
                                                            <svg
                                                                 width='28'
                                                                 height='28'
                                                                 viewBox='0 0 24 24'
                                                                 fill='none'
                                                                 stroke='currentColor'
                                                                 strokeWidth='1.6'
                                                                 strokeLinecap='round'
                                                                 strokeLinejoin='round'
                                                            >
                                                                 <path d='M5 18.5 3.5 21l4.2-1.2A8.5 8.5 0 1 0 5 18.5Z' />
                                                                 <path d='M8 12h8M8 8.5h5' />
                                                            </svg>
                                                       )
                                                  if (k === 'writing')
                                                       return (
                                                            <svg
                                                                 width='28'
                                                                 height='28'
                                                                 viewBox='0 0 24 24'
                                                                 fill='none'
                                                                 stroke='currentColor'
                                                                 strokeWidth='1.6'
                                                                 strokeLinecap='round'
                                                                 strokeLinejoin='round'
                                                            >
                                                                 <path d='m5 19 3.2-.7L19 7.5 16.5 5 5.7 15.8 5 19Z' />
                                                                 <path d='m15.5 6 2.5 2.5M4 21h16' />
                                                            </svg>
                                                       )
                                                  if (k === 'listening')
                                                       return (
                                                            <svg
                                                                 width='28'
                                                                 height='28'
                                                                 viewBox='0 0 24 24'
                                                                 fill='none'
                                                                 stroke='currentColor'
                                                                 strokeWidth='1.6'
                                                                 strokeLinecap='round'
                                                                 strokeLinejoin='round'
                                                            >
                                                                 <path d='M4 13a8 8 0 0 1 16 0' />
                                                                 <path d='M4 13v4a2 2 0 0 0 2 2h2v-6H4ZM20 13v4a2 2 0 0 1-2 2h-2v-6h4Z' />
                                                            </svg>
                                                       )
                                                  if (k === 'reading')
                                                       return (
                                                            <svg
                                                                 width='28'
                                                                 height='28'
                                                                 viewBox='0 0 24 24'
                                                                 fill='none'
                                                                 stroke='currentColor'
                                                                 strokeWidth='1.6'
                                                                 strokeLinecap='round'
                                                                 strokeLinejoin='round'
                                                            >
                                                                 <path d='M4 5.5A3.5 3.5 0 0 1 7.5 4H12v15H7.5A3.5 3.5 0 0 0 4 22V5.5Z' />
                                                                 <path d='M20 5.5A3.5 3.5 0 0 0 16.5 4H12v15h4.5A3.5 3.5 0 0 1 20 22V5.5Z' />
                                                            </svg>
                                                       )
                                                  return null
                                             })()}
                                        </span>
                                        <strong className='exam-intro__entry-title'>
                                             {entry.title}
                                        </strong>
                                   </div>
                                   <div className='exam-intro__entry-duration'>
                                        {entry.duration}
                                   </div>
                              </div>
                              <div className='exam-intro__entry-body'>
                                   <p className='exam-intro__entry-prompt'>
                                        <strong>Prompt:</strong> {entry.prompt}
                                   </p>
                                   <div className='exam-intro__entry-tips'>
                                        <strong>Quick tips</strong>
                                        <ul>
                                             {entry.tips.map((t) => (
                                                  <li key={t}>{t}</li>
                                             ))}
                                        </ul>
                                   </div>
                              </div>
                         </div>
                    </div>
               ) : (
                    <>
                         <div className='exam-intro__grid'>
                              <div className='card'>
                                   <strong>Listening</strong>
                                   <p>
                                        Duration: ~30–40 minutes. 4 sections —
                                        conversations and monologues. Focus on
                                        keywords and note-taking.
                                   </p>
                              </div>
                              <div className='card'>
                                   <strong>Reading</strong>
                                   <p>
                                        Duration: 60 minutes. 3 passages with a
                                        variety of question types. Skim, scan,
                                        and manage time per passage.
                                   </p>
                              </div>
                              <div className='card'>
                                   <strong>Writing</strong>
                                   <p>
                                        Duration: 60 minutes. Task 1: data
                                        description (~20 mins). Task 2: essay
                                        (~40 mins). Plan and structure your
                                        answer.
                                   </p>
                              </div>
                              <div className='card'>
                                   <strong>Speaking</strong>
                                   <p>
                                        Duration: 11–14 minutes. Short
                                        interview, cue-card, and discussion.
                                        Speak clearly and develop answers with
                                        examples.
                                   </p>
                              </div>
                         </div>

                         <section className='exam-intro__tips'>
                              <h4>Top tips</h4>
                              <ul>
                                   <li>
                                        Read instructions for each question
                                        carefully.
                                   </li>
                                   <li>
                                        Manage your time and move on if a
                                        question takes too long.
                                   </li>
                                   <li>
                                        Plan Task 2 essays and use clear
                                        paragraphing.
                                   </li>
                              </ul>
                         </section>
                    </>
               )}

               <footer className='exam-intro__footer'>
                    <div>
                         Infractions while reading:{' '}
                         <strong>{infractions}</strong>
                    </div>
                    <small className='muted'>
                         Switching tabs or leaving this modal will increase the
                         infraction count.
                    </small>
               </footer>
          </div>
     )
}
