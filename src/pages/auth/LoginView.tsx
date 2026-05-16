import { useState } from 'react'
import AuthCard from '../../components/ui/AuthCard'
import Button from '../../components/ui/Button'
import { InputField } from '../../components/ui/Fields'

export default function LoginView(props: {
  onLogin: (email: string, password: string) => Promise<void>
  onGoRegister: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <AuthCard
      title="Login"
      subtitle="Akademiya platformasına giriş edin"
      footer={
        <div className="authFooterRow">
          <span className="muted">Hesabın yoxdur?</span>
          <button className="linkBtn" type="button" onClick={props.onGoRegister}>
            Qeydiyyat
          </button>
        </div>
      }
    >
      <form
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault()
          if (loading) return
          setLoading(true)
          try {
            await props.onLogin(email.trim(), password)
          } finally {
            setLoading(false)
          }
        }}
      >
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
          placeholder="••••••••"
        />
        <Button
          variant="primary"
          onClick={async () => {
            if (loading) return
            setLoading(true)
            try {
              await props.onLogin(email.trim(), password)
            } finally {
              setLoading(false)
            }
          }}
          disabled={!email.trim() || !password || loading}
        >
          {loading ? 'Yoxlanır...' : 'Daxil ol'}
        </Button>
      </form>

      {/* <div className="demoBox">
        <div className="demoTitle">Demo hesablar</div>
        <div className="demoGrid">
          <div className="demoItem">
            <div className="demoRole">Admin</div>
            <div className="demoMeta">admin@academy.az / admin123</div>
          </div>
          <div className="demoItem">
            <div className="demoRole">Müəllim</div>
            <div className="demoMeta">teacher@academy.az / teacher123</div>
          </div>
          <div className="demoItem">
            <div className="demoRole">Tələbə</div>
            <div className="demoMeta">student@academy.az / student123</div>
          </div>
        </div>
      </div> */}
    </AuthCard>
  )
}
