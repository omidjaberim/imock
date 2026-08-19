import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '../../../lib/analytics'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { endSession, getCurrentUser } from '../../../lib/auth'
import { Footer } from '../../../components/SiteChrome'
import './dashboard.css'
import './dashboard-animations.css'
import './dashboard-practice.css'
import './dashboard-full-exam.css'
import './dashboard-classroom.css'
import './dashboard-profile.css'
import './dashboard-profile-exit.css'

function PracticeIcon({ skill }: { skill: string }) {
     // Use the same simple emoji-style icons as the Complete mock table so the visuals match.
     const map: Record<string, string> = {
          Listening: '🎧',
          Reading: '📖',
          Writing: '✍️',
          Speaking: '🗣️',
     }
     const icon = map[skill] || '📚'
     return (
          <span aria-hidden='true' style={{ fontSize: 20, lineHeight: 1 }}>
               {icon}
          </span>
     )
}

export default function DashboardLanding() {
     const user = getCurrentUser()
     const navigate = useNavigate()
     const [profileMenuState, setProfileMenuState] = useState<
          'closed' | 'open' | 'closing'
     >('closed')
     const profileMenuRef = useRef<HTMLDivElement>(null)
  
     useEffect(() => {
          const closeProfileMenu = (event: MouseEvent) => {
               if (!profileMenuRef.current?.contains(event.target as Node)) {
                    setProfileMenuState((state) =>
                         state === 'open' ? 'closing' : state,
                    )
               }
          }
          const closeOnEscape = (event: KeyboardEvent) => {
               if (event.key === 'Escape')
                    setProfileMenuState((state) =>
                         state === 'open' ? 'closing' : state,
                    )
          }

          document.addEventListener('mousedown', closeProfileMenu)
          document.addEventListener('keydown', closeOnEscape)
          return () => {
               document.removeEventListener('mousedown', closeProfileMenu)
               document.removeEventListener('keydown', closeOnEscape)
          }
     }, [])

     if (!user)
          return (
               <Navigate
                    to='/auth'
                    replace
               />
          )

     const logout = () => {
          endSession()
          navigate('/', { replace: true })
     }

     return (
          <>
               <main className='dashboard-page'>
                    <header className='dashboard-header'>
                         <Link
                              to='/'
                              className='dashboard-brand'
                         >
                              <i>i</i>mock<span>.</span>
                         </Link>
                         <div className='dashboard-user'>
                              <span>Welcome, {user.name}</span>
                              <div
                                   className='profile-menu-wrap'
                                   ref={profileMenuRef}
                              >
                                   <button
                                        className='avatar-button'
                                        type='button'
                                        aria-label='Open profile menu'
                                        aria-expanded={
                                             profileMenuState === 'open'
                                        }
                                        onClick={() =>
                                             setProfileMenuState((state) =>
                                                  state === 'open'
                                                       ? 'closing'
                                                       : 'open',
                                             )
                                        }
                                   >
                                        <b>
                                             {user.name
                                                  .slice(0, 1)
                                                  .toUpperCase()}
                                        </b>
                                   </button>
                                   {profileMenuState !== 'closed' && (
                                        <div
                                             className={`profile-menu${profileMenuState === 'closing' ? ' is-closing' : ''}`}
                                             role='menu'
                                             onAnimationEnd={() => {
                                                  if (
                                                       profileMenuState ===
                                                       'closing'
                                                  )
                                                       setProfileMenuState(
                                                            'closed',
                                                       )
                                             }}
                                        >
                                             <div className='profile-menu-user'>
                                                  <b>{user.name}</b>
                                                  <span>iMock learner</span>
                                             </div>
                                             <Link
                                                  to='/dashboard/settings'
                                                  role='menuitem'
                                                  onClick={() =>
                                                       setProfileMenuState(
                                                            'closing',
                                                       )
                                                  }
                                             >
                                                  Account settings
                                             </Link>
                                             <Link
                                                  to='/dashboard/tests'
                                                  role='menuitem'
                                                  onClick={() =>
                                                       setProfileMenuState(
                                                            'closing',
                                                       )
                                                  }
                                             >
                                                  Tests &amp; results
                                             </Link>
                                             <Link
                                                  to='/dashboard/classrooms/new'
                                                  role='menuitem'
                                                  onClick={() =>
                                                       setProfileMenuState(
                                                            'closing',
                                                       )
                                                  }
                                             >
                                                  My classrooms
                                             </Link>
                                             <a
                                                  href='mailto:hello@imock.ir'
                                                  role='menuitem'
                                             >
                                                  Help &amp; support
                                             </a>
                                             <button
                                                  className='profile-logout'
                                                  type='button'
                                                  role='menuitem'
                                                  onClick={logout}
                                             >
                                                  Log out <span>→</span>
                                             </button>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </header>
                    <section className='dashboard-hero'>
                         <p className='eyebrow'>YOUR IELTS COMMAND CENTRE</p>
                         <h1>
                              Ready to make your
                              <br />
                              <em>next score</em> happen?
                              <br />
                         </h1>
                         <p>
                              Build confidence with structured practice, expert
                              feedback, and mock tests that feel like the real
                              thing.
                         </p>
                         <button
                              type='button'
                              onClick={() => { const target = '/dashboard/exams/complete'; trackEvent('exam_page_open', { target, skill: 'complete' }); navigate(target); }}
                         >
                              Take a mock test <span>→</span>
                         </button>
                         <div className='hero-orbit one' />
                         <div className='hero-orbit two'>
                              <div className='orbit-learning-steps'>
                                   {[
                                        'Speaking',
                                        'Writing',
                                        'Listening',
                                        'Reading',
                                   ].map((skill) => (
                                        <span key={skill}>{skill}</span>
                                   ))}
                              </div>
                         </div>
                         <div
                              className='hero-orbit three'
                              style={{
                                   width: 380,
                                   height: 380,
                                   right: -40,
                                   top: -35,
                                   borderColor: '#6e85a9',
                                   animationDelay: '-1.25s',
                              }}
                         />
                         <div
                              className='hero-orbit four'
                              style={{
                                   width: 190,
                                   height: 190,
                                   right: 56,
                                   top: 58,
                                   borderColor: '#ffd583',
                                   animationDelay: '-3.75s',
                              }}
                         />
                    </section>
                    <section className='dashboard-content'>
                         <div className='section-heading '>
                              <div>
                                   <p className='eyebrow'>PRACTICE STUDIO</p>
                                   <h2>Grow a little every day</h2>
                              </div>
                         </div>
                         <div className='practice-grid'>
                              {[
                                   [
                                        'Speaking',
                                        'Build fluency with timed prompts.',
                                   ],
                                   ['Writing', 'Sharpen ideas and structure.'],
                                   [
                                        'Listening',
                                        'Train your ear for every accent.',
                                   ],
                                   ['Reading', 'Read faster, answer smarter.'],
                              ].map(([title, detail]) => (
                                   <article key={title}>
                                        <div
                                             style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 10,
                                             }}
                                        >
                                             <span
                                                  aria-hidden='true'
                                                  style={{
                                                       display: 'grid',
                                                       placeItems: 'center',
                                                       width: 38,
                                                       height: 38,
                                                       color: '#172f58',
                                                  }}
                                             >
                                                  <PracticeIcon skill={title} />
                                             </span>
                                             <h2 style={{ margin: 0 }}>
                                                  {title}
                                             </h2>
                                        </div>
                                        <p>{detail}</p>
                                        <button
                                             className='practice-button'
                                            type='button'
                                            onClick={() => {
                                                 const target = `/dashboard/exams/${title.toLowerCase()}`
                                                 if (title.toLowerCase() === 'reading') {
                                                      // for reading, navigate directly to the reading page and show modal there
                                                      trackEvent('exam_page_open', { target, skill: title })
                                                      navigate(target)
                                                 } else {
                                                      // navigate to the skill-specific page — modal will open from that page's Start button
                                                      trackEvent('exam_page_open', { target, skill: title })
                                                      navigate(target)
                                                 }
                                            }}
                                        >
                                            Start {title} exam <span>→</span>
                                        </button>
                                   </article>
                              ))}
                         </div>

                         <section className='full-exam-card'>
                              <div>
                                   <p className='eyebrow'>FULL MOCK TEST</p>
                                   <h2>
                                        Ready for the complete IELTS experience?
                                   </h2>
                                   <p>
                                        Take all four skills in one timed mock
                                        exam and get a clear picture of your
                                        progress.
                                   </p>
                              </div>
                              <button
                                   className='full-exam-button'
                                   type='button'
                                   onClick={() => { const target = '/dashboard/exams/complete'; trackEvent('exam_page_open', { target, skill: 'complete' }); navigate(target) }}
                              >
                                   Start complete IELTS exam <span>→</span>
                              </button>
                         </section>

                         <section className='classroom-card'>
                              <div
                                   className='classroom-visual'
                                   aria-hidden='true'
                              >
                                   <span>24</span>
                                   <small>learners</small>
                                   <i className='classroom-dot dot-one' />
                                   <i className='classroom-dot dot-two' />
                                   <i className='classroom-dot dot-three' />
                              </div>
                              <div className='classroom-copy'>
                                   <p className='eyebrow'>
                                        FOR TEACHERS &amp; INSTITUTIONS
                                   </p>
                                   <h2>
                                        Bring your whole classroom to exam day.
                                   </h2>
                                   <p>
                                        Create a private classroom, invite your
                                        learners, and schedule one shared IELTS
                                        mock exam. Everyone receives the same
                                        experience, while you get a clear view
                                        of the class’s progress in one place.
                                   </p>
                                   <ul>
                                        <li>
                                             Invite learners with a private
                                             class link
                                        </li>
                                        <li>
                                             Set a date and start time for the
                                             whole group
                                        </li>
                                        <li>
                                             Review class-level results after
                                             the exam
                                        </li>
                                   </ul>
                                   <Link
                                        className='classroom-button'
                                        to='/dashboard/classrooms/new'
                                   >
                                        Create a classroom <span>→</span>
                                   </Link>
                              </div>
                         </section>
                    </section>

                    <Footer />
               </main>
          </>
     )
}
