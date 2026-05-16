import type { User } from '../../types/models'
import { formatDate, roleLabel } from '../../lib/utils'

export default function AdminUsers(props: { users: User[] }) {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">User list</h2>
          <p className="pageSubtitle">Bütün istifadəçilər və rollar</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
