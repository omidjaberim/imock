import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getCurrentUser, endSession } from '../lib/auth'
import './dashboard-header.css'

type DashboardHeaderProps = {
     children?: ReactNode
     brandTo?: string
     backTo?: string
     backLabel?: string
     className?: string
}

export default function DashboardHeader({
     children,
     brandTo = '/dashboard',
     backTo,
     backLabel = '← Back to dashboard',
     className = 'dashboard-header',
}: DashboardHeaderProps) {
     const user = getCurrentUser()
     const navigate = useNavigate()

     const [profileMenuState, setProfileMenuState] = useState<'closed' | 'open' | 'closing'>('closed')
     const profileMenuRef = useRef<HTMLDivElement | null>(null)

     useEffect(() => {
          const closeProfileMenu = (event: MouseEvent) => {
               if (!profileMenuRef.current?.contains(event.target as Node)) {
                    setProfileMenuState((state) => (state === 'open' ? 'closing' : state))
               }
          }
          const closeOnEscape = (event: KeyboardEvent) => {
               if (event.key === 'Escape') setProfileMenuState((state) => (state === 'open' ? 'closing' : state))
          }

          document.addEventListener('mousedown', closeProfileMenu)
          document.addEventListener('keydown', closeOnEscape)
          return () => {
               document.removeEventListener('mousedown', closeProfileMenu)
               document.removeEventListener('keydown', closeOnEscape)
          }
     }, [])

     const logout = () => {
          endSession()
          navigate('/', { replace: true })
     }

     return (
          <header className={className}>
               <Link to={brandTo} className='dashboard-brand'>
                    <i>i</i>mock<span>.</span>
               </Link>

               {/* If caller supplied custom right-side content, render that; otherwise render profile area */}
               {children ?? (
                    <>
                         {user ? (
                              <div className='dashboard-user'>
                                   <span>Welcome, {user.name}</span>
                                   <div className='profile-menu-wrap' ref={profileMenuRef}>
                                        <button
                                             className='avatar-button'
                                             type='button'
                                             aria-label='Open profile menu'
                                             aria-expanded={profileMenuState === 'open'}
                                             onClick={() => setProfileMenuState((state) => (state === 'open' ? 'closing' : 'open'))}
                                        >
                                             <b>{user.name.slice(0, 1).toUpperCase()}</b>
                                        </button>
                                        {profileMenuState !== 'closed' && (
                                             <div
                                                  className={`profile-menu${profileMenuState === 'closing' ? ' is-closing' : ''}`}
                                                  role='menu'
                                                  onAnimationEnd={() => {
                                                       if (profileMenuState === 'closing') setProfileMenuState('closed')
                                                  }}
                                             >
                                                  <div className='profile-menu-user'>
                                                       <b>{user.name}</b>
                                                       <span>iMock learner</span>
                                                  </div>
                                                  <Link to='/dashboard/settings' role='menuitem'>Account settings</Link>
                                                  <Link to='/dashboard/tests' role='menuitem'>Tests &amp; results</Link>
                                                  <Link to='/dashboard/classrooms/new' role='menuitem'>My classrooms</Link>
                                                  <a href='mailto:hello@imock.ir' role='menuitem'>Help &amp; support</a>
                                                  <button className='profile-logout' type='button' role='menuitem' onClick={logout}>Log out <span>→</span></button>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         ) : backTo ? (
                              <Link to={backTo} className='dashboard-header-back'>
                                   {backLabel}
                              </Link>
                         ) : null}
                    </>
               )}
          </header>
     )
}
