import { useState } from 'react'
import Button from '../../components/ui/Button'
import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { TeamPost, User } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function StudentTeamFinder(props: {
  posts: TeamPost[]
  users: User[]
  onCreate: (title: string, description: string, skillsRaw: string, contact: string) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skillsRaw, setSkillsRaw] = useState('')
  const [contact, setContact] = useState('')

  const resolveName = (userId: string) =>
    props.users.find((u) => u.id === userId)?.fullName ?? '—'

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Team Finder</h2>
          <p className="pageSubtitle">Skill-lər mütləqdir, elanlar tarixə görə sıralanır</p>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Yeni komanda elanı</div>
              <div className="cardSubtitle">Skill-ləri vergül ilə ayırın</div>
            </div>
          </div>

          <div className="stack">
            <InputField label="Başlıq" value={title} onChange={setTitle} placeholder="Məs: Hackathon üçün UI/UX axtarırıq" />
            <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Nə üzərində işləyirsiniz, neçə nəfər lazımdır və s." />
            <InputField label="Skills (mütləq)" value={skillsRaw} onChange={setSkillsRaw} placeholder="React, Node.js, Figma" />
            <InputField label="Əlaqə (mütləq)" value={contact} onChange={setContact} placeholder="Telegram / Email" />
            <Button
              variant="primary"
              onClick={() => {
                props.onCreate(title, description, skillsRaw, contact)
                setTitle('')
                setDescription('')
                setSkillsRaw('')
                setContact('')
              }}
              disabled={!title.trim() || !description.trim() || !skillsRaw.trim() || !contact.trim()}
            >
              Elanı yerləşdir
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Komanda elanları</div>
              <div className="cardSubtitle">Ən yenilər yuxarıda</div>
            </div>
            <span className="chip">{props.posts.length}</span>
          </div>

          <div className="list">
            {props.posts.length === 0 ? <div className="empty">Elan yoxdur</div> : null}
            {props.posts.map((p) => (
              <div key={p.id} className="listItem">
                <div className="listTop">
                  <div className="listTitle">{p.title}</div>
                  <span className="muted">{formatDate(p.createdAt)}</span>
                </div>
                <div className="listBody">{p.description}</div>
                <div className="skillsRow">
                  {p.skills.map((s) => (
                    <span key={s} className="skill">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="listMeta">
                  <span className="muted">{resolveName(p.createdByUserId)}</span>
                </div>
                <div className="contactRow">
                  <span className="contactLabel">Əlaqə:</span>
                  <span className="mono">{p.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
