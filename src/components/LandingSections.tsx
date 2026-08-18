import './process-section.css'

type ArrowProps = { className?: string }

export const Arrow = ({ className }: ArrowProps) => (
     <span
          className={className ?? 'arrow'}
          aria-hidden='true'
     >
          &rarr;
     </span>
)
export const Check = () => (
     <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
     >
          <path d='m5 12 4.2 4.2L19 6.7' />
     </svg>
)
const Star = () => (
     <svg
          viewBox='0 0 24 24'
          aria-hidden='true'
     >
          <path d='m12 3 2.78 5.63 6.22.91-4.5 4.38 1.06 6.18L12 17.18 6.44 20.1 7.5 13.92 3 9.54l6.22-.91L12 3Z' />
     </svg>
)

const ProcessIcon = ({ step }: { step: string }) => {
     const shared = {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
     }

     if (step === '01') {
          return (
               <svg
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                    {...shared}
               >
                    <rect
                         x='8'
                         y='5'
                         width='16'
                         height='22'
                         rx='2'
                    />
                    <path d='M12 5.5h8v3h-8zM12 14h8M12 19h5M12 23l1.5 1.5L17 21' />
               </svg>
          )
     }

     if (step === '02') {
          return (
               <svg
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                    {...shared}
               >
                    <path d='M7 26V7h18v19H7Z' />
                    <path d='M12 21v-4M16 21v-8M20 21v-11M11 10h10' />
               </svg>
          )
     }

     return (
          <svg
               viewBox='0 0 32 32'
               aria-hidden='true'
               {...shared}
          >
               <path d='M7 24 13 18l4 3 8-10M20 11h5v5' />
               <path d='M7 7v18h18' />
          </svg>
     )
}

export function HeroSection() {
     const skills = ['Listening', 'Reading', 'Writing', 'Speaking']
     const scores = [7.5, 7, 6.5, 7]
     const progress = [90, 80, 66, 78]
     return (
          <>
               <section className='hero-section container'>
                    <div className='hero-copy'>
                         <p className='eyebrow'>
                              <span /> IELTS preparation, made personal
                         </p>
                         <h1>
                              Know your score.
                              <br />
                              <em>Own</em> your next move.
                         </h1>
                         <p className='hero-description'>
                              A realistic IELTS mock test with the human
                              feedback, clear score insights, and expert support
                              you need to move forward with confidence.
                         </p>
                         <div className='hero-actions'>
                              <a
                                   className='button button-primary'
                                   href='#book'
                              >
                                   Take a mock test <Arrow />
                              </a>
                              <a
                                   className='button button-text'
                                   href='#how-it-works'
                              >
                                   See how it works{' '}
                                   <span className='play'>&#9654;</span>
                              </a>
                         </div>
                         <div className='trust-row'>
                              <div className='avatar-stack'>
                                   <b>R</b>
                                   <b>M</b>
                                   <b>S</b>
                                   <b>+</b>
                              </div>
                              <div>
                                   <div className='stars'>
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                   </div>
                                   <span>Trusted by 2,500+ IELTS learners</span>
                              </div>
                         </div>
                    </div>
                    <div className='hero-visual'>
                         <div className='sun-shape' />
                         <div className='score-card'>
                              <div className='report-top'>
                                   <span>Your mock result</span>
                                   <span className='report-date'>
                                        17 Aug, 2026
                                   </span>
                              </div>
                              <div className='score-main'>
                                   <div>
                                        <small>Overall band</small>
                                        <strong>7.0</strong>
                                        <span>Great progress!</span>
                                   </div>
                                   <div className='score-ring'>
                                        <span>
                                             7<small>.0</small>
                                        </span>
                                   </div>
                              </div>
                              <div className='skill-scores'>
                                   {skills.map((skill, index) => (
                                        <div key={skill}>
                                             <span>{skill}</span>
                                             <b>{scores[index]}</b>
                                             <i>
                                                  <i
                                                       style={{
                                                            width: `${progress[index]}%`,
                                                       }}
                                                  />
                                             </i>
                                        </div>
                                   ))}
                              </div>
                              <div className='report-note'>
                                   <span>&#10022;</span>
                                   <p>
                                        <b>Teacher's note</b>Your ideas are
                                        strong. Let's make your task responses
                                        more precise.
                                   </p>
                              </div>
                         </div>
                         <div className='floating-tag tag-one'>
                              <span>Detailed feedback</span>
                         </div>
                         <div className='floating-tag tag-two'>
                              <span>&#10003;</span> Official-style scoring
                         </div>
                    </div>
               </section>
               <section className='intro-strip'>
                    <div className='container'>
                         <p>More than a practice test</p>
                         <h2>
                              We turn every mock into a clear path to your
                              target band.
                         </h2>
                         <a
                              href='#how-it-works'
                              style={{
                                   width: 'fit-content',
                                   padding: '12px 18px',
                                   borderRadius: '3px',
                                   background: '#fffaf0',
                                   color: '#245d50',
                                   fontFamily: 'serif',
                                   fontSize: '15px',
                                   fontWeight: 600,
                                   letterSpacing: '-0.2px',
                                   boxShadow: '0 8px 16px rgb(0 0 0 / 14%)',
                              }}
                         >
                              Discover the iMock experience <Arrow />
                         </a>
                    </div>
               </section>
          </>
     )
}

