"use client"

import { useState } from "react"
import { Search, Users, MapPin, Clock, Star, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Candidate } from "@/types/candidate"
import { allCandidates } from "@/data/candidates"

interface CandidatesListProps {
  onViewCandidate: (candidateId: string) => void
}

function CandidateListCard({
  candidate,
  onViewCandidate,
}: { candidate: Candidate; onViewCandidate: (id: string) => void }) {
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

  const getStageColor = (stage: string) => {
    if (stage.includes("Applied")) return "bg-blue-100 text-blue-800"
    if (stage.includes("Screening")) return "bg-yellow-100 text-yellow-800"
    if (stage.includes("Interview")) return "bg-purple-100 text-purple-800"
    if (stage.includes("Offer")) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewCandidate(candidate.id)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={candidate.profileImage || "/placeholder.svg"} alt={candidate.name} />
            <AvatarFallback>
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{candidate.name}</h3>
                <p className="text-muted-foreground">{candidate.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(candidate.priority)} variant="outline">
                  {candidate.priority}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
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
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{candidate.experience}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{candidate.recruiter}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {candidate.keySkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.keySkills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.keySkills.length - 3}
                  </Badge>
                )}
              </div>
              <Badge className={getStageColor(candidate.currentStage)} variant="outline">
                {candidate.currentStage}
              </Badge>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Applied {new Date(candidate.appliedDate).toLocaleDateString()} • {candidate.daysInStage} days in current
              stage
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CandidatesList({ onViewCandidate }: CandidatesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedRecruiter, setSelectedRecruiter] = useState("all")

  const filteredCandidates = allCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.keySkills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = selectedRole === "all" || candidate.position.includes(selectedRole)
    const matchesStage = selectedStage === "all" || candidate.currentStage === selectedStage
    const matchesRecruiter = selectedRecruiter === "all" || candidate.recruiter === selectedRecruiter

    return matchesSearch && matchesRole && matchesStage && matchesRecruiter
  })

  const roles = ["all", ...Array.from(new Set(allCandidates.map((c) => c.position)))]
  const stages = ["all", ...Array.from(new Set(allCandidates.map((c) => c.currentStage)))]
  const recruiters = ["all", ...Array.from(new Set(allCandidates.map((c) => c.recruiter)))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Candidates</h1>
          <p className="text-muted-foreground">View and manage all candidates across roles</p>
        </div>
        <Button onClick={() => onViewCandidate("1")}>View Sample Profile</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search candidates by name, role, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage === "all" ? "All Stages" : stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
                <SelectTrigger className="w-[150px]">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredCandidates.length}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{filteredCandidates.filter((c) => c.priority === "high").length}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredCandidates.filter((c) => c.currentStage.includes("Interview")).length}
                </p>
                <p className="text-sm text-muted-foreground">In Interview</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Candidates ({filteredCandidates.length})</h2>
        </div>
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateListCard key={candidate.id} candidate={candidate} onViewCandidate={onViewCandidate} />
          ))}
        </div>
      </div>
    </div>
  )
}
