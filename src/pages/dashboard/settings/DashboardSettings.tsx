import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getCurrentUser } from '../../../lib/auth'
import DashboardHeader from '../../../components/DashboardHeader'
import {
     changePassword,
     requestPasswordResetCode,
     verifyPasswordResetCode,
} from '../../../lib/authApi'
import './settings.css'

const PASSWORD_RESET_SECONDS = 300

export default function DashboardSettings() {
     const user = getCurrentUser()
     const [notice, setNotice] = useState('')
     const [isSendingCode, setIsSendingCode] = useState(false)
     const [isVerifyingCode, setIsVerifyingCode] = useState(false)
     const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
     const [codeRequested, setCodeRequested] = useState(false)
     const [codeVerified, setCodeVerified] = useState(false)
     const [secondsLeft, setSecondsLeft] = useState(PASSWORD_RESET_SECONDS)
     const [resetCode, setResetCode] = useState('')
     const [newPassword, setNewPassword] = useState('')
     const [confirmPassword, setConfirmPassword] = useState('')

     useEffect(() => {
          if (!codeRequested) return

          const timer = window.setInterval(() => {
               setSecondsLeft((current) => {
                    if (current <= 1) {
                         window.clearInterval(timer)
                         setCodeRequested(false)
                         setCodeVerified(false)
                         setNotice(
                              'Your verification code expired. Request a new one.',
                         )
                         return 0
                    }
                    return current - 1
               })
          }, 1000)

          return () => window.clearInterval(timer)
     }, [codeRequested])

     if (!user) return null

     const requestCode = async () => {
          if (!user.token) {
               setNotice(
                    'Your session is no longer valid. Please sign in again.',
               )
               return
          }

          setIsSendingCode(true)
          setNotice('')
          try {
               const response = await requestPasswordResetCode(user.token)
               setCodeRequested(true)
               setCodeVerified(false)
               setResetCode('')
               setNewPassword('')
               setConfirmPassword('')
               setSecondsLeft(PASSWORD_RESET_SECONDS)
               setNotice(
                    response.message ??
                         'A verification code has been sent to your email.',
               )
          } catch (error) {
               setNotice(
                    error instanceof Error
                         ? error.message
                         : 'Unable to send the verification code.',
               )
          } finally {
               setIsSendingCode(false)
          }
     }

     const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          if (!user.token) {
               setNotice(
                    'Your session is no longer valid. Please sign in again.',
               )
               return
          }
          if (!resetCode.trim()) {
               setNotice('Enter the verification code sent to your email.')
               return
          }

          setIsVerifyingCode(true)
          setNotice('')
          try {
               const response = await verifyPasswordResetCode(
                    user.token,
                    resetCode.trim(),
               )
               setCodeVerified(true)
               setNotice(
                    response.message ??
                         'Code verified. Choose your new password.',
               )
          } catch (error) {
               setNotice(
                    error instanceof Error
                         ? error.message
                         : 'The verification code is invalid or has expired.',
               )
          } finally {
               setIsVerifyingCode(false)
          }
     }

     const submitPasswordChange = async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          if (!user.token) {
               setNotice(
                    'Your session is no longer valid. Please sign in again.',
               )
               return
          }
          if (!codeVerified) {
               setNotice('Verify the code first.')
               return
          }
          if (newPassword.length < 8) {
               setNotice('New password must be at least 8 characters long.')
               return
          }
          if (newPassword !== confirmPassword) {
               setNotice('Passwords do not match.')
               return
          }

          setIsUpdatingPassword(true)
          setNotice('')
          try {
               const response = await changePassword(user.token, {
                    code: resetCode.trim(),
                    password: newPassword,
               })
               setNotice(response.message ?? 'Your password has been updated.')
               setResetCode('')
               setNewPassword('')
               setConfirmPassword('')
               setCodeRequested(false)
               setCodeVerified(false)
               setSecondsLeft(PASSWORD_RESET_SECONDS)
          } catch (error) {
               setNotice(
                    error instanceof Error
                         ? error.message
                         : 'Unable to update your password.',
               )
          } finally {
               setIsUpdatingPassword(false)
          }
     }

     return (
          <main className='settings-page'>
               <DashboardHeader />
               <section className='settings-card'>
                    <p>ACCOUNT SETTINGS</p>
                    <h1>Manage your iMock account.</h1>
                    <div>
                         <span>Name</span>
                         <b>{user.name}</b>
                    </div>
                    <div>
                         <span>Email</span>
                         <b>{user.email || 'Not available'}</b>
                    </div>
                    <div>
                         <span>Sign-in method</span>
                         <b>{user.provider}</b>
                    </div>

                    {user.provider === 'password' ? (
                         <div className='password-form flex flex-col'>
                              <div className='password-header'>
                                   <h2>Change password</h2>
                              </div>
                              {codeRequested && (
                                   <p className='timer'>
                                        Code expires in{' '}
                                        {Math.floor(secondsLeft / 60)}:
                                        {String(secondsLeft % 60).padStart(
                                             2,
                                             '0',
                                        )}
                                   </p>
                              )}

                              {!codeVerified ? (
                                   <div>
                                        {!codeRequested ? (
                                             <p className='flex items-end gap-2 w-full'>
                                                  <button
                                                       type='button'
                                                       className='secondary-button'
                                                       onClick={requestCode}
                                                       disabled={
                                                            isSendingCode ||
                                                            codeRequested
                                                       }
                                                  >
                                                       {isSendingCode
                                                            ? 'Sending…'
                                                            : codeRequested
                                                              ? 'Code sent'
                                                              : 'Get code on your email'}
                                                  </button>
                                             </p>
                                        ) : (
                                             <form onSubmit={verifyCode}>
                                                  <label>
                                                       Verification code
                                                       <input
                                                            type='text'
                                                            inputMode='numeric'
                                                            maxLength={6}
                                                            value={resetCode}
                                                            onChange={(event) =>
                                                                 setResetCode(
                                                                      event.target.value
                                                                           .replace(
                                                                                /\D/g,
                                                                                '',
                                                                           )
                                                                           .slice(
                                                                                0,
                                                                                6,
                                                                           ),
                                                                 )
                                                            }
                                                            placeholder='123456'
                                                       />
                                                  </label>
                                                  <button
                                                       type='submit'
                                                       disabled={
                                                            isVerifyingCode
                                                       }
                                                  >
                                                       {isVerifyingCode
                                                            ? 'Verifying…'
                                                            : 'Verify code'}
                                                  </button>
                                             </form>
                                        )}
                                   </div>
                              ) : (
                                   <form onSubmit={submitPasswordChange}>
                                        <label>
                                             New password
                                             <input
                                                  type='password'
                                                  value={newPassword}
                                                  onChange={(event) =>
                                                       setNewPassword(
                                                            event.target.value,
                                                       )
                                                  }
                                                  placeholder='At least 8 characters'
                                             />
                                        </label>
                                        <label>
                                             Confirm password
                                             <input
                                                  type='password'
                                                  value={confirmPassword}
                                                  onChange={(event) =>
                                                       setConfirmPassword(
                                                            event.target.value,
                                                       )
                                                  }
                                                  placeholder='Repeat your new password'
                                             />
                                        </label>
                                        <button
                                             type='submit'
                                             disabled={isUpdatingPassword}
                                        >
                                             {isUpdatingPassword
                                                  ? 'Updating…'
                                                  : 'Update password'}
                                        </button>
                                   </form>
                              )}
                         </div>
                    ) : (
                         <p className='password-note'>
                              Password changes are only available for
                              email/password accounts.
                         </p>
                    )}

                    {notice && <p className='settings-notice'>{notice}</p>}
               </section>
          </main>
     )
}
