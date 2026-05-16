import { useState } from 'react'
import Button from '../../components/ui/Button'
import { InputField, TextAreaField } from '../../components/ui/Fields'
import type { AnnouncementCategory } from '../../types/models'
import { announcementCategoryLabel } from '../../lib/utils'

export default function TeacherAnnouncements(props: {
  onCreate: (title: string, content: string, category: AnnouncementCategory) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<AnnouncementCategory>(2)

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Elan yaratma</h2>
          <p className="pageSubtitle">Yaradılan elan admin tərəfindən təsdiqlənəndən sonra görünəcək</p>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <InputField
            label="Başlıq"
            value={title}
            onChange={setTitle}
            placeholder="Məs: İmtahan cədvəli"
          />
          <TextAreaField
            label="Mətn"
            value={content}
            onChange={setContent}
            placeholder="Elanın detalları..."
          />
          <label className="field">
            <span className="fieldLabel">Category</span>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value) as AnnouncementCategory)}
            >
              {[1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>
                  {announcementCategoryLabel(c as AnnouncementCategory)}
                </option>
              ))}
            </select>
          </label>
          <div className="actionsRow">
            <Button
              variant="primary"
              onClick={() => {
                props.onCreate(title, content, category)
                setTitle('')
                setContent('')
              }}
              disabled={!title.trim() || !content.trim()}
            >
              Elanı göndər
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
