"use client"

import { useState } from "react"
import {
  Search,
  Download,
  Clock,
  User,
  MapPin,
  MoreHorizontal,
  Users,
  TrendingUp,
  ChevronRight,
  Home,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { Candidate, Pipeline, PipelineStage } from "@/types/candidate"
import { allCandidates } from "@/data/candidates"
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

const interviewStages = ["Phone Screen", "Technical Interview", "Final Interview", "Technical Interview Completed"]

// Simplified pipeline data
const samplePipelines: Pipeline[] = [
  {
    roleId: "1",
    roleTitle: "Senior Software Engineer",
    department: "Engineering",
    stages: [
      {
        id: "in-interview",
        name: "In Interview",
        candidates: allCandidates.filter((c) => c.roleId === "1" && interviewStages.includes(c.currentStage)),
        maxDays: 7,
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "move-to-offer",
        name: "Move to Offer",
        candidates: allCandidates.filter((c) => c.roleId === "1" && c.currentStage === "Offer"),
        maxDays: 3,
        color: "bg-green-50 border-green-200",
      },
      {
        id: "rejected",
        name: "Rejected",
        candidates: allCandidates.filter((c) => c.roleId === "1" && c.currentStage === "Rejected"),
        maxDays: 0,
        color: "bg-red-50 border-red-200",
      },
    ],
  },
  {
    roleId: "2",
    roleTitle: "Product Manager",
    department: "Product",
    stages: [
      {
        id: "in-interview",
        name: "In Interview",
        candidates: allCandidates.filter((c) => c.roleId === "2" && interviewStages.includes(c.currentStage)),
        maxDays: 7,
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "move-to-offer",
        name: "Move to Offer",
        candidates: allCandidates.filter((c) => c.roleId === "2" && c.currentStage === "Offer"),
        maxDays: 3,
        color: "bg-green-50 border-green-200",
      },
      {
        id: "rejected",
        name: "Rejected",
        candidates: allCandidates.filter((c) => c.roleId === "2" && c.currentStage === "Rejected"),
        maxDays: 0,
        color: "bg-red-50 border-red-200",
      },
    ],
  },
  {
    roleId: "3",
    roleTitle: "UX Designer",
    department: "Design",
    stages: [
      {
        id: "in-interview",
        name: "In Interview",
        candidates: allCandidates.filter((c) => c.roleId === "3" && interviewStages.includes(c.currentStage)),
        maxDays: 7,
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "move-to-offer",
        name: "Move to Offer",
        candidates: allCandidates.filter((c) => c.roleId === "3" && c.currentStage === "Offer"),
        maxDays: 3,
        color: "bg-green-50 border-green-200",
      },
      {
        id: "rejected",
        name: "Rejected",
        candidates: allCandidates.filter((c) => c.roleId === "3" && c.currentStage === "Rejected"),
        maxDays: 0,
        color: "bg-red-50 border-red-200",
      },
    ],
  },
]

interface PipelineTrackingProps {
  roleId?: string
  onBack: () => void
  onViewCandidate: (candidateId: string) => void
  onNavigate: (view: string) => void
}

function HorizontalCandidateCard({
  candidate,
  onViewCandidate,
}: { candidate: Candidate; onViewCandidate: (id: string) => void }) {
  const getUrgencyColor = (daysInStage: number, maxDays: number) => {
    const ratio = daysInStage / maxDays
    if (ratio >= 1) return "text-red-600 bg-red-50"
    if (ratio >= 0.7) return "text-amber-600 bg-amber-50"
    return "text-emerald-600 bg-emerald-50"
  }

  const getUrgencyLabel = (daysInStage: number, maxDays: number) => {
    const ratio = daysInStage / maxDays
    if (ratio >= 1) return "Overdue"
    if (ratio >= 0.7) return "Due Soon"
    return "On Track"
  }

  const urgencyColor = getUrgencyColor(candidate.daysInStage, 7)
  const urgencyLabel = getUrgencyLabel(candidate.daysInStage, 7)

  return (
    <Card
      className="cursor-pointer hover:shadow-sm transition-all duration-200 border-l-4 border-l-slate-300 hover:border-l-blue-400"
      onClick={() => onViewCandidate(candidate.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={candidate.profileImage || "/placeholder.svg"} alt={candidate.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-slate-700 font-medium">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 truncate">{candidate.name}</h4>
                <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {candidate.experience}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>Move to Next Stage</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {candidate.keySkills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    {skill}
                  </Badge>
                ))}
                {candidate.keySkills.length > 3 && (
                  <Badge variant="outline" className="text-xs text-slate-500 border-slate-300">
                    +{candidate.keySkills.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{candidate.daysInStage}d</span>
                </div>
                <Badge className={`text-xs px-2 py-1 ${urgencyColor} border-0`}>{urgencyLabel}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PipelineStageSection({
  stage,
  onViewCandidate,
  isLast = false,
}: { stage: PipelineStage; onViewCandidate: (id: string) => void; isLast?: boolean }) {
  const getStageColor = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case "in interview":
        return "text-blue-700 bg-blue-100"
      case "move to offer":
        return "text-green-700 bg-green-100"
      case "rejected":
        return "text-red-700 bg-red-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const getProgressValue = () => {
    const totalCandidates = stage.candidates.length
    if (totalCandidates === 0) return 0
    const onTrackCandidates = stage.candidates.filter((c) => c.daysInStage <= stage.maxDays * 0.7).length
    return (onTrackCandidates / totalCandidates) * 100
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg font-medium text-sm ${getStageColor(stage.name)}`}>{stage.name}</div>
          <Badge variant="outline" className="text-slate-600 border-slate-300">
            {stage.candidates.length} candidates
          </Badge>
          <span className="text-xs text-slate-500">Max {stage.maxDays} days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Progress value={getProgressValue()} className="h-2" />
          </div>
          <span className="text-xs text-slate-500">{Math.round(getProgressValue())}% on track</span>
        </div>
      </div>

      <div className="space-y-3">
        {stage.candidates.length > 0 ? (
          stage.candidates.map((candidate) => (
            <HorizontalCandidateCard key={candidate.id} candidate={candidate} onViewCandidate={onViewCandidate} />
          ))
        ) : (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-8">
              <div className="text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No candidates in this stage</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {!isLast && (
        <div className="flex justify-center py-2">
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>
      )}
    </div>
  )
}

function AllPipelinesOverview({
  pipelines,
  onSelectPipeline,
  onViewCandidate,
}: {
  pipelines: Pipeline[]
  onSelectPipeline: (roleId: string) => void
  onViewCandidate: (candidateId: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pipeline Overview</h1>
          <p className="text-slate-600">Monitor all recruitment pipelines and candidate progress</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {pipelines.reduce(
                    (acc, p) => acc + (p.stages.find((s) => s.name === "In Interview")?.candidates.length || 0),
                    0,
                  )}
                </p>
                <p className="text-sm text-slate-600">In Interview</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {pipelines.reduce(
                    (acc, p) => acc + (p.stages.find((s) => s.name === "Move to Offer")?.candidates.length || 0),
                    0,
                  )}
                </p>
                <p className="text-sm text-slate-600">Ready for Offer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {pipelines.reduce(
                    (acc, p) => acc + (p.stages.find((s) => s.name === "Rejected")?.candidates.length || 0),
                    0,
                  )}
                </p>
                <p className="text-sm text-slate-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.roleId} className="border-slate-200 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">{pipeline.roleTitle}</CardTitle>
                  <p className="text-slate-600">{pipeline.department}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onSelectPipeline(pipeline.roleId)}
                  className="border-slate-300"
                >
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {pipeline.stages.map((stage) => (
                  <div key={stage.id} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stage.candidates.length}</div>
                    <div className="text-sm text-slate-600 mb-2">{stage.name}</div>
                    {stage.name !== "Rejected" && (
                      <Progress
                        value={
                          stage.candidates.length > 0
                            ? (stage.candidates.filter((c) => c.daysInStage <= stage.maxDays * 0.7).length /
                                stage.candidates.length) *
                              100
                            : 0
                        }
                        className="h-1.5"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AppSidebar({ currentView, onNavigate }: { currentView: string; onNavigate: (view: string) => void }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <img src="/logo.png" alt="Company Logo" className="h-8 w-8 rounded-lg object-contain" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Kupa Global </span>
            <span className="text-xs text-muted-foreground">Recruitment Platform</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export function PipelineTracking({ roleId, onBack, onViewCandidate, onNavigate }: PipelineTrackingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecruiter, setSelectedRecruiter] = useState("all")
  const [selectedRole, setSelectedRole] = useState<string>(roleId || "all")

  const currentPipeline = selectedRole !== "all" ? samplePipelines.find((p) => p.roleId === selectedRole) : null
  const recruiters = ["all", ...Array.from(new Set(allCandidates.map((c) => c.recruiter)))]
  const roles = [
    { value: "all", label: "All Roles" },
    ...samplePipelines.map((p) => ({ value: p.roleId, label: p.roleTitle })),
  ]

  const handleSelectPipeline = (pipelineRoleId: string) => {
    setSelectedRole(pipelineRoleId)
  }

  const handleRoleFilterChange = (roleId: string) => {
    setSelectedRole(roleId)
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView="pipelines" onNavigate={onNavigate} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={() => setSelectedRole("all")}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  <Home className="h-3 w-3" />
                  Pipelines
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentPipeline && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-slate-900">{currentPipeline.roleTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-300 focus:border-slate-400"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-[200px] border-slate-300">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
              <SelectTrigger className="w-[150px] border-slate-300">
                <SelectValue placeholder="Recruiter" />
              </SelectTrigger>
              <SelectContent>
                {recruiters.map((recruiter) => (
                  <SelectItem key={recruiter} value={recruiter}>
                    {recruiter === "all" ? "All Recruiters" : recruiter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6 bg-slate-50/50">
          {selectedRole === "all" ? (
            <AllPipelinesOverview
              pipelines={samplePipelines}
              onSelectPipeline={handleSelectPipeline}
              onViewCandidate={onViewCandidate}
            />
          ) : currentPipeline ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">{currentPipeline.roleTitle}</h1>
                  <p className="text-slate-600">{currentPipeline.department} • Pipeline Tracking</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-slate-600 border-slate-300">
                    {currentPipeline.stages.reduce((acc, stage) => acc + stage.candidates.length, 0)} Total Candidates
                  </Badge>
                </div>
              </div>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    {currentPipeline.stages.map((stage) => (
                      <div key={stage.id} className="text-center">
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stage.candidates.length}</div>
                        <div className="text-sm text-slate-600 mb-2">{stage.name}</div>
                        <Progress
                          value={
                            stage.candidates.length > 0
                              ? (stage.candidates.filter((c) => c.daysInStage <= stage.maxDays * 0.7).length /
                                  stage.candidates.length) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                {currentPipeline.stages.map((stage, index) => (
                  <PipelineStageSection
                    key={stage.id}
                    stage={stage}
                    onViewCandidate={onViewCandidate}
                    isLast={index === currentPipeline.stages.length - 1}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Pipeline not found</p>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
