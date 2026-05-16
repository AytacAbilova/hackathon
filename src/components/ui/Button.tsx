import type { ReactNode } from 'react'

export default function Button(props: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const v = props.variant ?? 'primary'
  const className =
    v === 'primary'
      ? 'btn btnPrimary'
      : v === 'danger'
        ? 'btn btnDanger'
        : 'btn btnSecondary'
  return (
    <button
      type={props.type ?? 'button'}
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}