export function ProcessSection() {
     const steps = [
          [
               '01',
               '▤',
               'Take the test',
               'Experience a full IELTS mock designed to feel just like test day — alone or with your class.',
               '#book',
               'Explore mock tests',
          ],
          [
               '02',
               '⌁',
               'Get the full picture',
               'Receive a precise band score and detailed feedback across every skill, not just a number.',
               '#report',
               'See a sample report',
          ],
          [
               '03',
               '◌',
               'Grow with guidance',
               'Turn feedback into action with practical improvement steps and a one-to-one teacher review.',
               '#teachers',
               'Meet our teachers',
          ],
     ]
     return (
          <section
               className='process-section container'
               id='how-it-works'
          >
               <div className='section-heading'>
                    <div>
                         <p className='eyebrow'>
                              <span /> A better way to prepare
                         </p>
                         <h2>
                              Practice with purpose.
                              <br />
                              <em>Progress</em> with clarity.
                         </h2>
                    </div>
               </div>
               <div className='process-grid'>
                    {steps.map(([number, , title, body, href, link], index) => (
                         <article
                              key={number}
                              style={{
                                   minHeight: 300,
                                   display: 'flex',
                                   flexDirection: 'column',
                                   padding: '26px',
                                   border: '1px solid #dce6df',
                                   borderTop: '3px solid #245d50',
                                   borderRadius: '8px',
                                   background: '#f5f8f4',
                                   boxShadow: '0 10px 24px rgb(24 51 45 / 6%)',
                                   position: 'relative',
                              }}
                         >
                              {index < steps.length - 1 && (
                                   <span
                                        className='process-connector'
                                        aria-hidden='true'
                                        style={{
                                             position: 'absolute',
                                             top: '50%',
                                             right: '-43px',
                                             zIndex: 1,
                                             color: '#ec7053',
                                             fontFamily: 'Georgia, serif',
                                             fontSize: '28px',
                                             fontWeight: 600,
                                             transform: 'translateY(-50%)',
                                        }}
                                   >
                                        &rarr;
                                   </span>
                              )}
                              <div
                                   className='line-icon'
                                   style={{ color: '#ec7053' }}
                              >
                                   <span
                                        style={{
                                             display: 'inline-flex',
                                             width: 40,
                                             height: 40,
                                        }}
                                   >
                                        <ProcessIcon step={number} />
                                   </span>
                              </div>
                              <h3>{title}</h3>
                              <p>{body}</p>
                              <a
                                   href={href}
                                   style={{ marginTop: 'auto' }}
                              >
                                   {link} <Arrow />
                              </a>
                         </article>
                    ))}
               </div>
          </section>
     )
}

