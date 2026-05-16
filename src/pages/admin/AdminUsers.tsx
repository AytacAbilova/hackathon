import { useMemo, useState } from 'react'
import type { Role, User } from '../../types/models'
import { formatDate, roleLabel } from '../../lib/utils'
import { InputField } from '../../components/ui/Fields'

type FormState = {
  id?: string
  fullName: string
  email: string
  password: string
  role: Role
}

const emptyForm: FormState = {
  fullName: '',
  email: '',
  password: '',
  role: 'student',
}

export default function AdminUsers(props: {
  users: User[]
  onCreate: (data: { fullName: string; email: string; password: string; role: Role }) => void
  onUpdate: (id: string, patch: { fullName: string; email: string; password?: string; role: Role }) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [search, setSearch] = useState('')

  const canSubmit = useMemo(() => {
    if (!form.fullName.trim()) return false
    if (!form.email.trim()) return false
    if (mode === 'create' && !form.password) return false
    return true
  }, [form.email, form.fullName, form.password, mode])

  const openCreate = () => {
    setMode('create')
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: User) => {
    setMode('edit')
    setForm({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      password: '',
      role: u.role,
    })
    setOpen(true)
  }

  const submit = () => {
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role,
    }

    if (mode === 'create') {
      props.onCreate({ ...payload, password: form.password })
      setOpen(false)
      return
    }

    if (!form.id) return
    props.onUpdate(form.id, {
      ...payload,
      ...(form.password ? { password: form.password } : {}),
    })
    setOpen(false)
  }

  const total = props.users.length
  const students = props.users.filter((u) => u.role === 'student').length
  const teachers = props.users.filter((u) => u.role === 'teacher').length

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return props.users
    return props.users.filter((u) => {
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      )
    })
  }, [props.users, search])

  return (
    <div className="adminPage">
      <div className="adminHero adminHeroTight">
        <div>
          <div className="adminWelcomeSmall">İcmanı İdarə Et</div>
          <div className="adminWelcomeSub">
            Bütün aktiv akademiya üzvlərini nəzərdən keçirin və idarə edin.
          </div>
        </div>
        <div className="adminHeroActions">
          <div className="adminInlineSearch">
            <span className="adminSearchIcon" aria-hidden="true" />
            <input
              className="adminSearchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İstifadəçi axtar..."
            />
          </div>
          <button type="button" className="adminCta" onClick={openCreate}>
            + İstifadəçi Əlavə Et
          </button>
        </div>
      </div>

      <div className="adminStatsGrid adminStatsGridTight">
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Ümumi İstifadəçilər</span>
            <span className="adminStatDelta">Bu ay +4%</span>
          </div>
          <div className="adminStatValue">{total}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Aktiv Tələbələr</span>
          </div>
          <div className="adminStatValue">{students}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Aktiv Müəllimlər</span>
          </div>
          <div className="adminStatValue">{teachers}</div>
        </div>
        <div className="adminStatCard">
          <div className="adminStatTop">
            <span className="adminStatLabel">Kataloq</span>
          </div>
          <div className="adminStatValue">{filteredUsers.length}</div>
        </div>
      </div>

      <section className="adminCard adminCardPadded">
        <div className="adminCardHeader adminCardHeaderRow">
          <div>
            <div className="adminCardTitle">İstifadəçi Kataloqu</div>
            <div className="adminCardSubtitle">{total} istifadəçidən {filteredUsers.length} nəfər göstərilir</div>
          </div>
        </div>

        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Yaradılma Tarixi</th>
                <th className="adminTableRight">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="adminMono">{u.id.slice(0, 8).toUpperCase()}</td>
                  <td>
                    <div className="adminUserCell">
                      <div className="adminUserAvatar">{u.fullName.trim().slice(0, 2).toUpperCase()}</div>
                      <div className="adminUserName">{u.fullName}</div>
                    </div>
                  </td>
                  <td className="adminMono">{u.email}</td>
                  <td>
                    <span className={`adminRolePill adminRole_${u.role}`}>{roleLabel(u.role)}</span>
                  </td>
                  <td className="adminMeta">{formatDate(u.createdAt)}</td>
                  <td className="adminTableRight">
                    <button type="button" className="adminMiniBtn" onClick={() => openEdit(u)}>
                      Redaktə
                    </button>
                    <button type="button" className="adminMiniBtn adminMiniBtnDanger" onClick={() => props.onDelete(u.id)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adminTableFooter">
          <div className="adminMeta">{filteredUsers.length} istifadəçidən 1-{Math.min(filteredUsers.length, 12)} göstərilir</div>
          <div className="adminPager" aria-hidden="true">
            <span className="adminPagerBtn adminPagerBtnActive">1</span>
            <span className="adminPagerBtn">2</span>
            <span className="adminPagerBtn">3</span>
          </div>
        </div>
      </section>

      {open ? (
        <dialog className="adminModal" open>
          <div className="adminModalHeader">
            <div className="adminModalTitle">{mode === 'create' ? 'İstifadəçi Əlavə Et' : 'İstifadəçini Redaktə Et'}</div>
            <button type="button" className="adminMiniBtn" onClick={() => setOpen(false)}>
              Bağla
            </button>
          </div>

          <div className="adminModalBody">
            <InputField
              label="Ad Soyad"
              value={form.fullName}
              onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
              placeholder="Ad Soyad"
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              placeholder="name@academy.az"
            />
            <InputField
              label={mode === 'create' ? 'Şifrə' : 'Yeni şifrə (boş burax = dəyişmə)'}
              type="password"
              value={form.password}
              onChange={(v) => setForm((p) => ({ ...p, password: v }))}
              placeholder="••••••••"
            />

            <label className="field">
              <span className="fieldLabel">Rol</span>
              <select
                className="select"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Müəllim</option>
                <option value="student">Tələbə</option>
              </select>
            </label>

            <div className="adminModalActions">
              <button type="button" className="adminCta adminCtaGhost" onClick={() => setOpen(false)}>
                Ləğv Et
              </button>
              <button type="button" className="adminCta" onClick={submit} disabled={!canSubmit}>
                {mode === 'create' ? 'Yarat' : 'Yadda Saxla'}
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}