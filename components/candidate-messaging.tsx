"use client"

import type React from "react"
import { MessageSquare } from "lucide-react" // Import MessageSquare here

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
  Users,
  Calendar,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import type { Message } from "@/types/messaging"
import { sampleMessages, sampleParticipants } from "@/data/messaging"
import { allCandidates } from "@/data/candidates"

interface CandidateMessagingTabProps {
  candidateId: string
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
      className={`flex gap-4 ${isOwn ? "flex-row-reverse" : "flex-row"} group mb-6`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
          <AvatarFallback className="text-sm">
            {message.senderName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex-1 max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {showAvatar && (
          <div className={`flex items-center gap-3 mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-sm font-semibold text-gray-900">{message.senderName}</span>
            <span className="text-xs text-gray-500">{message.senderRole}</span>
            <span className="text-xs text-gray-400">
              {new Date(message.timestamp).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {getPriorityIcon(message.priority)}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 max-w-full ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

          {message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isOwn ? "bg-blue-400 border-blue-300" : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <div className={`p-2 rounded ${isOwn ? "bg-blue-300" : "bg-gray-100"}`}>
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isOwn ? "text-blue-50" : "text-gray-800"}`}>
                      {attachment.name}
                    </p>
                    <p className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                      {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      isOwn
                        ? "text-blue-100 hover:text-white hover:bg-blue-400"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {message.reactions.length > 0 && (
            <div className="flex gap-1 mt-3">
              {message.reactions.map((reaction, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`text-xs px-2 py-1 ${
                    isOwn ? "bg-blue-400 text-blue-100 border-blue-300" : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {reaction.emoji} {reaction.users.length}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {isOwn && getReadStatus()}
          {message.edited && <span className="text-xs text-gray-400">(edited)</span>}
        </div>
      </div>

      {showActions && (
        <div className={`flex items-start gap-1 mt-8 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
            onClick={() => onReply(message.id)}
          >
            <Reply className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          >
            <Smile className="h-4 w-4" />
          </Button>
          {isOwn && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                onClick={() => onEdit(message.id)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-4 w-4" />
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
    <div className="border-t bg-white p-6">
      {replyingTo && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800 mb-1">Replying to {replyingTo.senderName}</p>
              <p className="text-sm text-blue-700 line-clamp-2">{replyingTo.content}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancelReply} className="text-blue-600 hover:text-blue-800">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {typingUsers.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
          <span className="text-sm text-gray-600">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Attachments</Label>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] max-h-[200px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Select value={priority} onValueChange={(value: "urgent" | "normal" | "low") => setPriority(value)}>
              <SelectTrigger className={`w-28 h-9 text-xs ${getPriorityColor(priority)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
                <SelectItem value="normal">🔵 Normal</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 p-0 border-gray-300 hover:border-gray-400"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
              className="h-9 px-6 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
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
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mov"
      />
    </div>
  )
}

function ParticipantsPanel({ participants }: { participants: typeof sampleParticipants }) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.userAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {participant.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{participant.userName}</p>
                  <p className="text-xs text-gray-500">{participant.userRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {participant.lastSeen && (
                  <span className="text-xs text-gray-400">
                    Last seen {new Date(participant.lastSeen).toLocaleDateString()}
                  </span>
                )}
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </CardContent>
    </Card>
  )
}

export function CandidateMessagingTab({ candidateId }: CandidateMessagingTabProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [messageSearchQuery, setMessageSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showParticipants, setShowParticipants] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUserId = "1" // This would come from auth context
  const candidate = allCandidates.find((c) => c.id === candidateId)

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
  }

  const handleReply = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      setReplyingTo(message)
    }
  }

  const handleEdit = (messageId: string) => {
    console.log("Edit message:", messageId)
  }

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter((m) => m.id !== messageId))
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Candidate not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Team Communication</h3>
          <p className="text-gray-600">Collaborate with your team about {candidate.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={messageSearchQuery}
              onChange={(e) => setMessageSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
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
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Email Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b bg-gray-50 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={candidate.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {candidate.currentStage}
                </Badge>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-1">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h4>
                    <p className="text-gray-500 mb-4">
                      No messages yet. Send the first message to start collaborating with your team about{" "}
                      {candidate.name}.
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

            <MessageInput
              onSendMessage={handleSendMessage}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              typingUsers={typingUsers}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          {showParticipants && <ParticipantsPanel participants={sampleParticipants} />}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call Candidate
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Share Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            
            
          </Card>
        </div>
      </div>
    </div>
  )
}
