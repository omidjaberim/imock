import { Link, Navigate } from 'react-router-dom'
import { getCurrentUser } from '../../../lib/auth'
import './settings.css'

export default function DashboardSettings() {
     const user = getCurrentUser()
     if (!user) return <Navigate to='/auth' replace />

     return <main className='settings-page'>
          <header className='settings-header'><Link to='/dashboard' className='dashboard-brand'><i>i</i>mock<span>.</span></Link><Link to='/dashboard' className='settings-back'>← Back to dashboard</Link></header>
          <section className='settings-card'><p>ACCOUNT SETTINGS</p><h1>Manage your iMock account.</h1><div><span>Name</span><b>{user.name}</b></div><div><span>Sign-in method</span><b>{user.provider}</b></div><button type='button'>Save changes</button></section>
     </main>
}
