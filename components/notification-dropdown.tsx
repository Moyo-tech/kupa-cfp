"use client"

import type React from "react"

import { useState } from "react"
import {
  Bell,
  Calendar,
  MessageSquare,
  Users,
  Award,
  Clock,
  TrendingUp,
  Settings,
  Check,
  CheckCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Notification } from "@/types/notifications"
import { sampleNotifications } from "@/data/notifications"

interface NotificationDropdownProps {
  onViewAll: () => void
  onViewCandidate?: (candidateId: string) => void
  onViewRole?: (roleId: string) => void
}

export function NotificationDropdown({ onViewAll, onViewCandidate, onViewRole }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.isRead && !n.isArchived).slice(0, 5)
  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "interviews":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "feedback":
        return <MessageSquare className="h-4 w-4 text-orange-600" />
      case "applications":
        return <Users className="h-4 w-4 text-green-600" />
      case "offers":
        return <Award className="h-4 w-4 text-purple-600" />
      case "deadlines":
        return <Clock className="h-4 w-4 text-red-600" />
      case "status-updates":
        return <TrendingUp className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))

    // Navigate to relevant page
    if (notification.candidateId && onViewCandidate) {
      onViewCandidate(notification.candidateId)
    } else if (notification.roleId && onViewRole) {
      onViewRole(notification.roleId)
    }

    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onViewAll}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {unreadNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
              <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-2">
              {unreadNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <Card
                    className="cursor-pointer hover:bg-gray-50 transition-colors border-0 shadow-none"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getCategoryIcon(notification.category)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{notification.title}</h4>
                            <div className="flex items-center gap-1 ml-2">
                              {notification.actionRequired && (
                                <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {notification.candidateName && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.candidateName}
                                </Badge>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < unreadNotifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {unreadNotifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="outline" className="w-full bg-transparent" onClick={onViewAll}>
              View All Notifications
              {unreadCount > 5 && (
                <Badge variant="secondary" className="ml-2">
                  +{unreadCount - 5} more
                </Badge>
              )}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
