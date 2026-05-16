import type { Announcement, EventItem } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function TeacherHome(props: {
  approvedAnnouncements: Announcement[]
  events: EventItem[]
}) {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Müəllim paneli</h2>
          <p className="pageSubtitle">Elanlar və eventlərə sürətli baxış</p>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Son elanlar</div>
              <div className="cardSubtitle">Təsdiqlənmiş elanlar</div>
            </div>
          </div>
          <div className="list">
            {props.approvedAnnouncements.length === 0 ? <div className="empty">Elan yoxdur</div> : null}
            {props.approvedAnnouncements.map((a) => (
              <div key={a.id} className="listItem compact">
                <div className="listTop">
                  <div className="listTitle">{a.title}</div>
                  <span className="muted">{formatDate(a.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Son eventlər</div>
              <div className="cardSubtitle">Əlavə olunanlar</div>
            </div>
          </div>
          <div className="list">
            {props.events.length === 0 ? <div className="empty">Event yoxdur</div> : null}
            {props.events.map((e) => (
              <div key={e.id} className="listItem compact">
                <div className="listTop">
                  <div className="listTitle">{e.title}</div>
                  <span className="muted">{formatDate(e.createdAt)}</span>
                </div>
                <div className="listMeta">
                  <span className="muted">{e.location}</span>
                  <span className="dot">•</span>
                  <span className="muted">Başlayır: {formatDate(e.startsAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
