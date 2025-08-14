export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  currentStage: string
  profileImage?: string
  location: string
  experience: string
  expectedSalary?: string
  availability: string
  roleId: string
  daysInStage: number
  priority: "high" | "medium" | "low"
  keySkills: string[]
  recruiter: string
  appliedDate: string
}

export interface Skill {
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  verified: boolean
}

export interface Assessment {
  id: string
  name: string
  score: number
  maxScore: number
  completedDate: string
  type: "technical" | "culture" | "communication" | "cognitive"
}

export interface TimelineEvent {
  id: string
  stage: string
  date: string
  status: "completed" | "in-progress" | "pending"
  notes?: string
  interviewer?: string
}

export interface InterviewFeedback {
  id: string
  interviewer: string
  interviewerRole: string
  date: string
  type: "phone" | "video" | "in-person" | "technical"
  overallRating: number
  technicalRating?: number
  communicationRating?: number
  cultureRating?: number
  strengths: string[]
  concerns: string[]
  recommendation: "strong-hire" | "hire" | "no-hire" | "strong-no-hire"
  notes: string
}

export interface ScreeningNote {
  id: string
  author: string
  date: string
  content: string
  tags: string[]
  priority: "high" | "medium" | "low"
}

export interface PipelineStage {
  id: string
  name: string
  candidates: Candidate[]
  maxDays: number
  color: string
}

export interface Pipeline {
  roleId: string
  roleTitle: string
  department: string
  stages: PipelineStage[]
}
