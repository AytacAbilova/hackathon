import type { Announcement, EventItem } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function TeacherHome(props: {
  approvedAnnouncements: Announcement[]
  events: EventItem[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column',margin:"15px", gap: 24, animation: 'fadeUp 220ms ease both' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start',  justifyContent: 'space-between', gap: 16, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(99,102,241,0.9)', boxShadow: '0 0 10px rgba(99,102,241,0.7)'
            }} />
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: 'rgba(99,102,241,0.9)' }}>
              Teacher Panel
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: '-0.7px', color: 'rgba(244,247,255,0.97)', lineHeight: 1 }}>
            Müəllim paneli
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(219,227,244,0.55)', fontWeight: 600 }}>
            Elanlar və eventlərə sürətli baxış
          </p>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12,
            background: 'rgba(99,102,241,0.08)'
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'rgba(244,247,255,0.92)' }}>
              {props.approvedAnnouncements.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(219,227,244,0.5)' }}>elan</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            border: '1px solid rgba(56,189,248,0.22)', borderRadius: 12,
            background: 'rgba(56,189,248,0.07)'
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: 'rgba(244,247,255,0.92)' }}>
              {props.events.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(219,227,244,0.5)' }}>event</span>
          </div>
        </div>
      </div>

      {/* Two column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Announcements card */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          background: 'rgba(12,18,30,0.7)',
          backdropFilter: 'blur(14px)',
          overflow: 'hidden'
        }}>
          {/* Card header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(99,102,241,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 10,
                background: 'rgba(99,102,241,0.18)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(99,102,241,0.9)" strokeWidth="2.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'rgba(244,247,255,0.92)', letterSpacing: '-0.2px' }}>Son elanlar</div>
                <div style={{ fontSize: 11, color: 'rgba(219,227,244,0.45)', fontWeight: 700, marginTop: 1 }}>Təsdiqlənmiş elanlar</div>
              </div>
            </div>
            {props.approvedAnnouncements.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 22, height: 22, borderRadius: 999,
                background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.3)',
                fontSize: 11, fontWeight: 900, color: 'rgba(244,247,255,0.85)', padding: '0 7px'
              }}>
                {props.approvedAnnouncements.length}
              </span>
            )}
          </div>

          {/* Announcement list */}
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {props.approvedAnnouncements.length === 0 ? (
              <div style={{
                padding: '20px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)',
                textAlign: 'center' as const, color: 'rgba(219,227,244,0.35)', fontSize: 13, fontWeight: 700
              }}>
                Elan yoxdur
              </div>
            ) : null}
            {props.approvedAnnouncements.map((a) => (
              <div key={a.id} style={{
                borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.2)', padding: '11px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                transition: 'background 150ms',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(99,102,241,0.8)', boxShadow: '0 0 6px rgba(99,102,241,0.5)'
                  }} />
                  <span style={{
                    fontSize: 14, fontWeight: 800, color: 'rgba(244,247,255,0.88)',
                    letterSpacing: '-0.2px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {a.title}
                  </span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(219,227,244,0.38)',
                  flexShrink: 0, letterSpacing: '0.1px'
                }}>
                  {formatDate(a.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events card */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          background: 'rgba(12,18,30,0.7)',
          backdropFilter: 'blur(14px)',
          overflow: 'hidden'
        }}>
          {/* Card header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(56,189,248,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 10,
                background: 'rgba(56,189,248,0.14)',
                border: '1px solid rgba(56,189,248,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(56,189,248,0.9)" strokeWidth="2.5">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'rgba(244,247,255,0.92)', letterSpacing: '-0.2px' }}>Son eventlər</div>
                <div style={{ fontSize: 11, color: 'rgba(219,227,244,0.45)', fontWeight: 700, marginTop: 1 }}>Əlavə olunanlar</div>
              </div>
            </div>
            {props.events.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 22, height: 22, borderRadius: 999,
                background: 'rgba(56,189,248,0.14)', border: '1px solid rgba(56,189,248,0.28)',
                fontSize: 11, fontWeight: 900, color: 'rgba(244,247,255,0.85)', padding: '0 7px'
              }}>
                {props.events.length}
              </span>
            )}
          </div>

          {/* Event list */}
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {props.events.length === 0 ? (
              <div style={{
                padding: '20px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)',
                textAlign: 'center' as const, color: 'rgba(219,227,244,0.35)', fontSize: 13, fontWeight: 700
              }}>
                Event yoxdur
              </div>
            ) : null}
            {props.events.map((e) => (
              <div key={e.id} style={{
                borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.2)', padding: '11px 14px',
                transition: 'background 150ms',
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(56,189,248,0.8)', boxShadow: '0 0 6px rgba(56,189,248,0.5)'
                    }} />
                    <span style={{
                      fontSize: 14, fontWeight: 800, color: 'rgba(244,247,255,0.88)',
                      letterSpacing: '-0.2px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {e.title}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(219,227,244,0.38)', flexShrink: 0 }}>
                    {formatDate(e.createdAt)}
                  </span>
                </div>

                {/* Meta row */}
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 700, color: 'rgba(219,227,244,0.5)',
                    padding: '4px 9px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)'
                  }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {e.location}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>•</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 700, color: 'rgba(56,189,248,0.65)',
                    padding: '4px 9px', borderRadius: 999,
                    background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)'
                  }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Başlayır: {formatDate(e.startsAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}