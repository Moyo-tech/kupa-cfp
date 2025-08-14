import type { Conversation, Message, ConversationParticipant } from "@/types/messaging"

export const sampleParticipants: ConversationParticipant[] = [
  {
    userId: "1",
    userName: "John Doe",
    userRole: "Hiring Manager",
    joinedAt: "2024-01-15T09:00:00Z",
    lastSeen: "2024-01-25T16:30:00Z",
  },
  {
    userId: "2",
    userName: "Jennifer Smith",
    userRole: "Senior Recruiter",
    joinedAt: "2024-01-15T09:00:00Z",
    lastSeen: "2024-01-25T17:45:00Z",
  },
  {
    userId: "3",
    userName: "Mike Johnson",
    userRole: "Engineering Manager",
    joinedAt: "2024-01-18T10:00:00Z",
    lastSeen: "2024-01-25T15:20:00Z",
  },
]

export const sampleConversations: Conversation[] = [
  {
    id: "1",
    candidateId: "1",
    candidateName: "Sarah Chen",
    candidatePosition: "Senior React Developer",
    participants: sampleParticipants,
    unreadCount: 3,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-25T17:45:00Z",
    priority: "urgent",
    tags: ["technical-interview", "follow-up"],
    lastMessage: {
      id: "msg-15",
      senderId: "2",
      senderName: "Jennifer Smith",
      senderRole: "Senior Recruiter",
      content:
        "Sarah's technical interview went really well. The team was impressed with her React knowledge and problem-solving approach.",
      timestamp: "2024-01-25T17:45:00Z",
      priority: "normal",
      attachments: [],
      readBy: [
        {
          userId: "2",
          userName: "Jennifer Smith",
          readAt: "2024-01-25T17:45:00Z",
        },
      ],
      reactions: [],
    },
  },
  {
    id: "2",
    candidateId: "2",
    candidateName: "Marcus Johnson",
    candidatePosition: "Senior React Developer",
    participants: sampleParticipants.slice(0, 2),
    unreadCount: 0,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-24T14:20:00Z",
    priority: "normal",
    tags: ["screening", "salary-negotiation"],
    lastMessage: {
      id: "msg-8",
      senderId: "1",
      senderName: "John Doe",
      senderRole: "Hiring Manager",
      content: "Let's schedule the final interview for next week. His salary expectations are within our range.",
      timestamp: "2024-01-24T14:20:00Z",
      priority: "normal",
      attachments: [],
      readBy: [
        {
          userId: "1",
          userName: "John Doe",
          readAt: "2024-01-24T14:20:00Z",
        },
        {
          userId: "2",
          userName: "Jennifer Smith",
          readAt: "2024-01-24T15:30:00Z",
        },
      ],
      reactions: [],
    },
  },
  {
    id: "3",
    candidateId: "3",
    candidateName: "Emily Rodriguez",
    candidatePosition: "Senior React Developer",
    participants: sampleParticipants,
    unreadCount: 1,
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
    priority: "low",
    tags: ["culture-fit", "references"],
    lastMessage: {
      id: "msg-12",
      senderId: "3",
      senderName: "Mike Johnson",
      senderRole: "Engineering Manager",
      content: "I've reviewed her portfolio and it looks solid. Ready to move forward with the offer.",
      timestamp: "2024-01-25T09:15:00Z",
      priority: "low",
      attachments: [],
      readBy: [
        {
          userId: "3",
          userName: "Mike Johnson",
          readAt: "2024-01-25T09:15:00Z",
        },
      ],
      reactions: [],
    },
  },
]

