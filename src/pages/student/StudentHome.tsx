import Button from '../../components/ui/Button'
import type { Announcement, EventItem, LostFoundPost, TeamPost } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function StudentHome(props: {
  announcements: Announcement[]
  events: EventItem[]
  lostFound: LostFoundPost[]
  teamPosts: TeamPost[]
  onGoLostFound: () => void
  onGoTeamFinder: () => void
}) {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Dashboard</h2>
          <p className="pageSubtitle">Elanlar, eventlər və tələbə bölmələri</p>
        </div>
        <div className="actionsRow">
          <Button variant="secondary" onClick={props.onGoLostFound}>
            Lost & Found
          </Button>
          <Button variant="secondary" onClick={props.onGoTeamFinder}>
            Team Finder
          </Button>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Elanlar</div>
              <div className="cardSubtitle">Tarixə görə sıralanır</div>
            </div>
          </div>
          <div className="list">
            {props.announcements.length === 0 ? <div className="empty">Elan yoxdur</div> : null}
            {props.announcements.map((a) => (
              <div key={a.id} className="listItem">
                <div className="listTop">
                  <div className="listTitle">{a.title}</div>
                  <span className="pill pillOk">Approved</span>
                </div>
                <div className="listBody">{a.content}</div>
                <div className="listMeta">
                  <span className="muted">{formatDate(a.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Eventlər</div>
              <div className="cardSubtitle">Tarixə görə sıralanır</div>
            </div>
          </div>
          <div className="list">
            {props.events.length === 0 ? <div className="empty">Event yoxdur</div> : null}
            {props.events.map((e) => (
              <div key={e.id} className="listItem">
                <div className="listTop">
                  <div className="listTitle">{e.title}</div>
                  <span className="pill pillInfo">{e.location}</span>
                </div>
                <div className="listBody">{e.description || '—'}</div>
                <div className="listMeta">
                  <span className="muted">Başlayır: {formatDate(e.startsAt)}</span>
                  <span className="dot">•</span>
                  <span className="muted">Yaradılıb: {formatDate(e.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Lost & Found</div>
              <div className="cardSubtitle">Son paylaşımlar</div>
            </div>
            <Button variant="secondary" onClick={props.onGoLostFound}>
              Aç
            </Button>
          </div>
          <div className="list">
            {props.lostFound.length === 0 ? <div className="empty">Paylaşım yoxdur</div> : null}
            {props.lostFound.map((p) => (
              <div key={p.id} className="listItem compact">
                <div className="listTop">
                  <div className="listTitle">
                    <span className={p.type === 'lost' ? 'pill pillWarn' : 'pill pillOk'}>
                      {p.type === 'lost' ? 'Lost' : 'Found'}
                    </span>{' '}
                    {p.itemTitle}
                  </div>
                  <span className="muted">{formatDate(p.createdAt)}</span>
                </div>
                <div className="listMeta">
                  <span className="muted">{p.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Team Finder</div>
              <div className="cardSubtitle">Son komanda elanları</div>
            </div>
            <Button variant="secondary" onClick={props.onGoTeamFinder}>
              Aç
            </Button>
          </div>
          <div className="list">
            {props.teamPosts.length === 0 ? <div className="empty">Komanda elanı yoxdur</div> : null}
            {props.teamPosts.map((p) => (
              <div key={p.id} className="listItem compact">
                <div className="listTop">
                  <div className="listTitle">{p.title}</div>
                  <span className="muted">{formatDate(p.createdAt)}</span>
                </div>
                <div className="skillsRow">
                  {p.skills.slice(0, 4).map((s) => (
                    <span key={s} className="skill">
                      {s}
                    </span>
                  ))}
                  {p.skills.length > 4 ? <span className="muted">+{p.skills.length - 4}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}