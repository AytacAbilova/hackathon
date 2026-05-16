import { useState } from 'react'
import AuthCard from '../../components/ui/AuthCard'
import Button from '../../components/ui/Button'
import { InputField } from '../../components/ui/Fields'

export default function RegisterView(props: {
  onRegister: (fullName: string, email: string, password: string) => void
  onGoLogin: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <AuthCard
      title="Qeydiyyat"
      subtitle="Tələbə hesabı yaradın"
      footer={
        <div className="authFooterRow">
          <span className="muted">Artıq hesabın var?</span>
          <button className="linkBtn" type="button" onClick={props.onGoLogin}>
            Login
          </button>
        </div>
      }
    >
      <div className="stack">
        <InputField
          label="Ad Soyad"
          value={fullName}
          onChange={setFullName}
          placeholder="Ad Soyad"
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@academy.az"
        />
        <InputField
          label="Şifrə"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Minimum 6 simvol"
        />
        <Button
          variant="primary"
          onClick={() => props.onRegister(fullName, email, password)}
          disabled={!fullName.trim() || !email.trim() || !password}
        >
          Qeydiyyat et
        </Button>
        <div className="hint">
          Rol avtomatik olaraq <span className="pill">Tələbə</span> təyin olunur.
        </div>
      </div>
    </AuthCard>
  )
}
