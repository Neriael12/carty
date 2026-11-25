import { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState(null)
  const [healthError, setHealthError] = useState('')
  const [checks, setChecks] = useState([])
  const [checksStatus, setChecksStatus] = useState('')
  const [memberName, setMemberName] = useState('נריה אלבז')
  const [actionNote, setActionNote] = useState('בדיקת חיבור Frontend -> Backend -> Supabase')
  const [submitting, setSubmitting] = useState(false)

  async function loadStatusAndChecks() {
    setHealthError('')
    try {
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setHealth(data)

      if (data.supabase_configured) {
        await loadInfraChecks()
      } else {
        setChecksStatus('Supabase עדיין לא הוגדר בקובץ .env (השרת פועל, ממתין למפתחות).')
      }
    } catch (err) {
      setHealth(null)
      setHealthError(`לא ניתן להתחבר לשרת Backend (${err.message})`)
    }
  }

  async function loadInfraChecks() {
    try {
      const res = await fetch('/api/infra-checks')
      const data = await res.json()
      if (!res.ok) {
        setChecksStatus(data.detail || `שגיאה (${res.status})`)
        return
      }
      setChecks(data.items || [])
      setChecksStatus('')
    } catch (err) {
      setChecksStatus(`שגיאה בטעינת נתונים מ-Supabase: ${err.message}`)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!memberName.trim() || !actionNote.trim()) return
    setSubmitting(true)
    setChecksStatus('')
    try {
      const res = await fetch('/api/infra-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_name: memberName.trim(),
          action_note: actionNote.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setChecksStatus(data.detail || `שגיאה בשליחה (${res.status})`)
      } else {
        setActionNote('')
        await loadInfraChecks()
      }
    } catch (err) {
      setChecksStatus(`שגיאה בשליחה לשרת: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    loadStatusAndChecks()
  }, [])

  return (
    <div className="page">
      <header className="hero">
        <div className="badge">שלב ג׳ – תשתית המערכת</div>
        <h1>CARTY</h1>
        <p className="subtitle">
          אפליקציית קארפול חכמה לאירועים — חיבור מאובטח ונוח בין נהגים לטרמפיסטים
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={loadStatusAndChecks}>
            רענן סטטוס מערכת
          </button>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h2>סטטוס תשתית (Frontend ↔ Backend ↔ Supabase)</h2>
          <div className="status-grid">
            <div className="status-box ok">
              <span className="dot" />
              <div>
                <strong>Frontend (React + Vite)</strong>
                <p>פעיל ב-Docker Container (פורט 5173)</p>
              </div>
            </div>

            <div className={`status-box ${health ? 'ok' : 'err'}`}>
              <span className="dot" />
              <div>
                <strong>Backend (Python FastAPI)</strong>
                <p>
                  {health
                    ? 'מחובר ופעיל (פורט 8000)'
                    : healthError || 'בודק חיבור...'}
                </p>
              </div>
            </div>

            <div
              className={`status-box ${
                health?.supabase_configured ? 'ok' : 'warn'
              }`}
            >
              <span className="dot" />
              <div>
                <strong>Supabase (Cloud DB)</strong>
                <p>
                  {health?.supabase_configured
                    ? 'מוגדר בקובץ .env'
                    : 'ממתין להזנת SUPABASE_URL ו-SUPABASE_KEY בקובץ .env'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <h2>בדיקת קריאה וכתיבה מקצה לקצה (End-to-End)</h2>
          <p className="hint">
            טופס זה שולח בקשת POST אל ה-Backend הכותבת לטבלת{' '}
            <code>infra_checks</code> ב-Supabase, וקורא ממנה את הרשומות העדכניות.
          </p>

          <form className="check-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="שם חבר הצוות"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="תיאור פעולת הבדיקה"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !health}
            >
              {submitting ? 'שולח...' : 'בצע כתיבה ל-Supabase'}
            </button>
          </form>

          {checksStatus && <div className="alert">{checksStatus}</div>}

          {checks.length > 0 && (
            <ul className="checks-list">
              {checks.map((item) => (
                <li key={item.id}>
                  <span className="member">{item.member_name}</span>
                  <span className="note">{item.action_note}</span>
                  <span className="time">
                    {new Date(item.created_at).toLocaleString('he-IL')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
