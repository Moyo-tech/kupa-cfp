"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Download,
  MoreHorizontal,
  Phone,
  Video,
  UserPlus,
  AlertCircle,
  Clock,
  Check,
  CheckCheck,
  Smile,
  Reply,
  Edit3,
  Trash2,
  X,
  ArrowLeft,
  Filter,
  Star,
  Archive,
  Users,
  Calendar,
  MapPin,
  Mail,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import type { Conversation, Message } from "@/types/messaging"
import { sampleConversations, sampleMessages } from "@/data/messaging"
import { allCandidates } from "@/data/candidates"

interface ContextualMessagingProps {
  candidateId?: string
  onClose: () => void
}

function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}: {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50"
      case "normal":
        return "border-l-blue-500 bg-blue-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.candidatePosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Conversations</DropdownMenuItem>
              <DropdownMenuItem>Urgent Only</DropdownMenuItem>
              <DropdownMenuItem>Unread</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-all hover:shadow-sm border-l-4 ${getPriorityColor(
                conversation.priority,
              )} ${selectedConversationId === conversation.id ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.candidateAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {conversation.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{conversation.candidateName}</h4>
                      <div className="flex items-center gap-1">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.candidatePosition}</p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        <span className="font-medium">{conversation.lastMessage.senderName}:</span>{" "}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function MessageBubble({
  message,
  isOwn,
  showAvatar,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
}: {
  message: Message
  isOwn: boolean
  showAvatar: boolean
  onReply: (messageId: string) => void
  onEdit: (messageId: string) => void
  onDelete: (messageId: string) => void
  currentUserId: string
}) {
  const [showActions, setShowActions] = useState(false)

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "low":
        return <Clock className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  const getReadStatus = () => {
    const readByOthers = message.readBy.filter((read) => read.userId !== message.senderId)
    if (readByOthers.length === 0) {
      return <Check className="h-3 w-3 text-gray-400" />
    } else if (readByOthers.length === 1) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />
    } else {
      return <CheckCheck className="h-3 w-3 text-green-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div
      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-sm font-medium">{message.senderName}</span>
            <span className="text-xs text-muted-foreground">{message.senderRole}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {getPriorityIcon(message.priority)}
          </div>
        )}

        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-900 shadow-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    isOwn ? "bg-blue-400 border-blue-300" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {getFileIcon(attachment.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isOwn ? "text-blue-100" : "text-gray-700"}`}>
                      {attachment.name}
                    </p>
                    <p className={`text-xs ${isOwn ? "text-blue-200" : "text-gray-500"}`}>
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${
                      isOwn ? "text-blue-100 hover:text-white hover:bg-blue-400" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {message.reactions.map((reaction, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`text-xs px-1.5 py-0.5 ${
                    isOwn ? "bg-blue-400 text-blue-100" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {reaction.emoji} {reaction.users.length}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {isOwn && getReadStatus()}
          {message.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
        </div>
      </div>

      {showActions && (
        <div className={`flex items-center gap-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onReply(message.id)}
          >
            <Reply className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Smile className="h-3 w-3" />
          </Button>
          {isOwn && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onEdit(message.id)}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function MessageInput({
  onSendMessage,
  replyingTo,
  onCancelReply,
  typingUsers,
}: {
  onSendMessage: (content: string, priority: "urgent" | "normal" | "low", attachments: File[]) => void
  replyingTo: Message | null
  onCancelReply: () => void
  typingUsers: string[]
}) {
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<"urgent" | "normal" | "low">("normal")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), priority, attachments)
      setMessage("")
      setAttachments([])
      setPriority("normal")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="border-t bg-white p-4">
      {replyingTo && (
        <div className="mb-3 p-2 bg-gray-50 rounded border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Replying to {replyingTo.senderName}</p>
              <p className="text-sm truncate">{replyingTo.content}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelReply}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {typingUsers.length > 0 && (
        <div className="mb-2 text-xs text-muted-foreground">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
              <FileText className="h-4 w-4" />
              <span className="text-sm truncate max-w-[150px]">{file.name}</span>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeAttachment(index)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[60px] max-h-[120px] resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Select value={priority} onValueChange={(value: "urgent" | "normal" | "low") => setPriority(value)}>
              <SelectTrigger className={`w-20 h-8 text-xs ${getPriorityColor(priority)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
                <SelectItem value="normal">🔵 Normal</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button onClick={handleSend} disabled={!message.trim() && attachments.length === 0} className="h-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
      />
    </div>
  )
}

function CandidateContextSidebar({ candidateId }: { candidateId: string }) {
  const candidate = allCandidates.find((c) => c.id === candidateId)

  if (!candidate) return null

  return (
    <div className="w-80 border-l bg-gray-50 p-4">
      <div className="space-y-6">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarImage src={candidate.profileImage || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{candidate.name}</h3>
          <p className="text-muted-foreground">{candidate.position}</p>
          <Badge variant="outline" className="mt-2">
            {candidate.currentStage}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Contact Information</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Key Details</Label>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience:</span>
                <span>{candidate.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority:</span>
                <Badge
                  variant={
                    candidate.priority === "high"
                      ? "destructive"
                      : candidate.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {candidate.priority}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days in stage:</span>
                <span>{candidate.daysInStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied:</span>
                <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Skills</Label>
            <div className="mt-2 flex flex-wrap gap-1">
              {candidate.keySkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Recruiter</Label>
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {candidate.recruiter
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{candidate.recruiter}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <FileText className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Add Participants
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ContextualMessaging({ candidateId, onClose }: ContextualMessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    candidateId ? conversations.find((c) => c.candidateId === candidateId)?.id || null : conversations[0]?.id || null,
  )
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageSearchQuery, setMessageSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showParticipants, setShowParticipants] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUserId = "1" // This would come from auth context
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const filteredMessages = messages.filter((message) =>
    messageSearchQuery
      ? message.content.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
        message.senderName.toLowerCase().includes(messageSearchQuery.toLowerCase())
      : true,
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (content: string, priority: "urgent" | "normal" | "low", attachments: File[]) => {
    if (!selectedConversationId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: "John Doe",
      senderRole: "Hiring Manager",
      content,
      timestamp: new Date().toISOString(),
      priority,
      attachments: attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      })),
      readBy: [
        {
          userId: currentUserId,
          userName: "John Doe",
          readAt: new Date().toISOString(),
        },
      ],
      reactions: [],
      replyTo: replyingTo?.id,
    }

    setMessages([...messages, newMessage])
    setReplyingTo(null)

    // Update conversation last message
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString(),
            }
          : conv,
      ),
    )
  }

  const handleReply = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      setReplyingTo(message)
    }
  }

  const handleEdit = (messageId: string) => {
    // Implementation for editing messages
    console.log("Edit message:", messageId)
  }

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter((m) => m.id !== messageId))
  }

  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Conversations</h3>
            <p className="text-muted-foreground">Start a conversation with your team about candidates</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Team Messages</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {selectedConversation.participants.length}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Phone className="h-4 w-4 mr-2" />
                  Start Call
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Participant
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  Star Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedConversation.candidateAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedConversation.candidateName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedConversation.candidateName}</h3>
                <p className="text-sm text-muted-foreground">{selectedConversation.candidatePosition}</p>
              </div>
              <div className="flex gap-2">
                {selectedConversation.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-1 max-w-4xl mx-auto">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h4>
                  <p className="text-gray-500 mb-4">
                    No messages yet. Send the first message to start collaborating with your team about{" "}
                    {selectedConversation.candidateName}.
                  </p>
                </div>
              ) : (
                filteredMessages.map((message, index) => {
                  const prevMessage = index > 0 ? filteredMessages[index - 1] : null
                  const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId
                  const isOwn = message.senderId === currentUserId

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      currentUserId={currentUserId}
                    />
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="max-w-4xl mx-auto w-full">
            <MessageInput
              onSendMessage={handleSendMessage}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              typingUsers={typingUsers}
            />
          </div>
        </div>

        <CandidateContextSidebar candidateId={selectedConversation.candidateId} />
      </div>
    </div>
  )
}
