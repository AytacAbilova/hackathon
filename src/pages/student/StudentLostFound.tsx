import { useState } from 'react'
import Button from '../../components/ui/Button'
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
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Lost & Found</h2>
          <p className="pageSubtitle">Əlaqə məlumatı mütləqdir, paylaşımlar tarixə görə sıralanır</p>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Yeni paylaşım</div>
              <div className="cardSubtitle">Lost / Found</div>
            </div>
          </div>

          <div className="stack">
            <label className="field">
              <span className="fieldLabel">Tip</span>
              <select className="select" value={type} onChange={(e) => setType(e.target.value as LostFoundType)}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </label>
            <InputField label="Əşya" value={itemTitle} onChange={setItemTitle} placeholder="Məs: Qara qulaqcıq" />
            <InputField label="Yer" value={location} onChange={setLocation} placeholder="Məs: 2-ci mərtəbə" />
            <TextAreaField label="Təsvir" value={description} onChange={setDescription} placeholder="Əlavə detal..." />
            <InputField label="Əlaqə (mütləq)" value={contact} onChange={setContact} placeholder="Telefon / Telegram / Email" />
            <Button
              variant="primary"
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
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Paylaşımlar</div>
              <div className="cardSubtitle">Ən yenilər yuxarıda</div>
            </div>
            <span className="chip">{props.posts.length}</span>
          </div>
          <div className="list">
            {props.posts.length === 0 ? <div className="empty">Paylaşım yoxdur</div> : null}
            {props.posts.map((p) => (
              <div key={p.id} className="listItem">
                <div className="listTop">
                  <div className="listTitle">
                    <span className={p.type === 'lost' ? 'pill pillWarn' : 'pill pillOk'}>
                      {p.type === 'lost' ? 'Lost' : 'Found'}
                    </span>{' '}
                    {p.itemTitle}
                  </div>
                  <span className="muted">{formatDate(p.createdAt)}</span>
                </div>
                <div className="listBody">{p.description || '—'}</div>
                <div className="listMeta">
                  <span className="muted">{p.location}</span>
                  <span className="dot">•</span>
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
