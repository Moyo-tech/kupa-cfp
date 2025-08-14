export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  senderAvatar?: string
  content: string
  timestamp: string
  priority: "urgent" | "normal" | "low"
  attachments: MessageAttachment[]
  readBy: MessageRead[]
  edited?: boolean
  editedAt?: string
  replyTo?: string
  reactions: MessageReaction[]
}

export interface MessageAttachment {
  id: string
  name: string
  type: "document" | "image" | "video" | "audio"
  size: number
  url: string
  uploadedAt: string
}

export interface MessageRead {
  userId: string
  userName: string
  readAt: string
}

export interface MessageReaction {
  emoji: string
  users: string[]
}

export interface Conversation {
  id: string
  candidateId: string
  candidateName: string
  candidatePosition: string
  candidateAvatar?: string
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  priority: "urgent" | "normal" | "low"
  tags: string[]
}

export interface ConversationParticipant {
  userId: string
  userName: string
  userRole: string
  userAvatar?: string
  joinedAt: string
  isTyping?: boolean
  lastSeen?: string
}

export interface TypingIndicator {
  userId: string
  userName: string
  conversationId: string
}
