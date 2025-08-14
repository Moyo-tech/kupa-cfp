import type { JobSpec, OnboardingProgress } from "@/types/job-spec"

export const sampleJobSpecs: JobSpec[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    contractType: "full-time",
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: "USD",
    },
    mustHaveSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    niceToHaveSkills: ["AWS", "Docker", "GraphQL"],
    experienceYears: {
      min: 5,
      max: 8,
    },
    startDate: "2024-02-01",
    hiringManager: "John Smith",
    description: "We are looking for a Senior Software Engineer to join our growing engineering team.",
    responsibilities: [
      "Design and develop scalable web applications",
      "Mentor junior developers",
      "Participate in code reviews",
      "Collaborate with product team on feature development",
    ],
    requirements: [
      "5+ years of software development experience",
      "Strong knowledge of React and TypeScript",
      "Experience with backend development",
      "Excellent communication skills",
    ],
    benefits: ["Competitive salary", "Health insurance", "Remote work flexibility", "Professional development budget"],
    status: "approved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    submittedAt: "2024-01-16T09:00:00Z",
    reviewedAt: "2024-01-18T11:00:00Z",
    approvedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    contractType: "full-time",
    salaryRange: {
      min: 90000,
      max: 130000,
      currency: "USD",
    },
    mustHaveSkills: ["Product Strategy", "Data Analysis", "User Research", "Agile"],
    niceToHaveSkills: ["SQL", "Figma", "A/B Testing"],
    experienceYears: {
      min: 3,
      max: 6,
    },
    startDate: "2024-02-15",
    hiringManager: "Sarah Johnson",
    description: "Join our product team to drive product strategy and execution.",
    responsibilities: [
      "Define product roadmap and strategy",
      "Work with engineering and design teams",
      "Analyze user data and feedback",
      "Manage product launches",
    ],
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills",
      "Experience with user research",
      "Excellent stakeholder management",
    ],
    benefits: ["Competitive salary", "Equity package", "Health and dental insurance", "Flexible PTO"],
    status: "pending-review",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-18T14:00:00Z",
    submittedAt: "2024-01-18T14:00:00Z",
    internalNotes: "Need to clarify budget expectations and team structure.",
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    contractType: "full-time",
    salaryRange: {
      min: 70000,
      max: 100000,
      currency: "USD",
    },
    mustHaveSkills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    niceToHaveSkills: ["After Effects", "Framer", "HTML/CSS"],
    experienceYears: {
      min: 2,
      max: 5,
    },
    startDate: "2024-03-01",
    hiringManager: "Mike Chen",
    description: "We're seeking a talented UX Designer to create exceptional user experiences.",
    responsibilities: [
      "Design user interfaces and experiences",
      "Conduct user research and testing",
      "Create and maintain design systems",
      "Collaborate with product and engineering teams",
    ],
    requirements: [
      "2+ years of UX design experience",
      "Proficiency in Figma",
      "Strong portfolio demonstrating UX process",
      "Experience with user research methods",
    ],
    benefits: ["Competitive salary", "Health insurance", "Design conference budget", "Creative workspace"],
    status: "draft",
    createdAt: "2024-01-20T16:00:00Z",
    updatedAt: "2024-01-20T16:00:00Z",
  },
]

export function getJobSpecById(id: string): JobSpec | undefined {
  return sampleJobSpecs.find((spec) => spec.id === id)
}

export function getOnboardingProgress(): OnboardingProgress {
  const totalJobSpecs = sampleJobSpecs.length
  const completedJobSpecs = sampleJobSpecs.filter((spec) => spec.status !== "draft").length
  const approvedJobSpecs = sampleJobSpecs.filter((spec) => spec.status === "approved").length
  const pendingJobSpecs = sampleJobSpecs.filter(
    (spec) => spec.status === "pending-review" || spec.status === "pending-approval",
  ).length
  const rejectedJobSpecs = sampleJobSpecs.filter((spec) => spec.status === "rejected").length

  return {
    totalJobSpecs,
    completedJobSpecs,
    approvedJobSpecs,
    pendingJobSpecs,
    rejectedJobSpecs,
    hasAccessToPlatform: approvedJobSpecs > 0,
  }
}
