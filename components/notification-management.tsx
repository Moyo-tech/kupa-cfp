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
  Filter,
  Settings,
  Check,
  CheckCheck,
  Archive,
  Trash2,
  Search,
  AlertCircle,
  Mail,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Notification, NotificationFilters, NotificationPreferences } from "@/types/notifications"
import { sampleNotifications, notificationCategories, defaultNotificationPreferences } from "@/data/notifications"

interface NotificationManagementProps {
  onViewCandidate?: (candidateId: string) => void
  onViewRole?: (roleId: string) => void
}

function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onToggleRead,
  onArchive,
  onDelete,
  onViewCandidate,
  onViewRole,
}: {
  notification: Notification
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
  onToggleRead: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onViewCandidate?: (candidateId: string) => void
  onViewRole?: (roleId: string) => void
}) {
  const [showActions, setShowActions] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

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

  const handleCandidateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.candidateId && onViewCandidate) {
      onViewCandidate(notification.candidateId)
    }
  }

  const handleRoleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.roleId && onViewRole) {
      onViewRole(notification.roleId)
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-sm border-l-4 ${getPriorityColor(
        notification.priority,
      )} ${notification.isRead ? "opacity-75" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(notification.id, checked as boolean)}
            className="mt-1"
          />

          <div className="flex-shrink-0 mt-1">{getCategoryIcon(notification.category)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium text-sm ${notification.isRead ? "text-gray-600" : "text-gray-900"}`}>
                    {notification.title}
                  </h4>
                  {notification.actionRequired && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      Action Required
                    </Badge>
                  )}
                  {notification.priority === "high" && <AlertCircle className="h-3 w-3 text-red-500" />}
                </div>
                <p className={`text-sm ${notification.isRead ? "text-gray-500" : "text-gray-700"}`}>
                  {notification.message}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</span>
                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                {notification.candidateName && (
                  <button
                    onClick={handleCandidateClick}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    {notification.candidateName}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                {notification.roleTitle && (
                  <button
                    onClick={handleRoleClick}
                    className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1"
                  >
                    {notification.roleTitle}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                {notification.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    Due: {new Date(notification.dueDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              {showActions && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleRead(notification.id)
                    }}
                    title={notification.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {notification.isRead ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onArchive(notification.id)
                    }}
                    title="Archive"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification.id)
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationFiltersComponent({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
}: {
  filters: NotificationFilters
  onFiltersChange: (filters: NotificationFilters) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          value={filters.timeframe}
          onValueChange={(value: any) => onFiltersChange({ ...filters, timeframe: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value: any) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread Only</SelectItem>
            <SelectItem value="read">Read Only</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value: any) => onFiltersChange({ ...filters, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value: any) => onFiltersChange({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="interviews">Interviews</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="applications">Applications</SelectItem>
            <SelectItem value="offers">Offers</SelectItem>
            <SelectItem value="deadlines">Deadlines</SelectItem>
            <SelectItem value="status-updates">Status Updates</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function NotificationPreferencesDialog({
  isOpen,
  onClose,
  preferences,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  preferences: NotificationPreferences
  onSave: (preferences: NotificationPreferences) => void
}) {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences)

  const handleSave = () => {
    onSave(localPreferences)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>Customize how and when you receive recruitment notifications</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Channels</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={localPreferences.email}
                    onCheckedChange={(checked) => setLocalPreferences({ ...localPreferences, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-sm font-medium">SMS Alerts</Label>
                      <p className="text-xs text-muted-foreground">Receive urgent notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={localPreferences.sms}
                    onCheckedChange={(checked) => setLocalPreferences({ ...localPreferences, sms: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-sm font-medium">Browser Push</Label>
                      <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                  </div>
                  <Switch
                    checked={localPreferences.browserPush}
                    onCheckedChange={(checked) => setLocalPreferences({ ...localPreferences, browserPush: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Categories</h3>

              <div className="space-y-3">
                {Object.entries(localPreferences.categories).map(([key, enabled]) => {
                  const category = notificationCategories.find(
                    (c) => c.id === key.replace(/([A-Z])/g, "-$1").toLowerCase(),
                  )
                  if (!category) return null

                  return (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${category.color}`}>
                          {category.icon === "Calendar" && <Calendar className="h-4 w-4" />}
                          {category.icon === "MessageSquare" && <MessageSquare className="h-4 w-4" />}
                          {category.icon === "Users" && <Users className="h-4 w-4" />}
                          {category.icon === "Award" && <Award className="h-4 w-4" />}
                          {category.icon === "Clock" && <Clock className="h-4 w-4" />}
                          {category.icon === "TrendingUp" && <TrendingUp className="h-4 w-4" />}
                        </div>
                        <div>
                          <Label className="text-sm font-medium">{category.name}</Label>
                          <p className="text-xs text-muted-foreground">
                            {category.count} notifications in this category
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setLocalPreferences({
                            ...localPreferences,
                            categories: { ...localPreferences.categories, [key]: checked },
                          })
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Schedule</h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Notification Frequency</Label>
                  <Select
                    value={localPreferences.frequency}
                    onValueChange={(value: any) => setLocalPreferences({ ...localPreferences, frequency: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Quiet Hours</Label>
                      <p className="text-xs text-muted-foreground">Disable notifications during specific hours</p>
                    </div>
                    <Switch
                      checked={localPreferences.quietHours.enabled}
                      onCheckedChange={(checked) =>
                        setLocalPreferences({
                          ...localPreferences,
                          quietHours: { ...localPreferences.quietHours, enabled: checked },
                        })
                      }
                    />
                  </div>

                  {localPreferences.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input
                          type="time"
                          value={localPreferences.quietHours.start}
                          onChange={(e) =>
                            setLocalPreferences({
                              ...localPreferences,
                              quietHours: { ...localPreferences.quietHours, start: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input
                          type="time"
                          value={localPreferences.quietHours.end}
                          onChange={(e) =>
                            setLocalPreferences({
                              ...localPreferences,
                              quietHours: { ...localPreferences.quietHours, end: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function NotificationManagement({ onViewCandidate, onViewRole }: NotificationManagementProps) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [filters, setFilters] = useState<NotificationFilters>({
    timeframe: "all",
    status: "all",
    priority: "all",
    category: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences)

  const filteredNotifications = notifications.filter((notification) => {
    if (notification.isArchived) return false

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      if (
        !notification.title.toLowerCase().includes(searchLower) &&
        !notification.message.toLowerCase().includes(searchLower) &&
        !notification.candidateName?.toLowerCase().includes(searchLower) &&
        !notification.roleTitle?.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }

    // Status filter
    if (filters.status === "read" && !notification.isRead) return false
    if (filters.status === "unread" && notification.isRead) return false

    // Priority filter
    if (filters.priority !== "all" && notification.priority !== filters.priority) return false

    // Category filter
    if (filters.category !== "all" && notification.category !== filters.category) return false

    // Timeframe filter
    if (filters.timeframe !== "all") {
      const now = new Date()
      const notificationDate = new Date(notification.timestamp)

      if (filters.timeframe === "today") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        if (notificationDate < today) return false
      } else if (filters.timeframe === "this-week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (notificationDate < weekAgo) return false
      }
    }

    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length

  const handleSelectNotification = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedNotifications([...selectedNotifications, id])
    } else {
      setSelectedNotifications(selectedNotifications.filter((nId) => nId !== id))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const handleBulkMarkAsRead = () => {
    setNotifications(notifications.map((n) => (selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n)))
    setSelectedNotifications([])
  }

  const handleBulkMarkAsUnread = () => {
    setNotifications(notifications.map((n) => (selectedNotifications.includes(n.id) ? { ...n, isRead: false } : n)))
    setSelectedNotifications([])
  }

  const handleBulkArchive = () => {
    setNotifications(notifications.map((n) => (selectedNotifications.includes(n.id) ? { ...n, isArchived: true } : n)))
    setSelectedNotifications([])
  }

  const handleBulkDelete = () => {
    setNotifications(notifications.filter((n) => !selectedNotifications.includes(n.id)))
    setSelectedNotifications([])
  }

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)))
  }

  const handleArchive = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isArchived: true } : n)))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on all recruitment activities and never miss important updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={() => setShowPreferences(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {notificationCategories.map((category) => (
          <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${category.color}`}>
                  {category.icon === "Calendar" && <Calendar className="h-4 w-4" />}
                  {category.icon === "MessageSquare" && <MessageSquare className="h-4 w-4" />}
                  {category.icon === "Users" && <Users className="h-4 w-4" />}
                  {category.icon === "Award" && <Award className="h-4 w-4" />}
                  {category.icon === "Clock" && <Clock className="h-4 w-4" />}
                  {category.icon === "TrendingUp" && <TrendingUp className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-lg font-bold">{category.count}</p>
                  <p className="text-xs text-muted-foreground">{category.name}</p>
                  {category.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      {category.unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark Read
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkMarkAsUnread}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark Unread
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchQuery || filters.status !== "all" || filters.category !== "all"
                  ? "Try adjusting your filters or search query"
                  : "You're all caught up! New notifications will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedNotifications.includes(notification.id)}
              onSelect={handleSelectNotification}
              onToggleRead={handleToggleRead}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onViewCandidate={onViewCandidate}
              onViewRole={onViewRole}
            />
          ))
        )}
      </div>

      {/* Preferences Dialog */}
      <NotificationPreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={setPreferences}
      />
    </div>
  )
}
