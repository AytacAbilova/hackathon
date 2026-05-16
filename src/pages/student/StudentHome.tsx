import StudentTopbar from '../../components/student/StudentTopbar'
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
    <div className="studentPage">
      <StudentTopbar title="Dashboard" placeholder="Axtarış..." />

      <section className="studentHeroCard">
        <div className="studentHeroLeft">
          <div className="studentHeroTitle">Xoş gəldin!</div>
          <div className="studentHeroSub">
            Bugünkü dərslərin və elanların buradadır. Akademik tərəqqin hər zaman nəzarətdə olsun.
          </div>

          <div className="studentHeroStats">
            <div className="studentMiniStat">
              <div className="studentMiniStatLabel">GPA</div>
              <div className="studentMiniStatValue">3.85</div>
            </div>
            <div className="studentMiniStat">
              <div className="studentMiniStatLabel">Davamiyyət</div>
              <div className="studentMiniStatValue">94%</div>
            </div>
          </div>
        </div>
        <div className="studentHeroRight">
          <div className="studentHeroVisual" aria-hidden="true" />
        </div>
      </section>

      <div className="studentGrid2">
        <section className="studentSectionCard">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Elanlar</div>
            <button type="button" className="studentLinkBtn">
              Hamısına bax
            </button>
          </div>
          <div className="studentStack">
            {props.announcements.length === 0 ? (
              <div className="studentEmpty">Elan yoxdur</div>
            ) : null}
            {props.announcements.map((a) => (
              <article key={a.id} className="studentListCard">
                <div className="studentListCardTop">
                  <span className="studentPill studentPillApproved">Approved</span>
                  <span className="studentMeta">{formatDate(a.createdAt)}</span>
                </div>
                <div className="studentListCardTitle">{a.title}</div>
                <div className="studentListCardText">{a.content}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="studentSectionCard">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Eventlər</div>
            <button type="button" className="studentLinkBtn">
              Təqvim
            </button>
          </div>
          <div className="studentStack">
            {props.events.length === 0 ? <div className="studentEmpty">Event yoxdur</div> : null}
            {props.events.map((e) => (
              <article key={e.id} className="studentEventCard">
                <div className="studentEventThumb" aria-hidden="true" />
                <div className="studentEventBody">
                  <div className="studentEventTop">
                    <div className="studentEventTitle">{e.title}</div>
                    <span className="studentPill studentPillInfo">{e.location}</span>
                  </div>
                  <div className="studentEventMeta">
                    <span>{formatDate(e.startsAt)}</span>
                    <span className="studentDot">•</span>
                    <span>{e.description || '—'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="studentQuickGrid">
        <button type="button" className="studentQuickCard" onClick={props.onGoLostFound}>
          <div className="studentQuickIcon studentQuickIconSearch" aria-hidden="true" />
          <div className="studentQuickTitle">Lost &amp; Found</div>
          <div className="studentQuickDesc">İtmiş əşyaları axtar və tap</div>
        </button>
        <button type="button" className="studentQuickCard" onClick={props.onGoTeamFinder}>
          <div className="studentQuickIcon studentQuickIconUsers" aria-hidden="true" />
          <div className="studentQuickTitle">Team Finder</div>
          <div className="studentQuickDesc">Layihə üçün komanda yığ</div>
        </button>
      </div>

      <div className="studentGrid2">
        <section className="studentSectionCard">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Lost &amp; Found</div>
            <button type="button" className="studentLinkBtn" onClick={props.onGoLostFound}>
              Hamısı
            </button>
          </div>
          <div className="studentStack">
            {props.lostFound.length === 0 ? <div className="studentEmpty">Paylaşım yoxdur</div> : null}
            {props.lostFound.map((p) => (
              <div key={p.id} className="studentRowCard">
                <div className="studentRowLeft">
                  <span className={p.type === 'lost' ? 'studentPill studentPillLost' : 'studentPill studentPillFound'}>
                    {p.type === 'lost' ? 'İtmiş' : 'Tapılmış'}
                  </span>
                  <div className="studentRowTitle">{p.itemTitle}</div>
                  <div className="studentMeta">{p.location}</div>
                </div>
                <div className="studentMeta">{formatDate(p.createdAt)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="studentSectionCard">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Team Finder</div>
            <button type="button" className="studentLinkBtn" onClick={props.onGoTeamFinder}>
              Hamısı
            </button>
          </div>
          <div className="studentStack">
            {props.teamPosts.length === 0 ? <div className="studentEmpty">Komanda elanı yoxdur</div> : null}
            {props.teamPosts.map((p) => (
              <div key={p.id} className="studentRowCard">
                <div className="studentRowLeft">
                  <div className="studentRowTitle">{p.title}</div>
                  <div className="studentTags">
                    {p.skills.slice(0, 4).map((s) => (
                      <span key={s} className="studentTag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="studentMeta">{formatDate(p.createdAt)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
