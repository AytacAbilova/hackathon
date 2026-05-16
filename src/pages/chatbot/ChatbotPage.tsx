import { useMemo, useRef, useState } from 'react'
import StudentTopbar from '../../components/student/StudentTopbar'
import { InputField } from '../../components/ui/Fields'
import { getApiErrorMessage } from '../../lib/api'
import * as chatbotService from '../../services/chatbot'

type Variant = 'student' | 'admin' | 'teacher'

type ChatItem = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export default function ChatbotPage(props: { variant: Variant }) {
  const [topic, setTopic] = useState('Academy Hub')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ChatItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Salam! Mən Academy Hub chatbotuyam. Suallarını yaz, kömək edim.',
    },
  ])

  const listRef = useRef<HTMLDivElement | null>(null)

  const containerClass = useMemo(() => {
    if (props.variant === 'admin') return 'adminPage'
    if (props.variant === 'student') return 'studentPage'
    return 'page'
  }, [props.variant])

  const showTopbar = props.variant === 'student'

  const send = async () => {
    const text = message.trim()
    if (!text || loading) return

    setLoading(true)
    setMessage('')
    setItems((prev) => [
      ...prev,
      { id: `u_${Date.now()}`, role: 'user', text },
    ])

    try {
      const reply = await chatbotService.sendMessage({ message: text, topic: topic.trim() })
      const botText =
        reply?.message ||
        (reply?.isSuccessful === false ? reply?.errorMessage || 'Xəta baş verdi' : '—')
      setItems((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', text: botText },
      ])
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
      })
    } catch (e) {
      setItems((prev) => [
        ...prev,
        { id: `e_${Date.now()}`, role: 'assistant', text: getApiErrorMessage(e) },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={containerClass}>
      {showTopbar ? <StudentTopbar title="Chatbot" placeholder="Mesajlarda axtar..." /> : null}

      <div className="chatShell">
        <div className="chatLeft">
          <div className="chatCard">
            <div className="chatCardTitle">Topic</div>
            <InputField label="Mövzu" value={topic} onChange={setTopic} placeholder="Məs: Dərs cədvəli" />
            <div className="chatHint">
              Topic cavabların kontekstini formalaşdırır. Məs: “Academic”, “Events”, “Announcements”.
            </div>
          </div>
        </div>

        <div className="chatRight">
          <div className="chatBoard">
            <div className="chatHeader">
              <div className="chatHeaderTitle">Academy Hub Assistant</div>
              <div className="chatHeaderMeta">{loading ? 'Yazır…' : 'Online'}</div>
            </div>

            <div className="chatMessages" ref={listRef}>
              {items.map((it) => (
                <div key={it.id} className={it.role === 'user' ? 'chatRow chatRowUser' : 'chatRow chatRowBot'}>
                  <div className={it.role === 'user' ? 'chatBubble chatBubbleUser' : 'chatBubble chatBubbleBot'}>
                    {it.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="chatComposer">
              <input
                className="chatInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesaj yazın..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void send()
                  }
                }}
                disabled={loading}
              />
              <button type="button" className="chatSendBtn" onClick={() => void send()} disabled={loading || !message.trim()}>
                Göndər
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
