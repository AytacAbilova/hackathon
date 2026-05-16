import { useState } from 'react'
import StudentTopbar from '../../components/student/StudentTopbar'
import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { LostFoundPost, LostFoundStatus, User } from '../../types/models'
import { extractLostFoundLocation, formatDate, lostFoundStatusLabel } from '../../lib/utils'

export default function StudentLostFound(props: {
  posts: LostFoundPost[]
  users: User[]
  currentUserId: string
  onCreate: (
    status: LostFoundStatus,
    title: string,
    location: string,
    description: string,
    contact: string,
    imageUrl: string,
  ) => void
  onUpdate: (
    id: string,
    title: string,
    location: string,
    description: string,
    contact: string,
    imageUrl: string,
  ) => void
  onSetStatus: (id: string, status: LostFoundStatus) => void
  onDelete: (id: string) => void
}) {
  const [status, setStatus] = useState<LostFoundStatus>(0)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tab, setTab] = useState<'all' | 'lost' | 'found'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  const resolveName = (p: LostFoundPost) =>
    props.users.find((u) => u.id === p.createdByUserId)?.fullName ?? p.createdByName ?? '—'

  const visiblePosts =
    tab === 'lost'
      ? props.posts.filter((p) => p.status === 0)
      : tab === 'found'
        ? props.posts.filter((p) => p.status === 1)
        : props.posts

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
                  className={status === 0 ? 'studentToggleBtn studentToggleBtnActive' : 'studentToggleBtn'}
                  onClick={() => setStatus(0)}
                >
                  İtmiş
                </button>
                <button
                  type="button"
                  className={status === 1 ? 'studentToggleBtn studentToggleBtnActive' : 'studentToggleBtn'}
                  onClick={() => setStatus(1)}
                >
                  Tapılmış
                </button>
              </div>
            </label>

            <div className="studentFormFields">
              <InputField label="Əşya adı" value={title} onChange={setTitle} placeholder="Məs: MacBook Pro, Tələbə kartı" />
              <InputField label="Yer" value={location} onChange={setLocation} placeholder="Məs: Kitabxana, 302-ci otaq..." />
              <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Rəng, vəziyyəti və s. haqqında qısa məlumat..." />
              <InputField label="Əlaqə nömrəsi / Telegram" value={contact} onChange={setContact} placeholder="+994 50 000 00 00" />
              <InputField label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
            </div>

            <button
              type="button"
              className="studentPrimaryBtn"
              onClick={() => {
                props.onCreate(status, title, location, description, contact, imageUrl)
                setTitle('')
                setLocation('')
                setDescription('')
                setContact('')
                setImageUrl('')
              }}
              disabled={!title.trim() || !location.trim() || !contact.trim()}
            >
              Paylaş
            </button>
          </div>
        </section>

        <section className="studentLfFeed">
          <div className="studentSectionHeader">
            <div className="studentSectionTitle">Son paylaşımlar</div>
            <div className="studentTabs">
              <button
                type="button"
                className={tab === 'all' ? 'studentTab studentTabActive' : 'studentTab'}
                onClick={() => setTab('all')}
              >
                Hamısı
              </button>
              <button
                type="button"
                className={tab === 'lost' ? 'studentTab studentTabActive' : 'studentTab'}
                onClick={() => setTab('lost')}
              >
                İtmişlər
              </button>
              <button
                type="button"
                className={tab === 'found' ? 'studentTab studentTabActive' : 'studentTab'}
                onClick={() => setTab('found')}
              >
                Tapılanlar
              </button>
            </div>
          </div>

          {visiblePosts.length === 0 ? <div className="studentEmpty">Paylaşım yoxdur</div> : null}

          <div className="studentLfGrid">
            {visiblePosts.map((p) => (
              <article key={p.id} className="studentMediaCard">
                <div className="studentMediaThumb" aria-hidden="true" />
                <div className="studentMediaBody">
                  <div className="studentListCardTop">
                    <span
                      className={
                        p.status === 0
                          ? 'studentPill studentPillLost'
                          : p.status === 1
                            ? 'studentPill studentPillFound'
                            : 'studentPill studentPillInfo'
                      }
                    >
                      {lostFoundStatusLabel(p.status)}
                    </span>
                    <span className="studentMeta">{formatDate(p.createdAt)}</span>
                  </div>

                  <div className="studentMediaTitle">{p.title}</div>
                  <div className="studentMediaMeta">
                    <span className="studentMeta">{extractLostFoundLocation(p.description) || '—'}</span>
                    <span className="studentDot">•</span>
                    <span className="studentMeta">{resolveName(p)}</span>
                  </div>
                  <div className="studentMediaText">{p.description || '—'}</div>
                  <div className="studentMediaActions">
                    {p.createdByUserId === props.currentUserId ? (
                      <button
                        type="button"
                        className="studentSecondaryBtn"
                        onClick={() => {
                          setEditingId(p.id)
                          setTitle(p.title)
                          setContact(p.contact)
                          setImageUrl(p.imageUrl)
                          setLocation(extractLostFoundLocation(p.description))
                          const withoutLoc = p.description.replace(/^\s*(yer|location)\s*:\s*.*\n?/i, '')
                          setDescription(withoutLoc)
                        }}
                      >
                        Edit
                      </button>
                    ) : null}

                    {p.createdByUserId === props.currentUserId && p.status !== 2 ? (
                      <button
                        type="button"
                        className="studentTertiaryBtn"
                        onClick={() => props.onSetStatus(p.id, 2)}
                      >
                        Resolved
                      </button>
                    ) : null}

                    {p.createdByUserId === props.currentUserId ? (
                      <button
                        type="button"
                        className="studentTertiaryBtn"
                        onClick={() => props.onDelete(p.id)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                  <div className="studentMediaFooter">
                    <span className="studentMeta mono">{p.contact}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {editingId ? (
        <dialog className="adminModal" open>
          <div className="adminModalHeader">
            <div className="adminModalTitle">Lost &amp; Found Edit</div>
            <button type="button" className="adminMiniBtn" onClick={() => setEditingId(null)}>
              Close
            </button>
          </div>
          <div className="adminModalBody">
            <InputField label="Əşya adı" value={title} onChange={setTitle} placeholder="Əşya adı" />
            <InputField label="Yer" value={location} onChange={setLocation} placeholder="Yer" />
            <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Təsvir" />
            <InputField label="Əlaqə" value={contact} onChange={setContact} placeholder="Əlaqə" />
            <InputField label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
            <div className="adminModalActions">
              <button type="button" className="adminCta adminCtaGhost" onClick={() => setEditingId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="adminCta"
                onClick={() => {
                  props.onUpdate(editingId, title, location, description, contact, imageUrl)
                  setEditingId(null)
                }}
                disabled={!title.trim() || !location.trim() || !contact.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}
