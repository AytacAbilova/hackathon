import { useState } from 'react'
import StudentTopbar from '../../components/student/StudentTopbar'
import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { LostFoundPost, LostFoundType, User } from '../../types/models'
import { formatDate } from '../../lib/utils'

export default function StudentLostFound(props: {
  posts: LostFoundPost[]
  users: User[]
  onCreate: (
    type: LostFoundType,
    itemTitle: string,
    location: string,
    description: string,
    contact: string,
  ) => void
}) {
  const [type, setType] = useState<LostFoundType>('lost')
  const [itemTitle, setItemTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')

  const resolveName = (userId: string) =>
    props.users.find((u) => u.id === userId)?.fullName ?? '—'

  return (
    <div className="studentPage">
      <StudentTopbar title="İtmiş Əşyalar" placeholder="Əşya və ya yer axtarın..." />

      <div className="studentLfLayout">
        <section className="studentFormCard">
          <div className="studentFormHeader">
            <div className="studentFormTitle">Yeni paylaşım</div>
          </div>

          <div className="studentFormBody">
            <label className="studentField">
              <span className="studentFieldLabel">Tip</span>
              <div className="studentToggle">
                <button
                  type="button"
                  className={type === 'lost' ? 'studentToggleBtn studentToggleBtnActive' : 'studentToggleBtn'}
                  onClick={() => setType('lost')}
                >
                  İtmiş
                </button>
                <button
                  type="button"
                  className={type === 'found' ? 'studentToggleBtn studentToggleBtnActive' : 'studentToggleBtn'}
                  onClick={() => setType('found')}
                >
                  Tapılmış
                </button>
              </div>
            </label>

            <div className="studentFormFields">
              <InputField label="Əşya adı" value={itemTitle} onChange={setItemTitle} placeholder="Məs: MacBook Pro, Tələbə kartı" />
              <InputField label="Yer" value={location} onChange={setLocation} placeholder="Məs: Kitabxana, 302-ci otaq..." />
              <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Rəng, vəziyyəti və s. haqqında qısa məlumat..." />
              <InputField label="Əlaqə nömrəsi / Telegram" value={contact} onChange={setContact} placeholder="+994 50 000 00 00" />
            </div>

            <button
              type="button"
              className="studentPrimaryBtn"
              onClick={() => {
                props.onCreate(type, itemTitle, location, description, contact)
                setItemTitle('')
                setLocation('')
                setDescription('')
                setContact('')
              }}
              disabled={!itemTitle.trim() || !location.trim() || !contact.trim()}
            >
              Paylaş
            </button>
          </div>
        </section>

        <section className="studentLfFeed">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Son paylaşımlar</div>
            <div className="studentTabs">
              <button type="button" className="studentTab studentTabActive">
                Hamısı
              </button>
              <button type="button" className="studentTab">
                İtmişlər
              </button>
              <button type="button" className="studentTab">
                Tapılanlar
              </button>
            </div>
          </div>

          {props.posts.length === 0 ? <div className="studentEmpty">Paylaşım yoxdur</div> : null}

          <div className="studentLfGrid">
            {props.posts.map((p) => (
              <article key={p.id} className="studentMediaCard">
                <div className="studentMediaThumb" aria-hidden="true">
                  <span className={p.type === 'lost' ? 'studentPill studentPillLost' : 'studentPill studentPillFound'}>
                    {p.type === 'lost' ? 'İtmiş' : 'Tapılmış'}
                  </span>
                </div>
                <div className="studentMediaBody">
                  <div className="studentMediaTitle">{p.itemTitle}</div>
                  <div className="studentMediaMeta">
                    <span className="studentMeta">{p.location}</span>
                    <span className="studentDot">•</span>
                    <span className="studentMeta">{formatDate(p.createdAt)}</span>
                  </div>
                  <div className="studentMediaText">{p.description || '—'}</div>
                  <div className="studentMediaActions">
                    <button type="button" className="studentSecondaryBtn">
                      Sahibi ilə əlaqə
                    </button>
                    <button type="button" className="studentTertiaryBtn">
                      Detallara bax
                    </button>
                  </div>
                  <div className="studentMediaFooter">
                    <span className="studentMeta">{resolveName(p.createdByUserId)}</span>
                    <span className="studentMeta mono">{p.contact}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
