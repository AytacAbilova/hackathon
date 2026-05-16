import type { ReactNode } from 'react'

export default function AuthCard(props: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authHeader">
          <h1 className="authTitle">{props.title}</h1>
          <p className="authSubtitle">{props.subtitle}</p>
        </div>
        <div className="authBody">{props.children}</div>
        <div className="authFooter">{props.footer}</div>
      </div>
    </div>
  )
}