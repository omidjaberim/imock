import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../../lib/auth'
import { toast } from 'react-toastify'

export default function EditSavedClass() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [name, setName] = useState('')
  const [tutorName, setTutorName] = useState('')
  const [students, setStudents] = useState<string[]>([])
  const [studentInput, setStudentInput] = useState('')

  const confirmDeleteToast = (label: string, onConfirm: () => void) => {
    toast(
      ({ closeToast }) => (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 800, color: '#17233d' }}>{label}</div>
          <div style={{ color: '#54657b', fontSize: 13 }}>This action cannot be undone.</div>
          <div className='toast-confirm-actions'>
            <button type='button' className='toast-confirm-btn toast-confirm-btn--secondary' onClick={closeToast}>Cancel</button>
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

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const auth = getCurrentUser()
        const token = auth?.token
        const hdrs: any = {}
        if (token) hdrs.Authorization = 'Bearer ' + token
        const res = await fetch(`/api/classrooms/${id}`, { headers: hdrs })
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        setData(json)
        setName(json.name || '')
        setTutorName(json.tutorName || '')
        setStudents(Array.isArray(json.students) ? json.students : [])
      } catch (err) {
        console.error(err)
        toast.error('Could not load class')
        navigate('/dashboard/classrooms/new')
      } finally {
        setLoading(false)
      }
    })()
  }, [id, navigate])

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const addStudent = () => {
    const v = studentInput.trim().toLowerCase()
    if (!v) return
    if (!emailRegex.test(v)) {
      toast.error('Invalid email')
      return
    }
    setStudents((s) => (s.includes(v) ? s : [...s, v]))
    setStudentInput('')
  }

  const removeStudent = (i: number) => setStudents((s) => s.filter((_, idx) => idx !== i))

  const save = async () => {
    if (!id) return
    try {
      const auth = getCurrentUser()
      const token = auth?.token
      const hdrs: any = { 'content-type': 'application/json' }
      if (token) hdrs.Authorization = 'Bearer ' + token
      const res = await fetch(`/api/classrooms/${id}`, {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({ name, tutorName, students })
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Saved')
      navigate('/dashboard/classrooms/new')
    } catch (err) {
      console.error(err)
      toast.error('Could not save')
    }
  }

  const del = async () => {
    if (!id) return
    confirmDeleteToast('Delete this saved class?', async () => {
      try {
        const auth = getCurrentUser()
        const token = auth?.token
        const hdrs: any = {}
        if (token) hdrs.Authorization = 'Bearer ' + token
        const res = await fetch(`/api/classrooms/${id}`, { method: 'DELETE', headers: hdrs })
        if (!res.ok) throw new Error(await res.text())
        toast.success('Deleted')
        navigate('/dashboard/classrooms/new')
      } catch (err) {
        console.error(err)
        toast.error('Could not delete')
      }
    })
  }

  if (loading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  return (
    <main style={{ maxWidth: 720, margin: '40px auto' }}>
      <Link to='/dashboard/classrooms/new'>← Back to Class setup</Link>
      <h2>Edit saved class</h2>
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Tutor<input value={tutorName} onChange={(e) => setTutorName(e.target.value)} /></label>
      <div>
        <div>Students</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {students.map((s, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#fbfffb', border: '1px solid #e6f1ea', borderRadius: 8 }}>
              <span>{s}</span>
              <button onClick={() => removeStudent(i)}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input value={studentInput} onChange={(e) => setStudentInput(e.target.value)} placeholder='Add student email' onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStudent() } }} />
          <button onClick={addStudent}>Add</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button onClick={save}>Save</button>
        <button onClick={del} style={{ background: '#fff0f0' }}>Delete</button>
      </div>
    </main>
  )
}
