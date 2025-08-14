"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Download,
  Upload,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CandidateFeedbackTab } from "./feedback-modal"
import { InterviewScheduler } from "./interview-scheduler"
import type { Candidate, Skill, Assessment, TimelineEvent, InterviewFeedback, ScreeningNote } from "@/types/candidate"
import { CandidateMessagingTab } from "./candidate-messaging"
import { SidebarProvider, SidebarInset, SidebarTrigger, AppSidebar } from "@/components/layout/sidebar"

// Sample data
const sampleCandidate: Candidate = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah.chen@email.com",
  phone: "+1 (555) 123-4567",
  position: "Senior React Developer",
  currentStage: "Technical Interview Completed",
  location: "San Francisco, CA",
  experience: "5+ years",
  expectedSalary: "$120,000 - $140,000",
  availability: "2 weeks notice",
  roleId: "1",
  daysInStage: 3,
  priority: "high",
  keySkills: ["React", "TypeScript", "Node.js"],
  recruiter: "Jennifer Smith",
  appliedDate: "2024-01-15",
}

const sampleSkills: Skill[] = [
  { name: "React", level: "Expert", verified: true },
  { name: "TypeScript", level: "Advanced", verified: true },
  { name: "Node.js", level: "Intermediate", verified: false },
  { name: "AWS", level: "Beginner", verified: false },
  { name: "GraphQL", level: "Advanced", verified: true },
  { name: "Docker", level: "Intermediate", verified: false },
  { name: "Jest", level: "Advanced", verified: true },
  { name: "Redux", level: "Expert", verified: true },
]

const sampleAssessments: Assessment[] = [
  {
    id: "1",
    name: "Technical Assessment",
    score: 85,
    maxScore: 100,
    completedDate: "2024-01-22",
    type: "technical",
  },
  {
    id: "2",
    name: "Culture Fit",
    score: 92,
    maxScore: 100,
    completedDate: "2024-01-20",
    type: "culture",
  },
  {
    id: "3",
    name: "Communication Skills",
    score: 78,
    maxScore: 100,
    completedDate: "2024-01-21",
    type: "communication",
  },
]

const sampleTimeline: TimelineEvent[] = [
  {
    id: "1",
    stage: "Applied",
    date: "2024-01-15",
    status: "completed",
    notes: "Application submitted via company website",
  },
  {
    id: "2",
    stage: "Screening Call",
    date: "2024-01-18",
    status: "completed",
    notes: "Initial screening completed by HR",
    interviewer: "Jennifer Smith",
  },
  {
    id: "3",
    stage: "Technical Assessment",
    date: "2024-01-22",
    status: "completed",
    notes: "Coding challenge completed with strong results",
  },
  {
    id: "4",
    stage: "Technical Interview",
    date: "2024-01-25",
    status: "completed",
    notes: "Technical interview with engineering team",
    interviewer: "Mike Johnson",
  },
  {
    id: "5",
    stage: "Final Interview",
    date: "2024-01-28",
    status: "pending",
    notes: "Scheduled with hiring manager",
  },
]

const sampleFeedback: InterviewFeedback[] = [
  {
    id: "1",
    interviewer: "Mike Johnson",
    interviewerRole: "Senior Engineering Manager",
    date: "2024-01-25",
    type: "technical",
    overallRating: 4,
    technicalRating: 5,
    communicationRating: 4,
    cultureRating: 4,
    strengths: [
      "Excellent React and TypeScript knowledge",
      "Strong problem-solving approach",
      "Good architectural thinking",
      "Clear communication of technical concepts",
    ],
    concerns: ["Limited experience with our specific tech stack", "May need mentoring on system design at scale"],
    recommendation: "hire",
    notes:
      "Sarah demonstrated strong technical skills and would be a great addition to the team. She approached the coding problems methodically and explained her thought process clearly. While she has some gaps in our specific stack, her foundation is solid and she shows great learning potential.",
  },
  {
    id: "2",
    interviewer: "Jennifer Smith",
    interviewerRole: "HR Manager",
    date: "2024-01-18",
    type: "phone",
    overallRating: 5,
    communicationRating: 5,
    cultureRating: 5,
    strengths: [
      "Excellent communication skills",
      "Strong cultural alignment",
      "Enthusiastic about the role",
      "Great questions about company culture",
    ],
    concerns: [],
    recommendation: "strong-hire",
    notes:
      "Sarah was very impressive in our initial screening. She asked thoughtful questions about our company culture and values, and her responses showed strong alignment with our team dynamics. Her enthusiasm for the role and company mission was evident throughout the conversation.",
  },
]

const sampleScreeningNotes: ScreeningNote[] = [
  {
    id: "1",
    author: "Jennifer Smith",
    date: "2024-01-18",
    content:
      "Candidate has strong background in React development with 5+ years experience. Currently working at a fintech startup. Looking for growth opportunities and better work-life balance. Salary expectations align with our budget.",
    tags: ["experience", "motivation", "salary"],
    priority: "medium",
  },
  {
    id: "2",
    author: "Mike Johnson",
    date: "2024-01-25",
    content:
      "Technical interview went very well. Sarah demonstrated solid understanding of React patterns, state management, and testing. She completed the coding challenge efficiently and explained her approach clearly. Some gaps in backend knowledge but strong frontend foundation.",
    tags: ["technical", "frontend", "testing"],
    priority: "high",
  },
]

