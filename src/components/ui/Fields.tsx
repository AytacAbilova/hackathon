export function InputField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'email' | 'password' | 'datetime-local'
  placeholder?: string
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{props.label}</span>
      <input
        className="input"
        type={props.type ?? 'text'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete="off"
      />
    </label>
  )
}

export function TextAreaField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{props.label}</span>
      <textarea
        className="textarea"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        rows={props.rows ?? 5}
      />
    </label>
  )
}
