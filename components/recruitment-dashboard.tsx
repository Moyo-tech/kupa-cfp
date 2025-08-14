"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Filter,
  BarChart3,
  MessageSquare,
  ArrowLeft,
  Edit,
  Plus,
  FileText,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CandidateProfile } from "./candidate-profile"
import { PipelineTracking } from "./pipeline-tracking"
import { CandidatesList } from "./candidates-list"
import { UpcomingInterviewsView } from "./interview-scheduler"
import { ContextualMessaging } from "./contextual-messaging"
import { NotificationDropdown } from "./notification-dropdown"
import { NotificationManagement } from "./notification-management"
import { JobOnboarding } from "./job-onboarding"
import { JobSpecDetails } from "./job-spec-details"
import { ClientOnboardingWelcome } from "./client-onboarding-welcome"
import { DocumentUpload } from "./document-upload"
import { getJobSpecById, getOnboardingProgress } from "@/data/job-specs"
import type { JobSpec } from "@/types/job-spec"
import { EmployeeManagementDashboard } from "./employee-management-dashboard"
import { EmployeesList } from "./employees-list"
import { TimesheetManagement } from "./timesheet-management"
import { LeaveManagement } from "./leave-management"

// TypeScript interfaces
interface PipelineStage {
  name: string
  count: number
  color: string
}

interface Role {
  id: string
  title: string
  department: string
  priority: "high" | "medium" | "low"
  daysActive: number
  pipeline: PipelineStage[]
  totalCandidates: number
  lastActivity: string
}

interface PendingAction {
  id: string
  type: "feedback" | "interview" | "offer" | "review"
  message: string
  roleTitle: string
  urgency: "high" | "medium" | "low"
  dueDate?: string
}

// Sample data
const sampleRoles: Role[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    priority: "high",
    daysActive: 12,
    pipeline: [
      { name: "Applied", count: 12, color: "bg-blue-100 text-blue-800" },
      { name: "Screening", count: 4, color: "bg-yellow-100 text-yellow-800" },
      { name: "Interview", count: 2, color: "bg-purple-100 text-purple-800" },
      { name: "Offer", count: 1, color: "bg-green-100 text-green-800" },
    ],
    totalCandidates: 19,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    priority: "high",
    daysActive: 8,
    pipeline: [
      { name: "Applied", count: 8, color: "bg-blue-100 text-blue-800" },
      { name: "Screening", count: 3, color: "bg-yellow-100 text-yellow-800" },
      { name: "Interview", count: 2, color: "bg-purple-100 text-purple-800" },
      { name: "Offer", count: 0, color: "bg-green-100 text-green-800" },
    ],
    totalCandidates: 13,
    lastActivity: "4 hours ago",
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    priority: "medium",
    daysActive: 15,
    pipeline: [
      { name: "Applied", count: 15, color: "bg-blue-100 text-blue-800" },
      { name: "Screening", count: 6, color: "bg-yellow-100 text-yellow-800" },
      { name: "Interview", count: 1, color: "bg-purple-100 text-purple-800" },
      { name: "Offer", count: 0, color: "bg-green-100 text-green-800" },
    ],
    totalCandidates: 22,
    lastActivity: "1 day ago",
  },
]

const pendingActions: PendingAction[] = [
  {
    id: "1",
    type: "feedback",
    message: "2 feedback pending",
    roleTitle: "Senior Software Engineer",
    urgency: "high",
  },
  {
    id: "2",
    type: "interview",
    message: "Interview scheduled tomorrow",
    roleTitle: "Product Manager",
    urgency: "high",
    dueDate: "Tomorrow 2:00 PM",
  },
  {
    id: "3",
    type: "offer",
    message: "Offer expires in 3 days",
    roleTitle: "DevOps Engineer",
    urgency: "medium",
    dueDate: "Dec 28, 2024",
  },
]