interface CandidateProfileProps {
  candidateId: string
  onBack: () => void
}

function ProfileHeader({ candidate }: { candidate: Candidate }) {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)

  const getStageColor = (stage: string) => {
    if (stage.includes("Completed")) return "bg-green-100 text-green-800 border-green-200"
    if (stage.includes("Interview")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (stage.includes("Review")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="h-24 w-24 mx-auto sm:mx-0">
              <AvatarImage src={candidate.profileImage || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback className="text-lg">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">{candidate.name}</h1>
                <p className="text-lg text-muted-foreground">{candidate.position}</p>
                <Badge className={`mt-2 ${getStageColor(candidate.currentStage)}`} variant="outline">
                  {candidate.currentStage}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a href="#" className="text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="bg-red-600 hover:bg-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Move to Offer
              </Button>
              <Button variant="outline" onClick={() => setIsSchedulerOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <InterviewScheduler
        candidateName={candidate.name}
        candidatePosition={candidate.position}
        candidateTimeZone="Eastern Time (ET)"
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onSchedule={(interview) => {
          console.log("Interview scheduled:", interview)
          // Handle interview scheduling
        }}
      />
    </>
  )
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800 border-green-200"
      case "Advanced":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Beginner":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const mustHaveSkills = skills.filter(
    (skill) => skill.verified || skill.level === "Expert" || skill.level === "Advanced",
  )
  const niceToHaveSkills = skills.filter((skill) => !mustHaveSkills.includes(skill))

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-3">Must-Have Skills</h4>
        <div className="flex flex-wrap gap-2">
          {mustHaveSkills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-1">
              <Badge className={getLevelColor(skill.level)} variant="outline">
                {skill.name} • {skill.level}
              </Badge>
              {skill.verified && <CheckCircle className="h-3 w-3 text-green-500" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Nice-to-Have Skills</h4>
        <div className="flex flex-wrap gap-2">
          {niceToHaveSkills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-1">
              <Badge className={getLevelColor(skill.level)} variant="outline">
                {skill.name} • {skill.level}
              </Badge>
              {skill.verified && <CheckCircle className="h-3 w-3 text-green-500" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineSection({ timeline }: { timeline: TimelineEvent[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recruitment Timeline</h3>
      <div className="space-y-4">
        {timeline.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              {getStatusIcon(event.status)}
              {index < timeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{event.stage}</h4>
                <span className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              {event.notes && <p className="text-sm text-muted-foreground">{event.notes}</p>}
              {event.interviewer && (
                <p className="text-xs text-muted-foreground mt-1">Interviewer: {event.interviewer}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssessmentsTab({ assessments }: { assessments: Assessment[] }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "technical":
        return <BarChart3 className="h-5 w-5" />
      case "culture":
        return <Users className="h-5 w-5" />
      case "communication":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {getTypeIcon(assessment.type)}
                <div>
                  <h4 className="font-medium">{assessment.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assessment.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score</span>
                  <span className={`font-bold ${getScoreColor(assessment.score)}`}>{assessment.score}%</span>
                </div>
                <Progress value={assessment.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InterviewFeedbackTab({ feedback }: { feedback: InterviewFeedback[] }) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "strong-hire":
        return "bg-green-100 text-green-800 border-green-200"
      case "hire":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "no-hire":
        return "bg-red-100 text-red-800 border-red-200"
      case "strong-no-hire":
        return "bg-red-200 text-red-900 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      {feedback.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{item.interviewer}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.interviewerRole}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()} • {item.type} interview
                </p>
              </div>
              <Badge className={getRecommendationColor(item.recommendation)} variant="outline">
                {item.recommendation.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-sm font-medium">Overall Rating</Label>
                <div className="flex items-center gap-1 mt-1">{renderStars(item.overallRating)}</div>
              </div>
              {item.technicalRating && (
                <div>
                  <Label className="text-sm font-medium">Technical</Label>
                  <div className="flex items-center gap-1 mt-1">{renderStars(item.technicalRating)}</div>
                </div>
              )}
              {item.communicationRating && (
                <div>
                  <Label className="text-sm font-medium">Communication</Label>
                  <div className="flex items-center gap-1 mt-1">{renderStars(item.communicationRating)}</div>
                </div>
              )}
              {item.cultureRating && (
                <div>
                  <Label className="text-sm font-medium">Culture Fit</Label>
                  <div className="flex items-center gap-1 mt-1">{renderStars(item.cultureRating)}</div>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-green-600">Strengths</Label>
                <ul className="mt-2 space-y-1">
                  {item.strengths.map((strength, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              {item.concerns.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-yellow-600">Areas of Concern</Label>
                  <ul className="mt-2 space-y-1">
                    {item.concerns.map((concern, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <XCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Additional Notes</Label>
              <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ScreeningNotesTab({ notes }: { notes: ScreeningNote[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Screening Notes</h3>
        <Button size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className={`border-l-4 ${getPriorityColor(note.priority)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{note.author}</p>
                  <p className="text-sm text-muted-foreground">{new Date(note.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {note.priority}
                </Badge>
              </div>
              <p className="text-sm mb-3">{note.content}</p>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Label htmlFor="new-note">Add New Note</Label>
            <Textarea id="new-note" placeholder="Enter your screening notes here..." className="min-h-[100px]" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  technical
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  culture-fit
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  experience
                </Badge>
              </div>
              <Button size="sm">Save Note</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KupaAssessmentTab({ feedback }: { feedback: InterviewFeedback[] }) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "strong-hire":
        return "bg-green-100 text-green-800 border-green-200"
      case "hire":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "no-hire":
        return "bg-red-100 text-red-800 border-red-200"
      case "strong-no-hire":
        return "bg-red-200 text-red-900 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getThumbsIcon = (rating: "up" | "down" | null) => {
    if (rating === "up") return <ThumbsUp className="h-4 w-4 text-green-600" />
    if (rating === "down") return <ThumbsDown className="h-4 w-4 text-red-600" />
    return null
  }

  const assessmentAttachments = [
    {
      id: "1",
      name: "Technical Assessment Results.pdf",
      type: "Technical Assessment",
      uploadedBy: "System",
      uploadedDate: "2024-01-22",
      size: "2.4 MB",
      score: "85/100",
      rating: "Strong",
    },
    {
      id: "2",
      name: "Coding Challenge Solution.zip",
      type: "Code Review",
      uploadedBy: "Mike Johnson",
      uploadedDate: "2024-01-23",
      size: "1.2 MB",
      score: "Excellent",
      rating: "Outstanding",
    },
  ]

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "excellent":
      case "outstanding":
        return "bg-green-100 text-green-800"
      case "strong":
      case "good":
        return "bg-blue-100 text-blue-800"
      case "average":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expected Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">$120,000 - $140,000</p>
          <p className="text-sm text-muted-foreground">Annual salary expectation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assessment Attachments</CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessmentAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{attachment.name}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{attachment.type}</span>
                      <span>•</span>
                      <span>Uploaded by {attachment.uploadedBy}</span>
                      <span>•</span>
                      <span>{new Date(attachment.uploadedDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{attachment.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium text-sm">{attachment.score}</div>
                    <Badge className={`text-xs ${getRatingColor(attachment.rating)}`} variant="secondary">
                      {attachment.rating}
                    </Badge>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {feedback.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{item.interviewer}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.interviewerRole}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()} • {item.type} interview
                </p>
              </div>
              <Badge className={getRecommendationColor(item.recommendation)} variant="outline">
                {item.recommendation.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Overall Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getThumbsIcon("up")}
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-green-600">Strengths</Label>
                <ul className="mt-2 space-y-1">
                  {item.strengths.map((strength, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              {item.concerns.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-yellow-600">Areas of Concern</Label>
                  <ul className="mt-2 space-y-1">
                    {item.concerns.map((concern, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <XCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Additional Notes</Label>
              <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CandidateProfile({ candidateId, onBack }: CandidateProfileProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("resume")

  return (
    <SidebarProvider>
      <AppSidebar currentView="candidates" onNavigate={() => onBack()} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search within profile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CV
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload CV
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <ProfileHeader candidate={sampleCandidate} />

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <SkillsSection skills={sampleSkills} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                  <TabsTrigger value="kupa-assessment">Kupa Assessment</TabsTrigger>
                  <TabsTrigger value="my-comments">My Comments</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="resume" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume & Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Professional Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            Experienced Senior React Developer with 5+ years of expertise in building scalable web
                            applications. Proven track record in leading frontend development teams and implementing
                            modern JavaScript frameworks. Strong background in TypeScript, state management, and testing
                            methodologies.
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-3">Work Experience</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium">Senior Frontend Developer</h5>
                              <p className="text-sm text-muted-foreground">TechCorp Inc. • 2022 - Present</p>
                              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                                <li>• Led development of customer-facing React applications serving 100k+ users</li>
                                <li>• Implemented TypeScript migration reducing bugs by 40%</li>
                                <li>• Mentored junior developers and established code review processes</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium">Frontend Developer</h5>
                              <p className="text-sm text-muted-foreground">StartupXYZ • 2020 - 2022</p>
                              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                                <li>• Built responsive web applications using React and Redux</li>
                                <li>• Collaborated with design team to implement pixel-perfect UIs</li>
                                <li>• Optimized application performance improving load times by 60%</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-3">Education</h4>
                          <div>
                            <h5 className="font-medium">Bachelor of Science in Computer Science</h5>
                            <p className="text-sm text-muted-foreground">
                              University of California, Berkeley • 2016 - 2020
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kupa-assessment" className="mt-6">
                  <KupaAssessmentTab feedback={sampleFeedback} />
                </TabsContent>

                <TabsContent value="my-comments" className="mt-6">
                  <CandidateFeedbackTab candidateId={candidateId} />
                </TabsContent>

                <TabsContent value="messages" className="mt-6">
                  <CandidateMessagingTab candidateId={candidateId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
