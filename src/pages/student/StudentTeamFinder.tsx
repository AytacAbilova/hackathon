import { useState } from 'react'
import StudentTopbar from '../../components/student/StudentTopbar'
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
    <div className="studentPage">
      <StudentTopbar title="Team Finder" placeholder="Komandalardan axtar..." />

      <div className="studentTeamLayout">
        <section className="studentFormCard">
          <div className="studentFormHeader">
            <div className="studentFormTitle">Yeni komanda elanı</div>
          </div>

          <div className="studentFormBody">
            <div className="studentFormFields">
              <InputField label="Başlıq" value={title} onChange={setTitle} placeholder="Məs: Mobil tətbiq üçün dizayner" />
              <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Layihə haqqında qısa məlumat verin..." />
              <InputField label="Bacarıqlar (Skills)" value={skillsRaw} onChange={setSkillsRaw} placeholder="UI/UX, Figma, React" />
              <InputField label="Əlaqə" value={contact} onChange={setContact} placeholder="Telegram, Email və ya WhatsApp" />
            </div>

            <button
              type="button"
              className="studentPrimaryBtn"
              onClick={() => {
                props.onCreate(title, description, skillsRaw, contact)
                setTitle('')
                setDescription('')
                setSkillsRaw('')
                setContact('')
              }}
              disabled={!title.trim() || !description.trim() || !skillsRaw.trim() || !contact.trim()}
            >
              Elanı paylaş
            </button>
          </div>
        </section>

        <section className="studentTeamFeed">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Komanda elanları</div>
            <div className="studentTeamFilters">
              <button type="button" className="studentFilterBtn">
                Filter
              </button>
              <button type="button" className="studentFilterBtn studentFilterBtnActive">
                Ən yeni
              </button>
            </div>
          </div>

          {props.posts.length === 0 ? <div className="studentEmpty">Elan yoxdur</div> : null}

          <div className="studentTeamStack">
            {props.posts.map((p) => (
              <article key={p.id} className="studentTeamCard">
                <div className="studentTeamCardTop">
                  <div className="studentTeamAuthor">
                    <div className="studentAvatarMini" aria-hidden="true" />
                    <div className="studentAuthorMeta">
                      <div className="studentAuthorName">{resolveName(p.createdByUserId)}</div>
                      <div className="studentMeta">{formatDate(p.createdAt)}</div>
                    </div>
                  </div>
                  <button type="button" className="studentApplyBtn">
                    Müraciət et
                  </button>
                </div>

                <div className="studentTeamTitle">{p.title}</div>
                <div className="studentTeamDesc">{p.description}</div>

                <div className="studentTags">
                  {p.skills.map((s) => (
                    <span key={s} className="studentTag">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="studentTeamBottom">
                  <div className="studentMeta mono">{p.contact}</div>
                  <button type="button" className="studentMsgBtn">
                    Mesaj yaz
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