function AppSidebar({
  currentView,
  onNavigate,
  currentPhase,
  setCurrentPhase,
}: {
  currentView: string
  onNavigate: (view: string) => void
  currentPhase: "recruitment" | "talent-management"
  setCurrentPhase: (phase: "recruitment" | "talent-management") => void
}) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold">Kupa Global</span>
                <span className="text-xs text-muted-foreground">
                  {currentPhase === "recruitment" ? "Talent Acquisition" : "Talent Management"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem
              onClick={() => setCurrentPhase("recruitment")}
              className={currentPhase === "recruitment" ? "bg-accent" : ""}
            >
              <Users className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">Talent Acquisition</span>
                <span className="text-xs text-muted-foreground">Recruitment & Hiring</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setCurrentPhase("talent-management")}
              className={currentPhase === "talent-management" ? "bg-accent" : ""}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">Talent Management</span>
                <span className="text-xs text-muted-foreground">Employee Lifecycle</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentPhase === "recruitment" ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "dashboard"} onClick={() => onNavigate("dashboard")}>
                      <TrendingUp className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "candidates"} onClick={() => onNavigate("candidates")}>
                      <Users className="h-4 w-4" />
                      <span>All Candidates</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "pipelines"} onClick={() => onNavigate("pipelines")}>
                      <BarChart3 className="h-4 w-4" />
                      <span>Pipelines</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "interviews"} onClick={() => onNavigate("interviews")}>
                      <Calendar className="h-4 w-4" />
                      <span>Interviews</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "messages"} onClick={() => onNavigate("messages")}>
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentView === "notifications"}
                      onClick={() => onNavigate("notifications")}
                    >
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentView === "employee-dashboard"}
                      onClick={() => onNavigate("employee-dashboard")}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "employees"} onClick={() => onNavigate("employees")}>
                      <Users className="h-4 w-4" />
                      <span>Employees</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "timesheets"} onClick={() => onNavigate("timesheets")}>
                      <Clock className="h-4 w-4" />
                      <span>Timesheets</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentView === "leave-requests"}
                      onClick={() => onNavigate("leave-requests")}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Leave Requests</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentView === "performance"}
                      onClick={() => onNavigate("performance")}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Performance</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={currentView === "payroll"} onClick={() => onNavigate("payroll")}>
                      <BarChart3 className="h-4 w-4" />
                      <span>Payroll</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function RoleCard({
  role,
  onViewPipeline,
  onViewJobSpec,
  onEditJobSpec,
}: {
  role: Role
  onViewPipeline: (roleId: string) => void
  onViewJobSpec: (roleId: string) => void
  onEditJobSpec: (roleId: string) => void
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get job spec for this role
  const jobSpec = getJobSpecById(role.id)
  const jobSpecStatus = jobSpec?.status || "draft"

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{role.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <FileText className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewJobSpec(role.id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Job Spec
                  </DropdownMenuItem>
                  {jobSpecStatus !== "approved" && (
                    <DropdownMenuItem onClick={() => onEditJobSpec(role.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Job Spec
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">{role.department}</p>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(role.priority)} variant="outline">
                {role.priority}
              </Badge>
              <Badge
                variant="outline"
                className={
                  jobSpecStatus === "approved"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : jobSpecStatus === "pending-approval"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : jobSpecStatus === "pending-review"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                }
              >
                {jobSpecStatus === "pending-approval"
                  ? "Pending Approval"
                  : jobSpecStatus === "pending-review"
                    ? "Pending Review"
                    : jobSpecStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {role.daysActive} days active
          </span>
          <span>{role.totalCandidates} candidates</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">Pipeline Progress</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {role.pipeline.map((stage) => (
              <div key={stage.name} className="text-center">
                <Badge className={`${stage.color} mb-1 w-full justify-center`} variant="secondary">
                  {stage.count}
                </Badge>
                <div className="text-xs text-muted-foreground">{stage.name}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">Last activity: {role.lastActivity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewPipeline(role.id)}
              disabled={jobSpecStatus !== "approved"}
            >
              View Pipeline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingActionsPanel({ handleViewCandidate }: { handleViewCandidate: (candidateId: string) => void }) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "feedback":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "interview":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "offer":
        return <Clock className="h-4 w-4 text-green-500" />
      case "review":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Pending Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingActions.map((action) => (
          <div key={action.id} className={`border-l-4 ${getUrgencyColor(action.urgency)} pl-4 py-2`}>
            <div className="flex items-start gap-3">
              {getActionIcon(action.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{action.message}</p>
                <p className="text-xs text-muted-foreground">{action.roleTitle}</p>
                {action.dueDate && <p className="text-xs text-muted-foreground mt-1">Due: {action.dueDate}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleViewCandidate("1")}>
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RecruitmentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showCandidateProfile, setShowCandidateProfile] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState("onboarding")
  const [showPipeline, setShowPipeline] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [showMessaging, setShowMessaging] = useState(false)
  const [messagingCandidateId, setMessagingCandidateId] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showJobOnboarding, setShowJobOnboarding] = useState(false)
  const [showJobSpecDetails, setShowJobSpecDetails] = useState(false)
  const [selectedJobSpecId, setSelectedJobSpecId] = useState<string | null>(null)
  const [editingJobSpec, setEditingJobSpec] = useState<JobSpec | null>(null)
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"recruitment" | "talent-management">("recruitment")

  // Check if user has completed onboarding
  const onboardingProgress = getOnboardingProgress()
  const hasCompletedOnboarding = onboardingProgress.hasAccessToPlatform

  const filteredRoles = sampleRoles.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || role.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = ["all", ...Array.from(new Set(sampleRoles.map((role) => role.department)))]

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setShowCandidateProfile(true)
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    setShowCandidateProfile(false)
    setShowPipeline(false)
    setShowMessaging(false)
    if (view === "notifications") {
      setShowNotifications(true)
      return
    }
    // Reset to employee dashboard when switching to talent management
    if (
      currentPhase === "talent-management" &&
      !["employee-dashboard", "employees", "timesheets", "leave-requests", "performance", "payroll"].includes(view)
    ) {
      setCurrentView("employee-dashboard")
    }
  }

  const handleViewPipeline = (roleId: string) => {
    setSelectedRoleId(roleId)
    setShowPipeline(true)
  }

  const handleOpenMessaging = (candidateId?: string) => {
    setMessagingCandidateId(candidateId || null)
    setShowMessaging(true)
  }

  const handleCreateJobSpec = () => {
    setEditingJobSpec(null)
    setShowJobOnboarding(true)
  }

  const handleEditJobSpec = (jobSpecId: string) => {
    const jobSpec = getJobSpecById(jobSpecId)
    if (jobSpec) {
      setEditingJobSpec(jobSpec)
      setShowJobOnboarding(true)
    }
  }

  const handleViewJobSpec = (jobSpecId: string) => {
    setSelectedJobSpecId(jobSpecId)
    setShowJobSpecDetails(true)
  }

  const handleJobSpecComplete = (jobSpec: Partial<JobSpec>) => {
    // In a real app, this would save to the backend
    console.log("Job spec completed:", jobSpec)
    setShowJobOnboarding(false)
    setEditingJobSpec(null)
    // Optionally show success message or redirect
  }

  const handleJobSpecApprove = (jobSpec: JobSpec) => {
    // In a real app, this would update the backend
    console.log("Job spec approved:", jobSpec)
    setShowJobSpecDetails(false)
    setSelectedJobSpecId(null)
  }

  const handleJobSpecReject = (jobSpec: JobSpec, reason: string) => {
    // In a real app, this would update the backend
    console.log("Job spec rejected:", jobSpec, reason)
    setShowJobSpecDetails(false)
    setSelectedJobSpecId(null)
  }

  const handleAccessPlatform = () => {
    setCurrentView("dashboard")
  }

  const handleDocumentUploadComplete = (files: any[]) => {
    // Process uploaded files and create job specs
    console.log("Document upload completed:", files)
    setShowDocumentUpload(false)
    // Could automatically create job specs from extracted data
  }

  // Show document upload screen
  if (showDocumentUpload) {
    return <DocumentUpload onBack={() => setShowDocumentUpload(false)} onComplete={handleDocumentUploadComplete} />
  }

  // Show job onboarding flow
  if (showJobOnboarding) {
    return (
      <JobOnboarding
        existingJobSpec={editingJobSpec || undefined}
        onComplete={handleJobSpecComplete}
        onCancel={() => {
          setShowJobOnboarding(false)
          setEditingJobSpec(null)
        }}
      />
    )
  }

  // Show job spec details
  if (showJobSpecDetails && selectedJobSpecId) {
    const jobSpec = getJobSpecById(selectedJobSpecId)
    if (jobSpec) {
      return (
        <JobSpecDetails
          jobSpec={jobSpec}
          onBack={() => {
            setShowJobSpecDetails(false)
            setSelectedJobSpecId(null)
          }}
          onEdit={(updatedJobSpec) => {
            // Handle job spec update
            console.log("Job spec updated:", updatedJobSpec)
            setShowJobSpecDetails(false)
            setSelectedJobSpecId(null)
          }}
          onApprove={handleJobSpecApprove}
          onReject={handleJobSpecReject}
          canEdit={true}
          canApprove={jobSpec.status === "pending-approval"}
        />
      )
    }
  }

  // Show onboarding welcome screen if not completed
  if (!hasCompletedOnboarding || currentView === "onboarding") {
    return (
      <ClientOnboardingWelcome
        onCreateJobSpec={handleCreateJobSpec}
        onUploadDocument={() => setShowDocumentUpload(true)}
        onViewJobSpec={handleViewJobSpec}
        onEditJobSpec={handleEditJobSpec}
        onAccessPlatform={handleAccessPlatform}
      />
    )
  }

  if (showNotifications || currentView === "notifications") {
    return (
      <SidebarProvider>
        <AppSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          currentPhase={currentPhase}
          setCurrentPhase={setCurrentPhase}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotifications(false)
                  setCurrentView("dashboard")
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Notifications</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            <NotificationManagement onViewCandidate={handleViewCandidate} onViewRole={handleViewPipeline} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (showCandidateProfile && selectedCandidateId) {
    return <CandidateProfile candidateId={selectedCandidateId} onBack={() => setShowCandidateProfile(false)} />
  }

  if (showPipeline || currentView === "pipelines") {
    return (
      <PipelineTracking
        roleId={selectedRoleId || undefined}
        onBack={() => {
          setShowPipeline(false)
          setSelectedRoleId(null)
        }}
        onViewCandidate={handleViewCandidate}
        onNavigate={handleNavigate}
      />
    )
  }

  if (showMessaging || currentView === "messages") {
    return (
      <ContextualMessaging
        candidateId={messagingCandidateId || undefined}
        onClose={() => {
          setShowMessaging(false)
          setMessagingCandidateId(null)
          if (currentView === "messages") {
            setCurrentView("dashboard")
          }
        }}
      />
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedDepartment === "all" ? "All Departments" : selectedDepartment}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {departments.map((dept) => (
                  <DropdownMenuItem key={dept} onClick={() => setSelectedDepartment(dept)}>
                    {dept === "all" ? "All Departments" : dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <NotificationDropdown
                onViewAll={() => handleNavigate("notifications")}
                onViewCandidate={handleViewCandidate}
                onViewRole={(roleId) => handleViewPipeline(roleId)}
              />
              <Button variant="outline" size="sm" onClick={() => handleOpenMessaging()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button onClick={handleCreateJobSpec}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job Spec
              </Button>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Hiring Manager</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {currentView === "dashboard" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">Manage your open roles and track candidate progress</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-2xl font-bold">{sampleRoles.length}</p>
                            <p className="text-sm text-muted-foreground">Active Roles</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-2xl font-bold">
                              {sampleRoles.reduce((acc, role) => acc + role.totalCandidates, 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Candidates</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Open Roles ({filteredRoles.length})</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredRoles.map((role) => (
                        <RoleCard
                          key={role.id}
                          role={role}
                          onViewPipeline={handleViewPipeline}
                          onViewJobSpec={handleViewJobSpec}
                          onEditJobSpec={handleEditJobSpec}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <PendingActionsPanel handleViewCandidate={handleViewCandidate} />

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">High Priority Roles</span>
                        <span className="text-sm font-medium">
                          {sampleRoles.filter((r) => r.priority === "high").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Interviews This Week</span>
                        <span className="text-sm font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending Offers</span>
                        <span className="text-sm font-medium">
                          {sampleRoles.reduce(
                            (acc, role) => acc + (role.pipeline.find((p) => p.name === "Offer")?.count || 0),
                            0,
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {currentView === "candidates" && <CandidatesList onViewCandidate={handleViewCandidate} />}

          {currentView === "interviews" && <UpcomingInterviewsView />}

          {currentView === "employee-dashboard" && currentPhase === "talent-management" && (
            <EmployeeManagementDashboard onViewEmployees={(role) => handleNavigate("employees")} />
          )}

          {currentView === "employees" && currentPhase === "talent-management" && <EmployeesList />}

          {currentView === "timesheets" && currentPhase === "talent-management" && (
            <TimesheetManagement
              onViewDetails={(employeeId) => console.log("View timesheet details for:", employeeId)}
            />
          )}

          {currentView === "leave-requests" && currentPhase === "talent-management" && (
            <LeaveManagement onViewDetails={(requestId) => console.log("View leave request details for:", requestId)} />
          )}

          {currentView === "performance" && currentPhase === "talent-management" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
                  <p className="text-muted-foreground">Track and evaluate employee performance</p>
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Performance management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "payroll" && currentPhase === "talent-management" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
                  <p className="text-muted-foreground">Manage employee compensation and payroll processing</p>
                </div>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Payroll management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
