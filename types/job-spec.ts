export type JobSpecStatus = "draft" | "pending-review" | "pending-approval" | "approved" | "rejected"

export type ContractType = "full-time" | "part-time" | "contract" | "freelance" | "internship"

export interface JobSpec {
  id: string
  title: string
  department: string
  location: string
  contractType: ContractType
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  mustHaveSkills: string[]
  niceToHaveSkills: string[]
  experienceYears: {
    min: number
    max: number
  }
  startDate: string
  hiringManager: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: JobSpecStatus
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  internalNotes?: string
  clientNotes?: string
}

export interface OnboardingProgress {
  totalJobSpecs: number
  completedJobSpecs: number
  approvedJobSpecs: number
  pendingJobSpecs: number
  rejectedJobSpecs: number
  hasAccessToPlatform: boolean
}
