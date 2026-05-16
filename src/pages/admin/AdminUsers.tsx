import { useMemo, useState } from 'react'
import type { Role, User } from '../../types/models'
import { formatDate, roleLabel } from '../../lib/utils'
import Button from '../../components/ui/Button'
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

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">User list</h2>
          <p className="pageSubtitle">Bütün istifadəçilər və rollar</p>
        </div>
        <div className="actionsRow">
          <Button variant="primary" onClick={openCreate}>
            Yeni user
          </Button>
        </div>
      </div>
      <div className="card">
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Tarix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td className="mono">{u.email}</td>
                  <td>
                    <span className={`roleBadge role_${u.role}`}>{roleLabel(u.role)}</span>
                  </td>
                  <td className="muted">{formatDate(u.createdAt)}</td>
                  <td className="tableActions">
                    <button type="button" className="iconBtn" onClick={() => openEdit(u)}>
                      Edit
                    </button>
                    <button type="button" className="iconBtn iconBtnDanger" onClick={() => props.onDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open ? (
        <dialog className="modal" open>
          <div className="modalHeader">
            <div className="modalTitle">{mode === 'create' ? 'Yeni user' : 'User edit'}</div>
            <button
              type="button"
              className="iconBtn"
              onClick={() => {
                setOpen(false)
              }}
            >
              Bağla
            </button>
          </div>

          <div className="stack">
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

            <div className="actionsRow">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Ləğv et
              </Button>
              <Button variant="primary" onClick={submit} disabled={!canSubmit}>
                {mode === 'create' ? 'Yarat' : 'Yadda saxla'}
              </Button>
            </div>
          </div>
        </dialog>
      ) : null}
    </div>
  )
}
