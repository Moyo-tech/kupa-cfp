"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Users,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  ExternalLink,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  conflictReason?: string
}

interface Interview {
  id: string
  candidateName: string
  candidatePosition: string
  candidateAvatar?: string
  interviewType: string
  date: string
  startTime: string
  endTime: string
  duration: number
  platform: string
  interviewers: string[]
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  timeZone: string
  meetingLink?: string
  preparationMaterials: string[]
  notes?: string
}

interface InterviewSchedulerProps {
  candidateName: string
  candidatePosition: string
  candidateTimeZone: string
  isOpen: boolean
  onClose: () => void
  onSchedule: (interview: Omit<Interview, "id">) => void
}

// Sample data
const sampleTimeSlots: TimeSlot[] = [
  { id: "1", date: "2024-01-29", startTime: "09:00", endTime: "09:30", available: true },
  { id: "2", date: "2024-01-29", startTime: "10:00", endTime: "11:00", available: true },
  {
    id: "3",
    date: "2024-01-29",
    startTime: "14:00",
    endTime: "15:30",
    available: false,
    conflictReason: "Blocked 2-4 PM daily",
  },
  { id: "4", date: "2024-01-30", startTime: "09:00", endTime: "10:00", available: true },
  { id: "5", date: "2024-01-30", startTime: "11:00", endTime: "12:00", available: true },
  {
    id: "6",
    date: "2024-01-31",
    startTime: "09:00",
    endTime: "09:30",
    available: false,
    conflictReason: "Available mornings only Fridays",
  },
]

const interviewTypes = [
  { value: "technical-screen", label: "Technical Screen", duration: 45 },
  { value: "system-design", label: "System Design", duration: 90 },
  { value: "culture-fit", label: "Culture Fit", duration: 30 },
  { value: "behavioral", label: "Behavioral Interview", duration: 60 },
  { value: "final-interview", label: "Final Interview", duration: 60 },
  { value: "phone-screening", label: "Phone Screening", duration: 30 },
]

const platforms = [
  { value: "zoom", label: "Zoom", icon: Video },
  { value: "teams", label: "Microsoft Teams", icon: Video },
  { value: "meet", label: "Google Meet", icon: Video },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "in-person", label: "In-Person", icon: MapPin },
]

const timeZones = [
  { value: "gmt+0", label: "GMT+0 (UTC)" },
  { value: "gmt+1", label: "GMT+1" },
  { value: "gmt+2", label: "GMT+2" },
  { value: "gmt+3", label: "GMT+3" },
  { value: "gmt+4", label: "GMT+4" },
  { value: "gmt+5", label: "GMT+5" },
  { value: "gmt+6", label: "GMT+6" },
  { value: "gmt+7", label: "GMT+7" },
  { value: "gmt+8", label: "GMT+8" },
  { value: "gmt+9", label: "GMT+9" },
  { value: "gmt+10", label: "GMT+10" },
  { value: "gmt+11", label: "GMT+11" },
  { value: "gmt+12", label: "GMT+12" },
  { value: "gmt-1", label: "GMT-1" },
  { value: "gmt-2", label: "GMT-2" },
  { value: "gmt-3", label: "GMT-3" },
  { value: "gmt-4", label: "GMT-4" },
  { value: "gmt-5", label: "GMT-5" },
  { value: "gmt-6", label: "GMT-6" },
  { value: "gmt-7", label: "GMT-7" },
  { value: "gmt-8", label: "GMT-8" },
  { value: "gmt-9", label: "GMT-9" },
  { value: "gmt-10", label: "GMT-10" },
  { value: "gmt-11", label: "GMT-11" },
]

