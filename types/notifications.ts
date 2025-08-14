export interface Notification {
  id: string
  title: string
  message: string
  category: "interviews" | "feedback" | "applications" | "offers" | "deadlines" | "status-updates"
  priority: "high" | "medium" | "low"
  timestamp: string
  isRead: boolean
  isArchived: boolean
  candidateId?: string
  candidateName?: string
  roleId?: string
  roleTitle?: string
  actionRequired?: boolean
  dueDate?: string
  relatedUrl?: string
}

export interface NotificationCategory {
  id: string
  name: string
  count: number
  unreadCount: number
  icon: string
  color: string
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  browserPush: boolean
  categories: {
    interviews: boolean
    feedback: boolean
    applications: boolean
    offers: boolean
    deadlines: boolean
    statusUpdates: boolean
  }
  frequency: "immediate" | "hourly" | "daily" | "weekly"
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export interface NotificationFilters {
  timeframe: "today" | "this-week" | "all"
  status: "all" | "unread" | "read"
  priority: "all" | "high" | "medium" | "low"
  category: "all" | "interviews" | "feedback" | "applications" | "offers" | "deadlines" | "status-updates"
}
