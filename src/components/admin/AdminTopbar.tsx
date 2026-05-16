import { useState } from 'react'

export default function AdminTopbar(props: {
  title: string
  subtitle?: string
  placeholder?: string
  onSearch?: (q: string) => void
}) {
  const [q, setQ] = useState('')

  return (
    <div className="adminTopbar">
      <div className="adminTopbarLeft">
        <div className="adminTopTitle">{props.title}</div>
        {props.subtitle ? <div className="adminTopSubtitle">{props.subtitle}</div> : null}
      </div>

      <div className="adminSearch">
        <span className="adminSearchIcon" aria-hidden="true" />
        <input
          className="adminSearchInput"
          value={q}
          onChange={(e) => {
            const v = e.target.value
            setQ(v)
            props.onSearch?.(v)
          }}
          placeholder={props.placeholder ?? 'Axtar...'}
        />
      </div>

      <div className="adminTopbarRight">
        <button type="button" className="adminIconBtn" aria-label="Bildirişlər" />
        <button type="button" className="adminIconBtn adminIconBtnGear" aria-label="Parametrlər" />
        <button type="button" className="adminIconBtn adminIconBtnUser" aria-label="Hesab" />
      </div>
    </div>
  )
}