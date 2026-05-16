import { useMemo, useState } from 'react'
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
  const [category, setCategory] = useState<'Academic' | 'Career' | 'General'>('Academic')
  const [tab, setTab] = useState<'all' | 'approved' | 'pending'>('all')

  const resolveName = (userId: string) =>
    props.users.find((u) => u.id === userId)?.fullName ?? '—'

  const list = useMemo(() => {
    if (tab === 'approved') return props.approved
    if (tab === 'pending') return props.pending
    return [...props.pending, ...props.approved].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    )
  }, [props.approved, props.pending, tab])

  return (
    <div className="adminPage">
      <div className="adminSectionGrid">
        <section className="adminCard adminCardPadded">
          <div className="adminCardHeader">
            <div>
              <div className="adminCardTitle">Yeni Elan Yarat</div>
              <div className="adminCardSubtitle">Kampus ictimaiyyətinə yenilikləri hazırlayın, idarə edin və yayımlayın.</div>
            </div>
          </div>

          <div className="adminFormGrid">
            <div className="adminFormCol">
              <InputField label="Elanın Başlığı" value={title} onChange={setTitle} placeholder="məs. Payız İmtahan Cədvəli Yeniləndi" />
              <TextAreaField label="Məzmun" value={content} onChange={setContent} placeholder="Elanınızın tam təfərrüatlarını buraya daxil edin..." rows={6} />
            </div>
            <div className="adminFormSide">
              <label className="field">
                <span className="fieldLabel">Kateqoriya</span>
                <select className="select" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                  <option value="Academic">Akademik</option>
                  <option value="Career">Karyera</option>
                  <option value="General">Ümumi</option>
                </select>
              </label>

              <div className="adminHintBox">
                Elanlar bütün tələbə və müəllimlərə göndərilə bilər. Mesajları aydın və əməli saxlayın.
              </div>

              <button
                type="button"
                className="adminCta adminCtaFull"
                onClick={() => {
                  props.onCreate(title, content)
                  setTitle('')
                  setContent('')
                }}
                disabled={!title.trim() || !content.trim()}
              >
                Elanı Yayımla
              </button>
            </div>
          </div>
        </section>

        <section className="adminCard adminCardPadded">
          <div className="adminCardHeader adminCardHeaderRow">
            <div>
              <div className="adminCardTitle">Aktiv Elanlar</div>
              <div className="adminCardSubtitle">Mövcud elanları nəzərdən keçirin və idarə edin.</div>
            </div>
            <div className="adminTabs">
              <button
                type="button"
                className={tab === 'all' ? 'adminTab adminTabActive' : 'adminTab'}
                onClick={() => setTab('all')}
              >
                Hamısı
              </button>
              <button
                type="button"
                className={tab === 'approved' ? 'adminTab adminTabActive' : 'adminTab'}
                onClick={() => setTab('approved')}
              >
                Təsdiqlənmiş
              </button>
              <button
                type="button"
                className={tab === 'pending' ? 'adminTab adminTabActive' : 'adminTab'}
                onClick={() => setTab('pending')}
              >
                Gözləyən
              </button>
            </div>
          </div>

          {list.length === 0 ? <div className="adminEmpty">Elan yoxdur</div> : null}

          <div className="adminAnnouncementList">
            {list.map((a) => {
              const isPending = a.status === 'pending'
              return (
                <article key={a.id} className="adminAnnouncementCard">
                  <div className="adminAnnouncementTop">
                    <div className="adminAnnouncementMeta">
                      <span className={isPending ? 'adminPill adminPillWarn' : 'adminPill adminPillOk'}>
                        {isPending ? 'Gözləyən' : 'Təsdiqlənmiş'}
                      </span>
                      <span className="adminMeta">{formatDate(a.createdAt)}</span>
                      <span className="adminDot">•</span>
                      <span className="adminMeta">{resolveName(a.createdByUserId)}</span>
                    </div>
                    <div className="adminAnnouncementActions">
                      {isPending ? (
                        <button type="button" className="adminMiniBtn" onClick={() => props.onApprove(a.id)}>
                          Təsdiqlə
                        </button>
                      ) : null}
                      {isPending ? (
                        <button type="button" className="adminMiniBtn adminMiniBtnDanger" onClick={() => props.onDelete(a.id)}>
                          Sil
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="adminAnnouncementTitle">{a.title}</div>
                  <div className="adminAnnouncementBody">{a.content}</div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}