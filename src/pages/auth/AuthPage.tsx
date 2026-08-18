import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { startSession } from '../../lib/auth'
import { requestPhoneOtp, verifyPhoneOtp } from '../../lib/authApi'
import './auth.css'

type AuthMode = 'sign-in' | 'sign-up'
type Method = 'password' | 'phone'

function getRedirectPath(search: string) {
     const redirect = new URLSearchParams(search).get(
          'redirect',
     )
     return redirect?.startsWith('/') ? redirect : '/#book'
}

export default function AuthPage() {
     const navigate = useNavigate()
     const location = useLocation()
     const [mode, setMode] = useState<AuthMode>('sign-in')
     const [method, setMethod] = useState<Method>('password')
     const [notice, setNotice] = useState('')
     const [phone, setPhone] = useState('')
     const [otpRequested, setOtpRequested] = useState(false)
     const [isRequestingOtp, setIsRequestingOtp] = useState(false)
     const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

     const finishAuth = (
          name: string,
          provider: 'password' | 'phone' | 'google',
     ) => {
          startSession({ name, provider })
          navigate(getRedirectPath(location.search))
     }

     const submitPassword = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget)
          const name = String(
               values.get('name') || values.get('username') || 'iMock learner',
          ).trim()
          finishAuth(name, 'password')
     }

     const requestOtp = async () => {
          const normalizedPhone = phone.trim()
          if (normalizedPhone.length < 7) {
               setNotice('Enter a valid phone number, including its country code.')
               return
          }
          setIsRequestingOtp(true)
          setNotice('')
          try {
               const response = await requestPhoneOtp(normalizedPhone, mode)
               setOtpRequested(true)
               setNotice(response.message ?? 'Your verification code has been sent.')
          } catch (error) {
               setNotice(error instanceof Error ? error.message : 'Unable to send a verification code.')
          } finally {
               setIsRequestingOtp(false)
          }
     }

     const submitPhone = async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget)
          const code = String(values.get('code') || '').trim()
          if (!otpRequested) {
               setNotice('Request a verification code before continuing.')
               return
          }
          setIsVerifyingOtp(true)
          setNotice('')
          try {
               const response = await verifyPhoneOtp(phone.trim(), code, mode)
               finishAuth(response.user?.name ?? response.user?.phone ?? phone.trim(), 'phone')
          } catch (error) {
               setNotice(error instanceof Error ? error.message : 'The verification code could not be confirmed.')
          } finally {
               setIsVerifyingOtp(false)
          }
     }

     const handleGoogleLogin = () => {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

          if (!clientId) {
               setNotice(
                    'Google sign-in needs VITE_GOOGLE_CLIENT_ID before it can be enabled.',
               )
               return
          }

          window.location.assign(
               `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth`)}&response_type=token&scope=openid%20email%20profile`,
          )
     }

     return (
          <main className='auth-page'>
               <Link className='auth-brand' to='/'>
                    <i>i</i>mock<span>.</span>
               </Link>
               <section
                    className='auth-card'
                    aria-labelledby='auth-title'
               >
                    <p className='auth-kicker'>
                         YOUR IELTS JOURNEY STARTS HERE
                    </p>
                    <h1 id='auth-title'>
                         {mode === 'sign-in'
                              ? 'Welcome back.'
                              : 'Create your account.'}
                    </h1>
                    <p className='auth-intro'>
                         {mode === 'sign-in'
                              ? 'Sign in to book your mock test.'
                              : 'Join iMock to book a test, receive feedback, and track your progress.'}
                    </p>

                    <div
                         className='auth-tabs'
                         role='tablist'
                         aria-label='Authentication type'
                    >
                         <button
                              className={mode === 'sign-in' ? 'active' : ''}
                              onClick={() => setMode('sign-in')}
                              type='button'
                         >
                              Sign in
                         </button>
                         <button
                              className={mode === 'sign-up' ? 'active' : ''}
                              onClick={() => setMode('sign-up')}
                              type='button'
                         >
                              Register
                         </button>
                    </div>

                    <button
                         className='google-button'
                         type='button'
                         onClick={handleGoogleLogin}
                    >
                         <span className='google-mark'>G</span> Continue with
                         Google
                    </button>
                    <div className='auth-divider'>
                         <span>or continue with</span>
                    </div>

                    <div className='method-switch'>
                         <button
                              className={
                                   method === 'password' ? 'selected' : ''
                              }
                              type='button'
                              onClick={() => setMethod('password')}
                         >
                              Username & password
                         </button>
                         <button
                              className={method === 'phone' ? 'selected' : ''}
                              type='button'
                              onClick={() => setMethod('phone')}
                         >
                              Phone number
                         </button>
                    </div>

                    {method === 'password' ? (
                         <form
                              className='auth-form'
                              onSubmit={submitPassword}
                         >
                              {mode === 'sign-up' && (
                                   <label>
                                        Full name
                                        <input
                                             name='name'
                                             autoComplete='name'
                                             required
                                             placeholder='Your name'
                                        />
                                   </label>
                              )}
                              <label>
                                   Username
                                   <input
                                        name='username'
                                        autoComplete='username'
                                        required
                                        placeholder='Choose a username'
                                   />
                              </label>
                              <label>
                                   Password
                                   <input
                                        name='password'
                                        autoComplete={
                                             mode === 'sign-in'
                                                  ? 'current-password'
                                                  : 'new-password'
                                        }
                                        type='password'
                                        minLength={8}
                                        required
                                        placeholder='At least 8 characters'
                                   />
                              </label>
                              {mode === 'sign-up' && (
                                   <label>
                                        Email address
                                        <input
                                             name='email'
                                             autoComplete='email'
                                             type='email'
                                             required
                                             placeholder='you@example.com'
                                        />
                                   </label>
                              )}
                              <button
                                   className='auth-submit'
                                   type='submit'
                              >
                                   {mode === 'sign-in'
                                        ? 'Sign in'
                                        : 'Create account'}
                              </button>
                         </form>
                    ) : (
                         <form
                              className='auth-form'
                              onSubmit={submitPhone}
                         >
                              <label>
                                   Phone number
                                   <input
                                        name='phone'
                                        autoComplete='tel'
                                        inputMode='tel'
                                        required
                                        value={phone}
                                        onChange={(event) => {
                                             setPhone(event.target.value)
                                             setOtpRequested(false)
                                        }}
                                        placeholder='+98 912 123 4567'
                                   />
                              </label>
                              <button
                                   className='otp-request'
                                   type='button'
                                   onClick={requestOtp}
                                   disabled={isRequestingOtp}
                              >
                                   {isRequestingOtp
                                        ? 'Sending code…'
                                        : otpRequested
                                          ? 'Resend verification code'
                                          : 'Get verification code'}
                              </button>
                              {otpRequested && (
                                   <label>
                                        Verification code
                                        <input
                                             name='code'
                                             autoComplete='one-time-code'
                                             inputMode='numeric'
                                             pattern='[0-9]{6}'
                                             maxLength={6}
                                             required
                                             placeholder='Enter the 6-digit SMS code'
                                        />
                                   </label>
                              )}
                              <button
                                   className='auth-submit'
                                   type='submit'
                                   disabled={!otpRequested || isVerifyingOtp}
                              >
                                   {isVerifyingOtp
                                        ? 'Verifying…'
                                        : 'Verify and continue'}
                              </button>
                         </form>
                    )}

                    {notice && (
                         <p
                              className='auth-notice'
                              role='status'
                         >
                              {notice}
                         </p>
                    )}
                    <p className='auth-terms'>
                         By continuing, you agree to iMock’s Terms of Service
                         and Privacy Policy.
                    </p>
               </section>
          </main>
     )
}