export function ReportSection() {
     return (
          <section
               className='report-section'
               id='report'
          >
               <div className='container report-layout'>
                    <div className='report-art'>
                         <div className='paper'>
                              <div className='paper-head'>
                                   <span className='mini-logo'>imock.</span>
                                   <span>Performance report</span>
                              </div>
                              <h3>Hi, Maryam!</h3>
                              <p>
                                   Here’s where you are — and where you can go
                                   next.
                              </p>
                              <div className='paper-score'>
                                   <b>6.5</b>
                                   <span>
                                        Current
                                        <br />
                                        band score
                                   </span>
                                   <i>&rarr;</i>
                                   <b className='target'>7.5</b>
                                   <span>
                                        Target
                                        <br />
                                        band score
                                   </span>
                              </div>
                              <div className='feedback-bar'>
                                   <b>What to focus on</b>
                                   <span>Writing task response</span>
                                   <i />
                              </div>
                         </div>
                         <div className='scribble'>
                              Your next
                              <br />
                              <em>breakthrough</em>
                              <br />
                              starts here. <span>near</span>
                         </div>
                    </div>
                    <div className='report-copy'>
                         <p className='eyebrow'>
                              <span /> Feedback you can use
                         </p>
                         <h2>Your result is the start of the conversation.</h2>
                         <p>
                              Our reports go beyond scores. We show you exactly
                              what held you back, what you did well, and the
                              practical changes that will make the biggest
                              difference.
                         </p>
                         <ul>
                              <li>
                                   <Check /> Examiner-style comments on your
                                   writing and speaking
                              </li>
                              <li>
                                   <Check /> Skill-by-skill strengths and
                                   opportunity areas
                              </li>
                              <li>
                                   <Check /> A personal improvement plan for
                                   your next test
                              </li>
                         </ul>
                         <a
                              className='button button-dark'
                              href='#book'
                         >
                              Get your detailed report <Arrow />
                         </a>
                    </div>
               </div>
          </section>
     )
}

export function TeachersSection() {
     const teachers = [
          ['SM', 'Dr. Hossein Ardestani', 'lavender'],
          ['AN', 'Amir Nasiri', 'peach'],
          ['LA', 'Laleh Ahmadi', 'mint'],
     ]
     return (
          <section
               className='teachers-section container'
               id='teachers'
          >
               <div className='teachers-heading'>
                    <p className='eyebrow'>
                         <span /> Meet your mentors
                    </p>
                    <h2>
                         Real expertise.
                         <br />
                         <em>Real</em> encouragement.
                    </h2>
                    <p>
                         The best feedback comes from people who understand your
                         goals. Our IELTS specialists are here to help you make
                         sense of every result.
                    </p>
                    <a href='#book'>
                         Meet the full team <Arrow />
                    </a>
               </div>
               <div className='teacher-list'>
                    {teachers.map(([initials, name, tone]) => (
                         <article
                              className='teacher-card'
                              key={name}
                         >
                              <div className={`teacher-portrait ${tone}`}>
                                   <span>{initials}</span>
                                   <i>&#10022;</i>
                              </div>
                              <h3>{name}</h3>
                              <a href='#book'>
                                   Book a review <Arrow />
                              </a>
                         </article>
                    ))}
               </div>
          </section>
     )
}

export function GroupAndBookingSections() {
     return (
          <>
               <section
                    className='schools-section'
                    id='for-schools'
               >
                    <div className='container schools-card'>
                         <div>
                              <p className='eyebrow'>
                                   <span /> Made for learning together
                              </p>
                              <h2>Bring iMock to your classroom.</h2>
                              <p>
                                   Give your students a meaningful benchmark,
                                   and give your team clear insights into how
                                   every learner is progressing.
                              </p>
                              <a
                                   className='button button-cream'
                                   href='mailto:hello@imock.ir'
                              >
                                   Talk to us about group mocks <Arrow />
                              </a>
                         </div>
                         <div className='classroom-art'>
                              <div className='class-card one'>
                                   Student progress
                                   <br />
                                   <b>+0.5</b> band average
                              </div>
                              <div className='class-card two'>
                                   <span>24</span>
                                   <br />
                                   learners assessed
                              </div>
                              <div className='class-grid'>
                                   <i />
                                   <i />
                                   <i />
                                   <i />
                              </div>
                         </div>
                    </div>
               </section>
               <section
                    className='booking-section container'
                    id='book'
               >
                    <p className='eyebrow'>
                         <span /> Your next step
                    </p>
                    <h2>
                         Ready to see what
                         <br />
                         you’re capable of?
                    </h2>
                    <p>
                         Take a mock, get real feedback, and have a teacher in
                         your corner.
                    </p>
                    <a
                         className='button button-primary'
                         href='mailto:hello@imock.ir?subject=I%20want%20to%20book%20an%20IELTS%20mock'
                    >
                         Book your mock test <Arrow />
                    </a>
               </section>
          </>
     )
}
