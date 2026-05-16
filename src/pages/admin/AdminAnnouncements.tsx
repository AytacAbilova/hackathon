import { useState } from 'react'
import Button from '../../components/ui/Button'
import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { Announcement, User } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function AdminAnnouncements(props: {
  pending: Announcement[]
  approved: Announcement[]
  users: User[]
  onApprove: (id: string) => void
  onDelete: (id: string) => void
  onCreate: (title: string, content: string) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const resolveName = (userId: string) =>
    props.users.find((u) => u.id === userId)?.fullName ?? '—'

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Elanlar</h2>
          <p className="pageSubtitle">Təsdiqləmə, silmə və admin tərəfindən elan yaratma</p>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Yeni elan</div>
              <div className="cardSubtitle">Admin elan yarada bilər (avtomatik təsdiqlənir)</div>
            </div>
          </div>
          <div className="stack">
            <InputField
              label="Başlıq"
              value={title}
              onChange={setTitle}
              placeholder="Məs: Tətil qrafiki"
            />
            <TextAreaField
              label="Mətn"
              value={content}
              onChange={setContent}
              placeholder="Elanın detalları..."
            />
            <Button
              variant="primary"
              onClick={() => {
                props.onCreate(title, content)
                setTitle('')
                setContent('')
              }}
              disabled={!title.trim() || !content.trim()}
            >
              Elanı dərc et
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Gözləyən elanlar</div>
              <div className="cardSubtitle">Təsdiqlənməyən elanlar</div>
            </div>
            <span className="chip">{props.pending.length}</span>
          </div>

          <div className="list">
            {props.pending.length === 0 ? <div className="empty">Gözləyən elan yoxdur</div> : null}
            {props.pending.map((a) => (
              <div key={a.id} className="listItem">
                <div className="listTop">
                  <div className="listTitle">{a.title}</div>
                  <span className="pill pillWarn">Pending</span>
                </div>
                <div className="listBody">{a.content}</div>
                <div className="listMeta">
                  <span className="muted">{formatDate(a.createdAt)}</span>
                  <span className="dot">•</span>
                  <span className="muted">{resolveName(a.createdByUserId)}</span>
                </div>
                <div className="actionsRow">
                  <Button variant="primary" onClick={() => props.onApprove(a.id)}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => props.onDelete(a.id)}>
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Təsdiqlənmiş elanlar</div>
            <div className="cardSubtitle">Tələbələrə görünən elanlar</div>
          </div>
          <span className="chip">{props.approved.length}</span>
        </div>
        <div className="list">
          {props.approved.length === 0 ? <div className="empty">Hələ elan yoxdur</div> : null}
          {props.approved.map((a) => (
            <div key={a.id} className="listItem">
              <div className="listTop">
                <div className="listTitle">{a.title}</div>
                <span className="pill pillOk">Approved</span>
              </div>
              <div className="listBody">{a.content}</div>
              <div className="listMeta">
                <span className="muted">{formatDate(a.createdAt)}</span>
                <span className="dot">•</span>
                <span className="muted">{resolveName(a.createdByUserId)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