export const sampleMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "2",
    senderName: "Jennifer Smith",
    senderRole: "Senior Recruiter",
    content:
      "Hi team! I wanted to discuss Sarah Chen's application. She has excellent React experience and her portfolio is impressive.",
    timestamp: "2024-01-25T09:00:00Z",
    priority: "normal",
    attachments: [
      {
        id: "att-1",
        name: "sarah-chen-portfolio.pdf",
        type: "document",
        size: 2048000,
        url: "/attachments/sarah-chen-portfolio.pdf",
        uploadedAt: "2024-01-25T09:00:00Z",
      },
    ],
    readBy: [
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T09:00:00Z",
      },
      {
        userId: "1",
        userName: "John Doe",
        readAt: "2024-01-25T09:15:00Z",
      },
      {
        userId: "3",
        userName: "Mike Johnson",
        readAt: "2024-01-25T10:30:00Z",
      },
    ],
    reactions: [
      {
        emoji: "👍",
        users: ["1", "3"],
      },
    ],
  },
  {
    id: "msg-2",
    senderId: "1",
    senderName: "John Doe",
    senderRole: "Hiring Manager",
    content:
      "Thanks for sharing! I've reviewed her resume and I'm impressed with her experience at TechCorp. Let's schedule a technical interview.",
    timestamp: "2024-01-25T09:30:00Z",
    priority: "normal",
    attachments: [],
    readBy: [
      {
        userId: "1",
        userName: "John Doe",
        readAt: "2024-01-25T09:30:00Z",
      },
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T09:45:00Z",
      },
      {
        userId: "3",
        userName: "Mike Johnson",
        readAt: "2024-01-25T10:30:00Z",
      },
    ],
    reactions: [],
  },
  {
    id: "msg-3",
    senderId: "3",
    senderName: "Mike Johnson",
    senderRole: "Engineering Manager",
    content:
      "I can conduct the technical interview. What's her availability like? Also, should we focus on React patterns or include some system design questions?",
    timestamp: "2024-01-25T10:45:00Z",
    priority: "normal",
    attachments: [],
    readBy: [
      {
        userId: "3",
        userName: "Mike Johnson",
        readAt: "2024-01-25T10:45:00Z",
      },
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T11:00:00Z",
      },
      {
        userId: "1",
        userName: "John Doe",
        readAt: "2024-01-25T11:30:00Z",
      },
    ],
    reactions: [],
  },
  {
    id: "msg-4",
    senderId: "2",
    senderName: "Jennifer Smith",
    senderRole: "Senior Recruiter",
    content:
      "She's available Tuesday through Thursday afternoons. I'd suggest focusing on React patterns since that's what she'll be working with primarily. Here's her technical assessment results.",
    timestamp: "2024-01-25T14:20:00Z",
    priority: "normal",
    attachments: [
      {
        id: "att-2",
        name: "sarah-technical-assessment.pdf",
        type: "document",
        size: 1024000,
        url: "/attachments/sarah-technical-assessment.pdf",
        uploadedAt: "2024-01-25T14:20:00Z",
      },
      {
        id: "att-3",
        name: "coding-challenge-results.png",
        type: "image",
        size: 512000,
        url: "/attachments/coding-challenge-results.png",
        uploadedAt: "2024-01-25T14:20:00Z",
      },
    ],
    readBy: [
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T14:20:00Z",
      },
      {
        userId: "1",
        userName: "John Doe",
        readAt: "2024-01-25T15:00:00Z",
      },
    ],
    reactions: [
      {
        emoji: "📊",
        users: ["1"],
      },
    ],
  },
  {
    id: "msg-5",
    senderId: "1",
    senderName: "John Doe",
    senderRole: "Hiring Manager",
    content:
      "Excellent results! Let's schedule the interview for Wednesday at 2 PM. Mike, can you prepare some React-specific questions?",
    timestamp: "2024-01-25T15:30:00Z",
    priority: "urgent",
    attachments: [],
    readBy: [
      {
        userId: "1",
        userName: "John Doe",
        readAt: "2024-01-25T15:30:00Z",
      },
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T16:00:00Z",
      },
    ],
    reactions: [],
  },
  {
    id: "msg-6",
    senderId: "3",
    senderName: "Mike Johnson",
    senderRole: "Engineering Manager",
    content:
      "I'll prepare a mix of React hooks, state management, and performance optimization questions. Should take about 45 minutes.",
    timestamp: "2024-01-25T16:15:00Z",
    priority: "normal",
    attachments: [],
    readBy: [
      {
        userId: "3",
        userName: "Mike Johnson",
        readAt: "2024-01-25T16:15:00Z",
      },
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T16:30:00Z",
      },
    ],
    reactions: [
      {
        emoji: "✅",
        users: ["2"],
      },
    ],
  },
  {
    id: "msg-7",
    senderId: "2",
    senderName: "Jennifer Smith",
    senderRole: "Senior Recruiter",
    content:
      "Perfect! I'll send her the interview details and calendar invite. I'll also include the team structure document so she knows what to expect.",
    timestamp: "2024-01-25T17:00:00Z",
    priority: "normal",
    attachments: [
      {
        id: "att-4",
        name: "team-structure-overview.pdf",
        type: "document",
        size: 768000,
        url: "/attachments/team-structure-overview.pdf",
        uploadedAt: "2024-01-25T17:00:00Z",
      },
    ],
    readBy: [
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T17:00:00Z",
      },
    ],
    reactions: [],
  },
  {
    id: "msg-8",
    senderId: "2",
    senderName: "Jennifer Smith",
    senderRole: "Senior Recruiter",
    content:
      "Sarah's technical interview went really well. The team was impressed with her React knowledge and problem-solving approach.",
    timestamp: "2024-01-25T17:45:00Z",
    priority: "normal",
    attachments: [],
    readBy: [
      {
        userId: "2",
        userName: "Jennifer Smith",
        readAt: "2024-01-25T17:45:00Z",
      },
    ],
    reactions: [],
  },
]
