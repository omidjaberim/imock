import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader'
import { getCurrentUser } from '../../../lib/auth'
import { toast } from 'react-toastify'
import './classroom.css'

export default function ClassroomSetup() {
     const user = getCurrentUser()

     if (!user) return null

     const [step, setStep] = useState<number>(1)
     const [className, setClassName] = useState<string>('')
     const [tutorName, setTutorName] = useState<string>(user?.name || '')
     const [students, setStudents] = useState<string[]>([])
     const [studentInput, setStudentInput] = useState<string>('')
     const [schedule, setSchedule] = useState<string>('')

     // Helper to produce a `datetime-local`-compatible string for the local time
     const getDateTimeLocalNow = () => {
          const d = new Date()
          d.setSeconds(0, 0)
          const tzOffset = d.getTimezoneOffset()
          const local = new Date(d.getTime() - tzOffset * 60000)
          return local.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:MM"
     }

     const [minSchedule, setMinSchedule] = useState<string>(
          getDateTimeLocalNow(),
     )

     // keep the minSchedule updated (every minute) so the picker does not allow past times
     useEffect(() => {
          const id = setInterval(
               () => setMinSchedule(getDateTimeLocalNow()),
               60000,
          )
          return () => clearInterval(id)
     }, [])

     const [savedClasses, setSavedClasses] = useState<any[]>([])
     const [loadingSaved, setLoadingSaved] = useState(false)
     const [examModalOpen, setExamModalOpen] = useState(false)
     const [examTab, setExamTab] = useState<'upcoming' | 'history'>('upcoming')
     const [examItems, setExamItems] = useState<any[]>([])
     const [loadingExams, setLoadingExams] = useState(false)

     // Load saved classes on first render so the inline list is populated immediately
     useEffect(() => {
          let mounted = true
          ;(async () => {
               try {
                    setLoadingSaved(true)
                    const list = await loadClassesList()
                    if (mounted) setSavedClasses(list || [])
               } catch (err) {
                    // loadClassesList already shows a toast on failure
               } finally {
                    if (mounted) setLoadingSaved(false)
               }
          })()
          return () => {
               mounted = false
          }
     }, [])

     // track loaded saved id so Save becomes Update
     const [loadedSavedId, setLoadedSavedId] = useState<string | null>(null)

     const confirmDeleteToast = (label: string, onConfirm: () => void) => {
          toast(
               ({ closeToast }) => (
                    <div style={{ display: 'grid', gap: 12 }}>
                         <div style={{ fontWeight: 800, color: '#17233d' }}>
                              {label}
                         </div>
                         <div style={{ color: '#54657b', fontSize: 13 }}>
                              This action cannot be undone.
                         </div>
                         <div className='toast-confirm-actions'>
                              <button
                                   type='button'
                                   className='toast-confirm-btn toast-confirm-btn--secondary'
                                   onClick={closeToast}
                              >
                                   Cancel
                              </button>
                              <button
                                   type='button'
                                   className='toast-confirm-btn toast-confirm-btn--primary'
                                   onClick={() => {
                                        closeToast()
                                        onConfirm()
                                   }}
                              >
                                   Delete
                              </button>
                         </div>
                    </div>
               ),
               {
                    closeOnClick: false,
                    closeButton: false,
                    className: 'toast-confirm',
                    autoClose: false,
                    position: 'top-right',
               },
          )
     }

     const formatExamType = (examType?: string) => {
          const value = (examType || 'complete').toLowerCase()
          const labels: Record<string, string> = {
               complete: 'Complete IELTS mock',
               listening: 'Listening IELTS mock',
               reading: 'Reading IELTS mock',
               speaking: 'Speaking IELTS mock',
               writing: 'Writing IELTS mock',
          }
          return labels[value] || 'Complete IELTS mock'
     }

     const openExamModal = async () => {
          setExamModalOpen(true)
          setExamTab('upcoming')
          setLoadingExams(true)
          try {
               const auth = getCurrentUser()
               const token = auth?.token
               const hdrs: any = {}
               if (token) hdrs.Authorization = 'Bearer ' + token
               const res = await fetch('/api/exams', { headers: hdrs })
               if (!res.ok) throw new Error(await res.text())
               const data = await res.json()
               setExamItems(Array.isArray(data) ? data : [])
          } catch (err) {
               console.error(err)
               toast.error('Could not load upcoming exams.')
               setExamItems([])
          } finally {
               setLoadingExams(false)
          }
     }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

     const addStudent = async () => {
          const v = studentInput.trim().toLowerCase()
          if (!v) return
          if (!emailRegex.test(v)) {
               toast.error('Please enter a valid email address')
               return
          }
          const newStudents = students.includes(v) ? students : [...students, v]
          setStudents(newStudents)
          setStudentInput('')

          if (loadedSavedId) {
               try {
                    await updateSavedClass(
                         loadedSavedId,
                         {
                              students: newStudents,
                         },
                         false,
                    )
                    toast.success('Added student and updated saved class')
               } catch (err) {
                    console.error(err)
                    toast.error(
                         'Added locally but could not update saved class',
                    )
               }
          }
     }
     const removeStudent = async (idx: number) => {
          const nextStudents = students.filter((_, i) => i !== idx)
          setStudents(nextStudents)

          if (loadedSavedId) {
               try {
                    await updateSavedClass(
                         loadedSavedId,
                         { students: nextStudents },
                         false,
                    )
                    toast.success('Student removed and classroom updated')
               } catch (err) {
                    console.error(err)
                    toast.error(
                         'Could not update classroom after removing the student',
                    )
               }
          }
     }

     const createClassroom = async (
          event?: FormEvent<HTMLFormElement>,
          examType:
               | 'complete'
               | 'listening'
               | 'reading'
               | 'speaking'
               | 'writing' = 'complete',
     ) => {
          if (event) event.preventDefault()

          if (!schedule) {
               toast.error('Please choose an exam date and time')
               return
          }
          if (Date.parse(schedule) < Date.now()) {
               toast.error('Please choose a future date and time')
               return
          }
          if (!students.length) {
               toast.error(
                    'Please add at least one student email before creating the exam.',
               )
               return
          }

          try {
               const auth = getCurrentUser()
               const token = auth?.token
               const examUrl = `${window.location.origin}/dashboard/exams/${examType}`
               const hdrs: any = {
                    'content-type': 'application/json',
               }
               if (token) hdrs.Authorization = 'Bearer ' + token

               const res = await fetch('/api/exams/classroom', {
                    method: 'POST',
                    headers: hdrs,
                    body: JSON.stringify({
                         classroomName: className.trim(),
                         classroomId: loadedSavedId || undefined,
                         students,
                         scheduledAt: schedule,
                         examUrl,
                         examType,
                    }),
               })

               const json = await res.json().catch(() => ({}))
               if (!res.ok) {
                    throw new Error(json?.message || 'Could not create exam.')
               }

               toast.success(
                    `${examType.charAt(0).toUpperCase() + examType.slice(1)} IELTS mock created and emails sent`,
               )
               setSchedule('')
               setStep(1)
               await refreshSaved()
          } catch (err: any) {
               console.error(err)
               toast.error(err?.message || 'Could not create the exam.')
          }
     }

     // API calls
     const loadClassesList = async () => {
          try {
               const auth = getCurrentUser()
               const token = auth?.token
               const hdrs: any = {}
               if (token) hdrs.Authorization = 'Bearer ' + token
               const res = await fetch('/api/classrooms', { headers: hdrs })
               if (!res.ok) throw new Error(await res.text())
               return await res.json()
          } catch (err) {
               console.error(err)
               toast.error(
                    'Could not load classes. Make sure you are logged in.',
               )
               return []
          }
     }

     const refreshSaved = async () => {
          const list = await loadClassesList()
          setSavedClasses(list || [])
     }

     // Create (save) a new classroom — checks name uniqueness
     const createSavedClass = async () => {
          const trimmedName = className.trim()
          if (!trimmedName) {
               toast.error('Please enter a classroom name.')
               return
          }
          if (!students.length) {
               toast.error(
                    'Please add at least one student email before saving the class.',
               )
               return
          }

          const duplicateExists = savedClasses.some(
               (c: any) =>
                    String(c.name || '')
                         .trim()
                         .toLowerCase() === trimmedName.toLowerCase(),
          )

          if (duplicateExists) {
               toast.error(
                    'A classroom with this name already exists. Please choose a different name.',
               )
               return
          }

          try {
               const auth = getCurrentUser()
               const token = auth?.token
               const hdrs: any = { 'content-type': 'application/json' }
               if (token) hdrs.Authorization = 'Bearer ' + token
               const res = await fetch('/api/classrooms', {
                    method: 'POST',
                    headers: hdrs,
                    body: JSON.stringify({
                         name: trimmedName,
                         tutorName,
                         students,
                    }),
               })
               if (!res.ok) {
                    const text = await res.text()
                    const message =
                         text && text !== 'OK' ? text : 'Could not save class.'
                    throw new Error(message)
               }
               const json = await res.json()
               await refreshSaved()
               setLoadedSavedId(json?.id || null)
               toast.success('Class saved')
          } catch (err: any) {
               console.error(err)
               const message =
                    err?.message?.toLowerCase?.().includes('duplicate') ||
                    err?.message?.toLowerCase?.().includes('already exists')
                         ? 'A classroom with this name already exists. Please choose a different name.'
                         : 'Could not save class. Make sure you are logged in.'
               toast.error(message)
          }
     }

     // Update an existing saved classroom — do not enforce name uniqueness here
     const updateCurrentSavedClass = async () => {
          if (!loadedSavedId) return
          const trimmedName = className.trim()
          if (!trimmedName) {
               toast.error('Please enter a classroom name.')
               return
          }
          if (!students.length) {
               toast.error(
                    'Please add at least one student email before updating the class.',
               )
               return
          }

          try {
               await updateSavedClass(
                    loadedSavedId,
                    {
                         name: trimmedName,
                         tutorName,
                         students,
                    },
                    false,
               )
               toast.success('Class updated')
          } catch (err) {
               console.error(err)
               toast.error('Could not update class')
          }
     }

     const deleteSavedClass = async (id: string) => {
          confirmDeleteToast('Delete this saved class?', async () => {
               try {
                    const auth = getCurrentUser()
                    const token = auth?.token
                    const hdrs: any = {}
                    if (token) hdrs.Authorization = 'Bearer ' + token
                    const res = await fetch(`/api/classrooms/${id}`, {
                         method: 'DELETE',
                         headers: hdrs,
                    })
                    if (!res.ok) throw new Error(await res.text())
                    await refreshSaved()
                    toast.success('Deleted')
               } catch (err) {
                    console.error(err)
                    toast.error(
                         'Could not delete. Make sure you are logged in and own the class.',
                    )
               }
          })
     }

     const updateSavedClass = async (
          id: string,
          payload: any,
          showToast = true,
     ) => {
          try {
               const auth = getCurrentUser()
               const token = auth?.token
               const hdrs: any = { 'content-type': 'application/json' }
               if (token) hdrs.Authorization = 'Bearer ' + token
               const res = await fetch(`/api/classrooms/${id}`, {
                    method: 'PUT',
                    headers: hdrs,
                    body: JSON.stringify(payload),
               })
               if (!res.ok) throw new Error(await res.text())
               await refreshSaved()
               if (showToast) toast.success('Saved')
          } catch (err) {
               console.error(err)
               toast.error(
                    'Could not update. Make sure you are logged in and own the class.',
               )
          }
     }

     return (
          <main className='classroom-page'>
               <DashboardHeader />

               <section className='classroom-setup-card'>
                    <div className='flex items-center justify-between'>
                         <p className='classroom-kicker'>CLASSROOM SETUP</p>
                         <Link
                              to='/dashboard'
                              className='button'
                              style={{
                                   background: '#eee',
                                   color: '#17233d',
                                   textDecoration: 'none',
                              }}
                         >
                              ← Quit classroom
                         </Link>
                    </div>
                    <h1>Plan a shared mock exam.</h1>
                    <p>
                         Set up your class now, then invite learners when you
                         are ready.
                    </p>

                    {step === 1 && (
                         <>
                              <div className='saved-classes-inline'>
                                   <div className='saved-classes-inline__header'>
                                        <h3>Saved classes</h3>
                                        <div
                                             style={{
                                                  display: 'flex',
                                                  gap: 8,
                                                  flexWrap: 'wrap',
                                             }}
                                        >
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary'
                                                  onClick={openExamModal}
                                             >
                                                  <span
                                                       className='saved-class-action__icon'
                                                       aria-hidden='true'
                                                  >
                                                       ⏱
                                                  </span>
                                                  Upcoming exams
                                             </button>
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary'
                                                  onClick={async () => {
                                                       setLoadingSaved(true)
                                                       const list =
                                                            await loadClassesList()
                                                       setSavedClasses(
                                                            list || [],
                                                       )
                                                       setLoadingSaved(false)
                                                  }}
                                             >
                                                  <span
                                                       className='saved-class-action__icon'
                                                       aria-hidden='true'
                                                  >
                                                       ↻
                                                  </span>
                                                  {loadingSaved
                                                       ? 'Loading'
                                                       : 'Refresh'}
                                             </button>
                                        </div>
                                   </div>

                                   {savedClasses && savedClasses.length > 0 ? (
                                        <>
                                             <ul className='saved-inline-list'>
                                                  {savedClasses.map(
                                                       (c: any) => (
                                                            <li
                                                                 key={c._id}
                                                                 className='saved-list-item'
                                                                 onClick={() => {
                                                                      setClassName(
                                                                           c.name ||
                                                                                '',
                                                                      )
                                                                      setTutorName(
                                                                           c.tutorName ||
                                                                                '',
                                                                      )
                                                                      setStudents(
                                                                           c.students ||
                                                                                [],
                                                                      )
                                                                      setLoadedSavedId(
                                                                           c._id,
                                                                      )
                                                                 }}
                                                            >
                                                                 <div
                                                                      style={{
                                                                           flex: 1,
                                                                      }}
                                                                 >
                                                                      <div
                                                                           style={{
                                                                                fontWeight: 800,
                                                                           }}
                                                                      >
                                                                           {
                                                                                c.name
                                                                           }
                                                                      </div>
                                                                      <div
                                                                           style={{
                                                                                color: '#66788a',
                                                                                fontSize: 13,
                                                                           }}
                                                                      >
                                                                           {
                                                                                (
                                                                                     c.students ||
                                                                                     []
                                                                                )
                                                                                     .length
                                                                           }{' '}
                                                                           students
                                                                           ?{' '}
                                                                           {new Date(
                                                                                c.createdAt,
                                                                           ).toLocaleString()}
                                                                      </div>
                                                                 </div>
                                                                 <div
                                                                      style={{
                                                                           display: 'flex',
                                                                           gap: 6,
                                                                      }}
                                                                 >
                                                                      <button
                                                                           className='saved-class-action saved-class-action--primary'
                                                                           onClick={(
                                                                                e,
                                                                           ) => {
                                                                                e.stopPropagation()
                                                                                setClassName(
                                                                                     c.name ||
                                                                                          '',
                                                                                )
                                                                                setTutorName(
                                                                                     c.tutorName ||
                                                                                          '',
                                                                                )
                                                                                setStudents(
                                                                                     c.students ||
                                                                                          [],
                                                                                )
                                                                                setLoadedSavedId(
                                                                                     c._id,
                                                                                )
                                                                           }}
                                                                      >
                                                                           <span
                                                                                className='saved-class-action__icon'
                                                                                aria-hidden='true'
                                                                           >
                                                                                ✓
                                                                           </span>
                                                                           Select
                                                                      </button>
                                                                      <button
                                                                           className='saved-class-action saved-class-action--danger'
                                                                           onClick={(
                                                                                e,
                                                                           ) => {
                                                                                e.stopPropagation()
                                                                                deleteSavedClass(
                                                                                     c._id,
                                                                                )
                                                                           }}
                                                                      >
                                                                           <span
                                                                                className='saved-class-action__icon'
                                                                                aria-hidden='true'
                                                                           >
                                                                                🗑
                                                                           </span>
                                                                           Delete
                                                                      </button>
                                                                 </div>
                                                            </li>
                                                       ),
                                                  )}
                                             </ul>
                                        </>
                                   ) : (
                                        <p style={{ color: '#66788a' }}>
                                             No saved classes found.
                                        </p>
                                   )}
                              </div>

                              <div>
                                   <div
                                        style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'space-between',
                                             marginBottom: 10,
                                        }}
                                   >
                                        <h3 style={{ margin: 0, fontSize: 18 }}>
                                             Step 1 Create the class
                                        </h3>
                                   </div>

                                   <div style={{ display: 'grid', gap: 12 }}>
                                        <label>
                                             Classroom name
                                             <input
                                                  value={className}
                                                  onChange={(e) =>
                                                       setClassName(
                                                            e.target.value,
                                                       )
                                                  }
                                                  required
                                                  placeholder='e.g. Autumn IELTS cohort'
                                             />
                                        </label>
                                        <label>
                                             Tutor name
                                             <input
                                                  value={tutorName}
                                                  onChange={(e) =>
                                                       setTutorName(
                                                            e.target.value,
                                                       )
                                                  }
                                                  required
                                                  placeholder='Your name or tutor name'
                                             />
                                        </label>

                                        <div>
                                             <div
                                                  style={{
                                                       display: 'flex',
                                                       justifyContent:
                                                            'space-between',
                                                       alignItems: 'center',
                                                       marginBottom: 8,
                                                  }}
                                             >
                                                  <div
                                                       style={{
                                                            fontWeight: 800,
                                                       }}
                                                  >
                                                       Students
                                                  </div>
                                                  <div
                                                       style={{
                                                            color: '#66788a',
                                                            fontSize: 13,
                                                       }}
                                                  >
                                                       {students.length} added
                                                  </div>
                                             </div>

                                             <div
                                                  style={{
                                                       display: 'flex',
                                                       gap: 8,
                                                       marginBottom: 8,
                                                  }}
                                             >
                                                  <input
                                                       placeholder='Add student email'
                                                       value={studentInput}
                                                       onChange={(e) =>
                                                            setStudentInput(
                                                                 e.target.value,
                                                            )
                                                       }
                                                       onKeyDown={(e) => {
                                                            if (
                                                                 e.key ===
                                                                 'Enter'
                                                            ) {
                                                                 e.preventDefault()
                                                                 addStudent()
                                                            }
                                                       }}
                                                       style={{ flex: 1 }}
                                                       type='email'
                                                  />
                                                  <button
                                                       type='button'
                                                       className='button'
                                                       onClick={addStudent}
                                                       style={{
                                                            padding: '8px 12px',
                                                       }}
                                                       disabled={
                                                            !emailRegex.test(
                                                                 studentInput.trim(),
                                                            )
                                                       }
                                                  >
                                                       <span aria-hidden='true'>
                                                            ＋
                                                       </span>{' '}
                                                       Add
                                                  </button>
                                             </div>

                                             <div
                                                  style={{
                                                       display: 'flex',
                                                       gap: 8,
                                                       flexWrap: 'wrap',
                                                  }}
                                             >
                                                  {students.map((s, i) => (
                                                       <div
                                                            key={i}
                                                            style={{
                                                                 position:
                                                                      'relative',
                                                                 display: 'inline-block',
                                                                 marginBottom: 8,
                                                            }}
                                                       >
                                                            <span
                                                                 style={{
                                                                      display: 'inline-flex',
                                                                      alignItems:
                                                                           'center',
                                                                      gap: 8,
                                                                      padding: '8px 12px',
                                                                      background:
                                                                           '#fbfffb',
                                                                      border: '1px solid #e6f1ea',
                                                                      borderRadius: 12,
                                                                      minWidth: 80,
                                                                 }}
                                                            >
                                                                 <span
                                                                      style={{
                                                                           color: '#405269',
                                                                           fontSize: 13,
                                                                      }}
                                                                 >
                                                                      {s}
                                                                 </span>
                                                            </span>
                                                            <button
                                                                 aria-label={`Remove ${s}`}
                                                                 type='button'
                                                                 onClick={() =>
                                                                      removeStudent(
                                                                           i,
                                                                      )
                                                                 }
                                                                 style={{
                                                                      position:
                                                                           'absolute',
                                                                      top: -10,
                                                                      right: -1,
                                                                      background:
                                                                           'transparent',
                                                                      border: 'none',
                                                                      width: 18,
                                                                      height: 18,
                                                                      display: 'grid',
                                                                      placeItems:
                                                                           'center',
                                                                      cursor: 'pointer',
                                                                      color: '#d65336',
                                                                      boxShadow:
                                                                           'none',
                                                                      fontSize: 12,
                                                                      lineHeight: 1,
                                                                 }}
                                                            >
                                                                 x
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>

                                        <div
                                             style={{
                                                  display: 'flex',
                                                  gap: 10,
                                                  alignItems: 'start',
                                                  flexDirection: 'column',
                                             }}
                                        >
                                             <div className='flex gap-5'>
                                                  {loadedSavedId ? (
                                                       <button
                                                            type='button'
                                                            className='button'
                                                            onClick={
                                                                 updateCurrentSavedClass
                                                            }
                                                            style={{
                                                                 background:
                                                                      '#ffd583',
                                                                 color: '#17233d',
                                                            }}
                                                            disabled={
                                                                 !className.trim() ||
                                                                 !tutorName.trim() ||
                                                                 students.length ===
                                                                      0
                                                            }
                                                       >
                                                            <span aria-hidden='true'>
                                                                 ✎
                                                            </span>{' '}
                                                            Update
                                                       </button>
                                                  ) : (
                                                       <button
                                                            type='button'
                                                            className='button'
                                                            onClick={
                                                                 createSavedClass
                                                            }
                                                            style={{
                                                                 background:
                                                                      '#ffd583',
                                                                 color: '#17233d',
                                                            }}
                                                            disabled={
                                                                 !className.trim() ||
                                                                 !tutorName.trim() ||
                                                                 students.length ===
                                                                      0
                                                            }
                                                       >
                                                            <span aria-hidden='true'>
                                                                 💾
                                                            </span>{' '}
                                                            Save
                                                       </button>
                                                  )}

                                                  <button
                                                       type='button'
                                                       className='button saved-class-action saved-class-action--primary'
                                                       disabled={
                                                            !className.trim() ||
                                                            !tutorName.trim() ||
                                                            students.length ===
                                                                 0
                                                       }
                                                       onClick={() =>
                                                            setStep(2)
                                                       }
                                                  >
                                                       <span aria-hidden='true'>
                                                            📅
                                                       </span>{' '}
                                                       Schedule an IELTS mock
                                                       for this class.
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </>
                    )}

                    {step === 2 && (
                         <div style={{ marginTop: 18 }}>
                              <div
                                   style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        marginBottom: 8,
                                        justifyContent: 'space-between',
                                   }}
                              >
                                   <h3
                                        style={{
                                             margin: 0,
                                             fontSize: 18,
                                        }}
                                   >
                                        Step 2 Schedule & create
                                   </h3>
                                   <button
                                        type='button'
                                        onClick={() => setStep(1)}
                                        style={{
                                             background: '#eee',
                                             border: 'none',
                                             color: '#17233d',
                                             cursor: 'pointer',
                                             fontSize: 14,
                                             padding: 8,
                                        }}
                                   >
                                        <span aria-hidden='true'>←</span> step 1
                                   </button>
                              </div>
                              <div
                                   style={{
                                        marginBottom: 12,
                                        padding: '10px 12px',
                                        borderRadius: 10,
                                        background: '#f2f8f4',
                                        color: '#17233d',
                                        fontWeight: 700,
                                   }}
                              >
                                   Selected class:{' '}
                                   {className || 'Untitled class'}
                              </div>
                              <form
                                   onSubmit={(e) => {
                                        e.preventDefault()
                                        createClassroom(e, 'complete')
                                   }}
                              >
                                   <label>
                                        Exam date and time
                                        <input
                                             name='schedule'
                                             type='datetime-local'
                                             required
                                             min={minSchedule}
                                             value={schedule}
                                             onChange={(e) =>
                                                  setSchedule(e.target.value)
                                             }
                                        />
                                   </label>
                                   <div
                                        style={{
                                             display: 'flex',
                                             gap: 10,
                                        }}
                                   >
                                        <div
                                             style={{
                                                  display: 'flex flex-col',
                                                  gap: 8,
                                                  width: '100%',
                                             }}
                                        >
                                             <button
                                                  className='saved-class-action saved-class-action--primary w-full! mx-4 my-2'
                                                  type='submit'
                                             >
                                                  <span aria-hidden='true'>
                                                       ✅
                                                  </span>{' '}
                                                  Create a complete IELTS mock
                                             </button>
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary w-full! mx-4 my-1'
                                                  onClick={() =>
                                                       createClassroom(
                                                            undefined,
                                                            'listening',
                                                       )
                                                  }
                                             >
                                                  <span aria-hidden='true'>
                                                       🎧
                                                  </span>{' '}
                                                  Create a listening IELTS mock
                                             </button>
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary w-full! mx-4 my-1'
                                                  onClick={() =>
                                                       createClassroom(
                                                            undefined,
                                                            'reading',
                                                       )
                                                  }
                                             >
                                                  <span aria-hidden='true'>
                                                       📖
                                                  </span>{' '}
                                                  Create a reading IELTS mock
                                             </button>
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary w-full! mx-4 my-1'
                                                  onClick={() =>
                                                       createClassroom(
                                                            undefined,
                                                            'speaking',
                                                       )
                                                  }
                                             >
                                                  <span aria-hidden='true'>
                                                       🎤
                                                  </span>{' '}
                                                  Create a speaking IELTS mock
                                             </button>
                                             <button
                                                  type='button'
                                                  className='saved-class-action saved-class-action--secondary w-full! mx-4 my-1'
                                                  onClick={() =>
                                                       createClassroom(
                                                            undefined,
                                                            'writing',
                                                       )
                                                  }
                                             >
                                                  <span aria-hidden='true'>
                                                       ✍️
                                                  </span>{' '}
                                                  Create a writing IELTS mock
                                             </button>
                                        </div>
                                   </div>
                              </form>
                         </div>
                    )}
               </section>

               {examModalOpen && (
                    <div
                         className='modal-overlay'
                         onClick={() => setExamModalOpen(false)}
                    >
                         <div
                              className='modal-panel modal-single-column'
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                   display: 'grid',
                                   gap: 18,
                              }}
                         >
                              <div
                                   style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 12,
                                   }}
                              >
                                   <h3
                                        style={{
                                             margin: 0,
                                             fontSize: 22,
                                             letterSpacing: '-0.04em',
                                        }}
                                   >
                                        Exams
                                   </h3>
                                   <button
                                        type='button'
                                        className='saved-class-action saved-class-action--secondary'
                                        onClick={() => setExamModalOpen(false)}
                                   >
                                        Close
                                   </button>
                              </div>

                              <div
                                   style={{
                                        display: 'flex',
                                        gap: 8,
                                        background: '#f4f7f9',
                                        borderRadius: 10,
                                        padding: 6,
                                   }}
                              >
                                   {(['upcoming', 'history'] as const).map(
                                        (tab) => (
                                             <button
                                                  key={tab}
                                                  type='button'
                                                  onClick={() =>
                                                       setExamTab(tab)
                                                  }
                                                  style={{
                                                       flex: 1,
                                                       padding: '10px 12px',
                                                       borderRadius: 8,
                                                       border: 'none',
                                                       background:
                                                            examTab === tab
                                                                 ? '#17233d'
                                                                 : 'transparent',
                                                       color:
                                                            examTab === tab
                                                                 ? '#fff'
                                                                 : '#17233d',
                                                       fontWeight: 700,
                                                       cursor: 'pointer',
                                                  }}
                                             >
                                                  {tab === 'upcoming'
                                                       ? 'Upcoming'
                                                       : 'History'}
                                             </button>
                                        ),
                                   )}
                              </div>

                              {loadingExams ? (
                                   <p style={{ margin: 0, color: '#66788a' }}>
                                        Loading exams...
                                   </p>
                              ) : examTab === 'upcoming' ? (
                                   <div style={{ display: 'grid', gap: 10 }}>
                                        {examItems.filter(
                                             (item) =>
                                                  new Date(item.scheduledAt) >=
                                                  new Date(),
                                        ).length ? (
                                             examItems
                                                  .filter(
                                                       (item) =>
                                                            new Date(
                                                                 item.scheduledAt,
                                                            ) >= new Date(),
                                                  )
                                                  .map((item) => (
                                                       <div
                                                            key={
                                                                 item._id ||
                                                                 item.id
                                                            }
                                                            style={{
                                                                 padding: 14,
                                                                 border: '1px solid #e7edf4',
                                                                 borderRadius: 12,
                                                                 background:
                                                                      '#f9fbfb',
                                                            }}
                                                       >
                                                            <div
                                                                 style={{
                                                                      fontWeight: 800,
                                                                      marginBottom: 6,
                                                                 }}
                                                            >
                                                                 {item.classroomName ||
                                                                      'Classroom'}
                                                            </div>
                                                            <div
                                                                 style={{
                                                                      color: '#1d4f91',
                                                                      fontSize: 12,
                                                                      fontWeight: 700,
                                                                      textTransform:
                                                                           'capitalize',
                                                                      marginBottom: 6,
                                                                 }}
                                                            >
                                                                 {formatExamType(
                                                                      item.examType,
                                                                 )}
                                                            </div>
                                                            <div
                                                                 style={{
                                                                      color: '#586b7c',
                                                                      fontSize: 13,
                                                                 }}
                                                            >
                                                                 {new Date(
                                                                      item.scheduledAt,
                                                                 ).toLocaleString(
                                                                      [],
                                                                      {
                                                                           dateStyle:
                                                                                'medium',
                                                                           timeStyle:
                                                                                'short',
                                                                      },
                                                                 )}
                                                            </div>
                                                       </div>
                                                  ))
                                        ) : (
                                             <p
                                                  style={{
                                                       margin: 0,
                                                       color: '#66788a',
                                                  }}
                                             >
                                                  No upcoming exams scheduled.
                                             </p>
                                        )}
                                   </div>
                              ) : (
                                   <div style={{ display: 'grid', gap: 10 }}>
                                        {examItems.filter(
                                             (item) =>
                                                  new Date(item.scheduledAt) <
                                                  new Date(),
                                        ).length ? (
                                             examItems
                                                  .filter(
                                                       (item) =>
                                                            new Date(
                                                                 item.scheduledAt,
                                                            ) < new Date(),
                                                  )
                                                  .map((item) => (
                                                       <div
                                                            key={
                                                                 item._id ||
                                                                 item.id
                                                            }
                                                            style={{
                                                                 padding: 14,
                                                                 border: '1px solid #e7edf4',
                                                                 borderRadius: 12,
                                                                 background:
                                                                      '#f9fbfb',
                                                            }}
                                                       >
                                                            <div
                                                                 style={{
                                                                      fontWeight: 800,
                                                                      marginBottom: 6,
                                                                 }}
                                                            >
                                                                 {item.classroomName ||
                                                                      'Classroom'}
                                                            </div>
                                                            <div
                                                                 style={{
                                                                      color: '#1d4f91',
                                                                      fontSize: 12,
                                                                      fontWeight: 700,
                                                                      textTransform:
                                                                           'capitalize',
                                                                      marginBottom: 6,
                                                                 }}
                                                            >
                                                                 {formatExamType(
                                                                      item.examType,
                                                                 )}
                                                            </div>
                                                            <div
                                                                 style={{
                                                                      color: '#586b7c',
                                                                      fontSize: 13,
                                                                 }}
                                                            >
                                                                 {new Date(
                                                                      item.scheduledAt,
                                                                 ).toLocaleString(
                                                                      [],
                                                                      {
                                                                           dateStyle:
                                                                                'medium',
                                                                           timeStyle:
                                                                                'short',
                                                                      },
                                                                 )}
                                                            </div>
                                                       </div>
                                                  ))
                                        ) : (
                                             <p
                                                  style={{
                                                       margin: 0,
                                                       color: '#66788a',
                                                  }}
                                             >
                                                  No exam history yet.
                                             </p>
                                        )}
                                   </div>
                              )}
                         </div>
                    </div>
               )}
          </main>
     )
}
