import { useState } from 'react'

export default function TeacherEvents(props: {
  onCreate: (title: string, location: string, startsAt: string, description: string) => void
}) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [description, setDescription] = useState('')

  const canSubmit = title.trim() && location.trim() && startsAt

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '40px 48px',
      color: '#e6edf3',
    }}>

      {/* Page title */}
      <div style={{ marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.3px' }}>
          Yeni Tədbir
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: '#7d8590' }}>
          Tələbələr dashboard-da eventləri görəcək
        </p>
      </div>

      {/* Form card */}
      <div style={{
        marginTop: 28,
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 12,
        padding: '24px 28px',
        maxWidth: 640,
      }}>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: '#e6edf3', marginBottom: 8
          }}>Başlıq</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Məs: İntatan cədvəli"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: '#e6edf3',
              fontSize: 14,
              padding: '9px 12px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#388bfd'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,139,253,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#30363d'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: '#e6edf3', marginBottom: 8
          }}>Məkan</label>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Məs: B zalı"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: '#e6edf3',
              fontSize: 14,
              padding: '9px 12px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#388bfd'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,139,253,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#30363d'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Date/time */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: '#e6edf3', marginBottom: 8
          }}>Tarix / Saat</label>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={e => setStartsAt(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: startsAt ? '#e6edf3' : '#7d8590',
              fontSize: 14,
              padding: '9px 12px',
              outline: 'none',
              fontFamily: 'inherit',
              colorScheme: 'dark',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#388bfd'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,139,253,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#30363d'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: '#e6edf3', marginBottom: 8
          }}>
            Mətn{' '}
            <span style={{ fontWeight: 400, color: '#7d8590' }}>(isteğe bağlı)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Elanın detalları n..."
            rows={5}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: '#e6edf3',
              fontSize: 14,
              padding: '9px 12px',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#388bfd'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,139,253,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#30363d'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Submit */}
        <button
          disabled={!canSubmit}
          onClick={() => {
            const iso = startsAt ? new Date(startsAt).toISOString() : ''
            props.onCreate(title, location, iso, description)
            setTitle(''); setLocation(''); setStartsAt(''); setDescription('')
          }}
          style={{
            background: canSubmit ? '#238636' : '#21262d',
            border: `1px solid ${canSubmit ? '#2ea043' : '#30363d'}`,
            color: canSubmit ? '#fff' : '#7d8590',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            padding: '9px 20px',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'background 150ms, border-color 150ms, opacity 150ms',
          }}
          onMouseEnter={e => { if (canSubmit) (e.target as HTMLElement).style.background = '#2ea043' }}
          onMouseLeave={e => { if (canSubmit) (e.target as HTMLElement).style.background = '#238636' }}
        >
          Elan göndər
        </button>
      </div>

      {/* Info cards */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, maxWidth: 640 }}>

        {/* Məsləhət */}
        <div style={{
          flex: 1,
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 10,
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#388bfd" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#388bfd' }}>Məsləhət</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#7d8590', lineHeight: 1.55 }}>
            Elanın daha cəlbedici olması üçün aydın və qısa başlıqdan istifadə edin.
          </p>
        </div>

        {/* Status */}
        <div style={{
          flex: 1,
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 10,
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3fb950" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#3fb950' }}>Status</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#7d8590', lineHeight: 1.55 }}>
            Elanınız göndərildikdən sonra "Gözləmədə" statusuna keçəcəkdi.
          </p>
        </div>
      </div>

      <style>{`
        ::placeholder { color: #7d8590 !important; }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}