import { api, type ApiEnvelope } from '../lib/api'

export type ChatbotReply = {
  message: string
  timestamp?: string
  tokensUsed?: number
  isSuccessful?: boolean
  errorMessage?: string | null
}

export async function sendMessage(body: { message: string; topic: string }, conversationId?: string) {
  const res = await api.post<ApiEnvelope<ChatbotReply>>(
    '/api/Chatbot/message',
    body,
    conversationId ? { params: { conversationId } } : undefined,
  )
  return res.data.data
}

