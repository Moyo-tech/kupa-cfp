"use client"

import type React from "react"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FeedbackEntry {
  id: string
  reviewer: string
  reviewerRole: string
  reviewerAvatar?: string
  date: string
  thumbsRating: "up" | "down" | null
  starRating: number
  recommendation: "hire" | "no-hire" | "strong-hire" | "strong-no-hire"
  comments: string
  interviewType: string
  strengths: string[]
  concerns: string[]
}

interface FeedbackModalProps {
  candidateName: string
  candidatePosition: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: Omit<FeedbackEntry, "id" | "date">) => void
  feedbackHistory: FeedbackEntry[]
}

// Sample feedback history
const sampleFeedbackHistory: FeedbackEntry[] = [
  {
    id: "1",
    reviewer: "Mike Johnson",
    reviewerRole: "Senior Engineering Manager",
    date: "2024-01-25T14:30:00Z",
    thumbsRating: "up",
    starRating: 4,
    recommendation: "hire",
    comments:
      "Strong technical skills and good cultural fit. Demonstrated excellent problem-solving approach during the coding interview.",
    interviewType: "Technical Interview",
    strengths: ["React expertise", "Problem-solving", "Communication"],
    concerns: ["Limited backend experience"],
  },
  {
    id: "2",
    reviewer: "Jennifer Smith",
    reviewerRole: "HR Manager",
    date: "2024-01-18T10:15:00Z",
    thumbsRating: "up",
    starRating: 5,
    recommendation: "strong-hire",
    comments:
      "Excellent cultural alignment and communication skills. Very enthusiastic about the role and company mission.",
    interviewType: "Phone Screening",
    strengths: ["Communication", "Cultural fit", "Enthusiasm"],
    concerns: [],
  },
  {
    id: "3",
    reviewer: "David Kim",
    reviewerRole: "Senior Developer",
    date: "2024-01-22T16:45:00Z",
    thumbsRating: "down",
    starRating: 2,
    recommendation: "no-hire",
    comments:
      "While the candidate has good React knowledge, they struggled with system design concepts and showed gaps in understanding scalable architecture patterns.",
    interviewType: "System Design",
    strengths: ["Frontend knowledge"],
    concerns: ["System design", "Scalability concepts", "Architecture understanding"],
  },
]

