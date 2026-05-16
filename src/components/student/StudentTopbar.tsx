import { useState } from 'react'

export default function StudentTopbar(props: {
  title: string
  placeholder?: string
  onSearch?: (q: string) => void
}) {
  const [q, setQ] = useState('')

  return (
    <div className="studentTopbar">
      <div className="studentTopbarLeft">
        <div className="studentPageTitle">{props.title}</div>
      </div>

      <div className="studentSearch">
        <span className="studentSearchIcon" aria-hidden="true" />
        <input
          className="studentSearchInput"
          value={q}
          onChange={(e) => {
            const v = e.target.value
            setQ(v)
            props.onSearch?.(v)
          }}
          placeholder={props.placeholder ?? 'Axtarış...'}
        />
      </div>

      <div className="studentTopbarRight">
        <button type="button" className="studentIconBtn" aria-label="Notifications" />
        <button type="button" className="studentIconBtn studentIconBtnGear" aria-label="Settings" />
        <button type="button" className="studentIconBtn studentIconBtnUser" aria-label="Account" />
      </div>
    </div>
  )
}