// Add the CalendarView component
function CalendarView({
  selectedDate,
  onDateSelect,
  timeSlots,
  selectedSlot,
  onSlotSelect,
}: {
  selectedDate: string
  onDateSelect: (date: string) => void
  timeSlots: TimeSlot[]
  selectedSlot: string | null
  onSlotSelect: (slotId: string) => void
}) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)
  const todaySlots = timeSlots.filter((slot) => slot.date === selectedDate)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Select Date & Time</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {currentWeek.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateStr = date.toISOString().split("T")[0]
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === new Date().toISOString().split("T")[0]
          const hasSlots = timeSlots.some((slot) => slot.date === dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className={`p-2 text-center rounded-lg border transition-colors ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-500"
                  : isToday
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : hasSlots
                      ? "border-gray-200 hover:bg-gray-50"
                      : "border-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasSlots}
            >
              <div className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div className="text-sm">{date.getDate()}</div>
            </button>
          )
        })}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Available Times</h4>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {todaySlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => slot.available && onSlotSelect(slot.id)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedSlot === slot.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : slot.available
                    ? "border-gray-200 hover:bg-gray-50"
                    : "border-red-200 bg-red-50 cursor-not-allowed"
              }`}
              disabled={!slot.available}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {slot.startTime} - {slot.endTime}
                </span>
                {!slot.available && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
              {!slot.available && slot.conflictReason && (
                <p className="text-xs text-red-600 mt-1">{slot.conflictReason}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function InterviewScheduler({
  candidateName,
  candidatePosition,
  candidateTimeZone,
  isOpen,
  onClose,
  onSchedule,
}: InterviewSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [interviewType, setInterviewType] = useState(interviewTypes[0].value)
  const [platform, setPlatform] = useState(platforms[0].value)
  const [interviewers, setInterviewers] = useState(["Mike Johnson"])
  const [timeZone, setTimeZone] = useState("gmt+0")
  const [notes, setNotes] = useState("")

  const todaySlots = sampleTimeSlots.filter((slot) => slot.date === selectedDate)
  const selectedTimeSlot = todaySlots.find((slot) => slot.id === selectedSlot)

  const handleSubmit = () => {
    if (!selectedTimeSlot) return

    const selectedInterviewType = interviewTypes.find((type) => type.value === interviewType)
    const startTime = selectedTimeSlot.startTime
    const endTime = selectedTimeSlot.endTime
    const duration = selectedInterviewType ? selectedInterviewType.duration : 60

    const newInterview = {
      candidateName,
      candidatePosition,
      interviewType,
      date: selectedDate,
      startTime,
      endTime,
      duration,
      platform,
      interviewers,
      status: "scheduled",
      timeZone,
      notes,
      preparationMaterials: [],
    }

    onSchedule(newInterview)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Schedule a new interview for {candidateName}, {candidatePosition}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({type.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interviewers</Label>
              <Input
                type="text"
                placeholder="Add interviewers (comma-separated)"
                value={interviewers.join(", ")}
                onChange={(e) => setInterviewers(e.target.value.split(",").map((s) => s.trim()))}
              />
            </div>

            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select value={timeZone} onValueChange={setTimeZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes for the interviewers"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div>
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              timeSlots={sampleTimeSlots}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!selectedSlot}>
            Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add the sample upcoming interviews data
const sampleUpcomingInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Sarah Chen",
    candidatePosition: "Senior React Developer",
    interviewType: "Technical Screen",
    date: "2024-01-29",
    startTime: "10:00",
    endTime: "10:45",
    duration: 45,
    platform: "Zoom",
    interviewers: ["Mike Johnson", "Jennifer Smith"],
    status: "scheduled",
    timeZone: "GMT-5",
    meetingLink: "https://zoom.us/j/123456789",
    preparationMaterials: [
      "Resume Review Guide.pdf",
      "Technical Assessment Rubric.pdf",
      "React Interview Questions.pdf",
    ],
    notes: "Focus on React patterns and state management",
  },
  {
    id: "2",
    candidateName: "Marcus Johnson",
    candidatePosition: "Senior React Developer",
    interviewType: "System Design",
    date: "2024-01-30",
    startTime: "14:00",
    endTime: "15:30",
    duration: 90,
    platform: "Teams",
    interviewers: ["David Kim", "Sarah Wilson"],
    status: "scheduled",
    timeZone: "GMT-6",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
    preparationMaterials: ["System Design Template.pdf", "Architecture Examples.pdf"],
    notes: "Evaluate scalability thinking and system architecture knowledge",
  },
  {
    id: "3",
    candidateName: "Emily Rodriguez",
    candidatePosition: "Senior React Developer",
    interviewType: "Culture Fit",
    date: "2024-01-31",
    startTime: "11:00",
    endTime: "11:30",
    duration: 30,
    platform: "Google Meet",
    interviewers: ["Jennifer Smith"],
    status: "scheduled",
    timeZone: "GMT-8",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    preparationMaterials: ["Company Values Guide.pdf", "Team Culture Overview.pdf", "Behavioral Questions.pdf"],
    notes: "Assess cultural alignment and team fit",
  },
]

// Add the InterviewDetailsModal component
function InterviewDetailsModal({
  interview,
  isOpen,
  onClose,
}: {
  interview: Interview | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!interview) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformIcon = (platform: string) => {
    if (platform.includes("Zoom")) return <Video className="h-4 w-4" />
    if (platform.includes("Teams")) return <Video className="h-4 w-4" />
    if (platform.includes("Meet")) return <Video className="h-4 w-4" />
    if (platform.includes("Phone")) return <Phone className="h-4 w-4" />
    if (platform.includes("Person")) return <MapPin className="h-4 w-4" />
    return <Video className="h-4 w-4" />
  }

  const copyMeetingLink = () => {
    if (interview.meetingLink) {
      navigator.clipboard.writeText(interview.meetingLink)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              Interview Details - {interview.candidateName}
              <span className="text-sm font-normal text-muted-foreground ml-2">{interview.candidatePosition}</span>
            </div>
            <Badge className={getStatusColor(interview.status)} variant="secondary">
              {interview.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Complete interview information and preparation materials</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Date</Label>
                    <p>{new Date(interview.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Time</Label>
                    <p>
                      {interview.startTime} - {interview.endTime}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Duration</Label>
                    <p>{interview.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="font-medium">Type</Label>
                    <p>{interview.interviewType}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Platform</Label>
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(interview.platform)}
                      <span>{interview.platform}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium">Time Zone</Label>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{interview.timeZone}</span>
                    </div>
                  </div>
                </div>

                {interview.meetingLink && (
                  <div className="pt-4 border-t">
                    <Label className="font-medium">Meeting Link</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Interview
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyMeetingLink}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interviewers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {interview.interviewers.map((interviewer, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {interviewer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{interviewer}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preparation Materials</CardTitle>
              </CardHeader>
              <CardContent>
                {interview.preparationMaterials.length > 0 ? (
                  <div className="space-y-3">
                    {interview.preparationMaterials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{material}</p>
                            <p className="text-xs text-muted-foreground">Uploaded by team</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p>No preparation materials attached</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {interview.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{interview.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add the UpcomingInterviewsView component
export function UpcomingInterviewsView() {
  const [interviews, setInterviews] = useState<Interview[]>(sampleUpcomingInterviews)
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleScheduleInterview = (interview: Omit<Interview, "id">) => {
    const newInterview: Interview = {
      ...interview,
      id: Date.now().toString(),
    }
    setInterviews([...interviews, newInterview])
  }

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsDetailsModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformIcon = (platform: string) => {
    if (platform.includes("Zoom")) return <Video className="h-4 w-4" />
    if (platform.includes("Teams")) return <Video className="h-4 w-4" />
    if (platform.includes("Meet")) return <Video className="h-4 w-4" />
    if (platform.includes("Phone")) return <Phone className="h-4 w-4" />
    if (platform.includes("Person")) return <MapPin className="h-4 w-4" />
    return <Video className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground">Manage upcoming and completed interviews</p>
        </div>
        <Button onClick={() => setIsSchedulerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "scheduled").length}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    interviews.filter((i) => {
                      const interviewDate = new Date(`${i.date}T${i.startTime}`)
                      const today = new Date()
                      const diffTime = interviewDate.getTime() - today.getTime()
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 1 && diffDays >= 0
                    }).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Today/Tomorrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <Card
                key={interview.id}
                className="border-l-4 border-l-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleInterviewClick(interview)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={interview.candidateAvatar || "/placeholder.svg"}
                          alt={interview.candidateName}
                        />
                        <AvatarFallback>
                          {interview.candidateName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold">{interview.candidateName}</h4>
                          <p className="text-sm text-muted-foreground">{interview.candidatePosition}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(interview.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {interview.startTime} - {interview.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(interview.platform)}
                            <span>{interview.platform}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.timeZone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{interview.interviewType}</Badge>
                          <Badge className={getStatusColor(interview.status)} variant="secondary">
                            {interview.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{interview.duration} min</span>
                        </div>
                        {interview.preparationMaterials.length > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div className="flex flex-wrap gap-1">
                              {interview.preparationMaterials.slice(0, 2).map((material, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                  {material.length > 20 ? `${material.substring(0, 20)}...` : material}
                                </Badge>
                              ))}
                              {interview.preparationMaterials.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{interview.preparationMaterials.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle edit
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {interview.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <Label className="text-xs font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">{interview.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <InterviewScheduler
        candidateName="Sarah Chen"
        candidatePosition="Senior React Developer"
        candidateTimeZone="GMT-5"
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onSchedule={handleScheduleInterview}
      />

      <InterviewDetailsModal
        interview={selectedInterview}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}