function FeedbackHistoryPanel({ history }: { history: FeedbackEntry[] }) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-lg">Feedback History</h3>
      {history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2" />
          <p>No feedback submitted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((feedback) => (
            <Card key={feedback.id} className="border-l-4 border-l-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={feedback.reviewerAvatar || "/placeholder.svg"} alt={feedback.reviewer} />
                      <AvatarFallback className="text-xs">
                        {feedback.reviewer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{feedback.reviewer}</p>
                      <p className="text-xs text-muted-foreground">{feedback.reviewerRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRecommendationColor(feedback.recommendation)} variant="outline">
                      {feedback.recommendation.replace("-", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <Label className="text-xs font-medium">Interview Type</Label>
                    <p className="text-muted-foreground">{feedback.interviewType}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Thumbs Rating</Label>
                    <div className="flex items-center gap-1">
                      {getThumbsIcon(feedback.thumbsRating)}
                      <span className="text-muted-foreground">
                        {feedback.thumbsRating ? feedback.thumbsRating : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Star Rating</Label>
                    <div className="flex items-center gap-1">{renderStars(feedback.starRating)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-medium text-green-600">Strengths</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.strengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {feedback.concerns.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-yellow-600">Concerns</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {feedback.concerns.map((concern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <Label className="text-xs font-medium">Comments</Label>
                  <p className="text-sm text-muted-foreground mt-1">{feedback.comments}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function FeedbackModal({
  candidateName,
  candidatePosition,
  isOpen,
  onClose,
  onSubmit,
  feedbackHistory,
}: FeedbackModalProps) {
  const [thumbsRating, setThumbsRating] = useState<"up" | "down" | null>(null)
  const [recommendation, setRecommendation] = useState("")
  const [comments, setComments] = useState("")
  const [interviewType, setInterviewType] = useState("")
  const [strengths, setStrengths] = useState("")
  const [concerns, setConcerns] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!thumbsRating || !recommendation || !comments.trim() || !interviewType) {
      return
    }

    if (thumbsRating === "down" && !concerns.trim()) {
      return
    }

    onSubmit({
      reviewer: "John Doe", // This would come from auth context
      reviewerRole: "Hiring Manager",
      thumbsRating,
      starRating: thumbsRating === "up" ? 5 : thumbsRating === "down" ? 1 : 3, // Convert thumbs to star for storage
      recommendation: recommendation as any,
      comments: comments.trim(),
      interviewType,
      strengths: strengths
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      concerns: concerns
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })

    // Reset form
    setThumbsRating(null)
    setRecommendation("")
    setComments("")
    setInterviewType("")
    setStrengths("")
    setConcerns("")
    onClose()
  }

  const isFormValid =
    thumbsRating &&
    recommendation &&
    comments.trim() &&
    interviewType &&
    (thumbsRating === "up" || (thumbsRating === "down" && concerns.trim()))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              Submit Feedback - {candidateName}
              <span className="text-sm font-normal text-muted-foreground ml-2">{candidatePosition}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {showHistory ? "Hide" : "Show"} History
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>Provide structured feedback to help make informed hiring decisions</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Interview Type *</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone-screening">Phone Screening</SelectItem>
                    <SelectItem value="technical-interview">Technical Interview</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                    <SelectItem value="culture-fit">Culture Fit</SelectItem>
                    <SelectItem value="final-interview">Final Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Overall Rating *</Label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setThumbsRating("up")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      thumbsRating === "up"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    Recommend
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbsRating("down")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      thumbsRating === "down"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    Do Not Recommend
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Final Recommendation *</Label>
                <RadioGroup value={recommendation} onValueChange={setRecommendation} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong-hire" id="strong-hire" />
                    <Label htmlFor="strong-hire" className="text-sm">
                      Strong Hire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hire" id="hire" />
                    <Label htmlFor="hire" className="text-sm">
                      Hire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-hire" id="no-hire" />
                    <Label htmlFor="no-hire" className="text-sm">
                      No Hire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong-no-hire" id="strong-no-hire" />
                    <Label htmlFor="strong-no-hire" className="text-sm">
                      Strong No Hire
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="strengths" className="text-sm font-medium">
                  Strengths (comma-separated)
                </Label>
                <Textarea
                  id="strengths"
                  placeholder="e.g., React expertise, Problem-solving, Communication"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>

              {thumbsRating === "down" && (
                <div>
                  <Label htmlFor="concerns" className="text-sm font-medium">
                    Concerns (comma-separated) *
                  </Label>
                  <Textarea
                    id="concerns"
                    placeholder="e.g., System design, Scalability concepts, Architecture understanding"
                    value={concerns}
                    onChange={(e) => setConcerns(e.target.value)}
                    className="mt-1"
                    rows={2}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="comments" className="text-sm font-medium">
                  Detailed Comments *
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Provide detailed feedback about the candidate's performance, skills, and fit for the role..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-1"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isFormValid}>
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>

          {showHistory && (
            <div className="border-l pl-6">
              <FeedbackHistoryPanel history={feedbackHistory} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Usage component for candidate profile
export function CandidateFeedbackTab({ candidateId }: { candidateId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>(sampleFeedbackHistory)

  const handleSubmitFeedback = (feedback: Omit<FeedbackEntry, "id" | "date">) => {
    const newFeedback: FeedbackEntry = {
      ...feedback,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setFeedbackHistory([newFeedback, ...feedbackHistory])
  }

  const getThumbsIcon = (rating: "up" | "down" | null) => {
    if (rating === "up") return <ThumbsUp className="h-4 w-4 text-green-600" />
    if (rating === "down") return <ThumbsDown className="h-4 w-4 text-red-600" />
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Comments</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </div>

      <div className="space-y-4">
        {feedbackHistory.map((feedback) => (
          <Card key={feedback.id} className="border-l-4 border-l-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={feedback.reviewerAvatar || "/placeholder.svg"} alt={feedback.reviewer} />
                    <AvatarFallback className="text-xs">
                      {feedback.reviewer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{feedback.reviewer}</p>
                    <p className="text-xs text-muted-foreground">{feedback.reviewerRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <Label className="text-xs font-medium">Interview Type</Label>
                  <p className="text-muted-foreground">{feedback.interviewType}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">Rating</Label>
                  <div className="flex items-center gap-1">
                    {getThumbsIcon(feedback.thumbsRating)}
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium">Recommendation</Label>
                  <Badge variant="outline" className="text-xs">
                    {feedback.recommendation.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-green-600">Strengths</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {feedback.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                {feedback.concerns.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-yellow-600">Areas of Concern</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.concerns.map((concern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <Label className="text-xs font-medium">Additional Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">{feedback.comments}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FeedbackModal
        candidateName="Sarah Chen"
        candidatePosition="Senior React Developer"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        feedbackHistory={feedbackHistory}
      />
    </div>
  )
}
