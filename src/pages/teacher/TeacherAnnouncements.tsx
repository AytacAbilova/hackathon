import { useState } from 'react'
// import Button from '../../components/ui/Button'
// import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { AnnouncementCategory } from '../../types/models'
import { announcementCategoryLabel } from '../../lib/utils'

export default function TeacherAnnouncements(props: {
  onCreate: (title: string, content: string, category: AnnouncementCategory) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<AnnouncementCategory>(2)

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerAccent} />
        <div>
          <h2 style={styles.pageTitle}>Elan yaratma</h2>
          <p style={styles.pageSubtitle}>
            Yaradılan elan admin tərəfindən təsdiqlənəndən sonra görünəcək
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div style={styles.card}>
        <div style={styles.stack}>
          {/* Title Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Başlıq</label>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Məs: İmtahan cədvəli"
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </div>

          {/* Content Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Mətn</label>
            <textarea
              style={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Elanın detalları..."
              rows={6}
              onFocus={(e) => Object.assign(e.target.style, styles.textareaFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
            />
          </div>

          {/* Category Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>Kateqoriya</label>
            <select
              style={styles.select}
              value={category}
              onChange={(e) => setCategory(Number(e.target.value) as AnnouncementCategory)}
            >
              {[1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>
                  {announcementCategoryLabel(c as AnnouncementCategory)}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div style={styles.actionsRow}>
            <button
              style={{
                ...styles.submitButton,
                ...(!title.trim() || !content.trim() ? styles.submitButtonDisabled : {}),
              }}
              disabled={!title.trim() || !content.trim()}
              onClick={() => {
                props.onCreate(title, content, category)
                setTitle('')
                setContent('')
              }}
            >
              <span style={styles.buttonIcon}>➤</span>
              Elanı göndər
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div style={styles.infoRow}>
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <div style={{ ...styles.infoIcon, ...styles.infoIconBlue }}>
              <span>💡</span>
            </div>
            <span style={styles.infoCardTitle}>Məsləhət</span>
          </div>
          <p style={styles.infoCardText}>
            Elanın daha cəlbedici olması üçün aydın və qısa başlıqdan istifadə edin.
          </p>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <div style={{ ...styles.infoIcon, ...styles.infoIconGreen }}>
              <span>✓</span>
            </div>
            <span style={styles.infoCardTitle}>Status</span>
          </div>
          <p style={styles.infoCardText}>
            Elanınız göndərildikdən sonra "Gözləmədə" statusuna keçəcəkdir.
          </p>
        </div>
      </div>
    </div>
  )
}

const colors = {
  bg: '#0f0f14',
  surface: '#16161f',
  surfaceElevated: '#1c1c28',
  surfaceBorder: '#2a2a3d',
  purple: '#7c6ff7',
  purpleHover: '#6a5ee0',
  purpleFaint: '#2d2850',
  purpleMid: '#534AB7',
  text: '#e8e8f0',
  textMuted: '#8888aa',
  textPlaceholder: '#555577',
  inputBg: '#12121a',
  inputBorder: '#252535',
  inputBorderFocus: '#7c6ff7',
  blue: '#3b82f6',
  blueFaint: '#1e293b',
  green: '#22c55e',
  greenFaint: '#14281e',
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '2rem',
    minHeight: '100vh',
    background: colors.bg,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.75rem',
  },
  headerAccent: {
    width: '4px',
    height: '52px',
    borderRadius: '4px',
    background: `linear-gradient(180deg, ${colors.purple}, ${colors.purpleMid})`,
    flexShrink: 0,
    marginTop: '2px',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: colors.text,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: '0.825rem',
    color: colors.textMuted,
    margin: '4px 0 0',
    lineHeight: 1.5,
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.surfaceBorder}`,
    borderRadius: '14px',
    padding: '1.75rem',
    marginBottom: '1rem',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  fieldLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: colors.textMuted,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  },
  input: {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.9rem',
    color: colors.text,
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  inputFocus: {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorderFocus}`,
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.9rem',
    color: colors.text,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.9rem',
    color: colors.text,
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    lineHeight: 1.6,
    transition: 'border-color 0.15s',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  textareaFocus: {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorderFocus}`,
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.9rem',
    color: colors.text,
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    lineHeight: 1.6,
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.9rem',
    color: colors.text,
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    appearance: 'none' as const,
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: '0.25rem',
  },
  submitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: colors.purple,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.65rem 1.4rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, opacity 0.15s',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
  },
  submitButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  buttonIcon: {
    fontSize: '0.75rem',
    opacity: 0.85,
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  infoCard: {
    background: colors.surface,
    border: `1px solid ${colors.surfaceBorder}`,
    borderRadius: '12px',
    padding: '1rem 1.1rem',
  },
  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  infoIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  infoIconBlue: {
    background: colors.blueFaint,
  },
  infoIconGreen: {
    background: colors.greenFaint,
  },
  infoCardTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: colors.text,
    letterSpacing: '0.02em',
  },
  infoCardText: {
    fontSize: '0.78rem',
    color: colors.textMuted,
    margin: 0,
    lineHeight: 1.55,
  },
}