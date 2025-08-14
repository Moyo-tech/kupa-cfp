"use client"

import { useState } from "react"
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { timesheetSummaries, timesheetStats } from "@/data/timesheets"
import { TimesheetDetails } from "./timesheet-details"
import type { TimesheetFilters, TimesheetSummary } from "@/types/timesheet"

interface TimesheetManagementProps {
  onViewDetails?: (employeeId: string) => void
}

export function TimesheetManagement({ onViewDetails }: TimesheetManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<TimesheetFilters>({
    period: "this_week",
    status: "all",
    department: "all",
    hasIssues: false,
  })
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetSummary | null>(null)

  const filteredTimesheets = timesheetSummaries.filter((timesheet) => {
    const matchesSearch =
      timesheet.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timesheet.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status === "all" || timesheet.status === filters.status
    const matchesDepartment = filters.department === "all" || timesheet.department === filters.department
    const matchesIssues = !filters.hasIssues || timesheet.hasIssues

    return matchesSearch && matchesStatus && matchesDepartment && matchesIssues
  })

  const departments = ["all", ...Array.from(new Set(timesheetSummaries.map((t) => t.department)))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "partial":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleApprove = (employeeId: string) => {
    console.log("Approving timesheet for employee:", employeeId)
  }

  const handleReject = (employeeId: string) => {
    console.log("Rejecting timesheet for employee:", employeeId)
  }

  const handleViewDetails = (timesheet: TimesheetSummary) => {
    setSelectedTimesheet(timesheet)
  }

  if (selectedTimesheet) {
    return (
      <TimesheetDetails
        timesheet={selectedTimesheet}
        onBack={() => setSelectedTimesheet(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheet Management</h1>
          <p className="text-muted-foreground">Track and approve employee working hours</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{timesheetStats.pendingApprovals}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{timesheetStats.averageHoursPerEmployee}</p>
                <p className="text-sm text-muted-foreground">Avg Hours/Employee</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{timesheetStats.overtimeHours}</p>
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{timesheetStats.employeesWithIssues}</p>
                <p className="text-sm text-muted-foreground">Employees with Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Period Filters */}
      <Tabs value={filters.period} onValueChange={(value) => setFilters({ ...filters, period: value as any })}>
        <TabsList>
          <TabsTrigger value="this_week">This Week</TabsTrigger>
          <TabsTrigger value="last_30_days">Last 30 Days</TabsTrigger>
          <TabsTrigger value="custom">Custom Range</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Status: {filters.status === "all" ? "All" : filters.status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: "all" })}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: "pending" })}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: "approved" })}>Approved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilters({ ...filters, status: "rejected" })}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Department: {filters.department === "all" ? "All" : filters.department}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {departments.map((dept) => (
              <DropdownMenuItem key={dept} onClick={() => setFilters({ ...filters, department: dept })}>
                {dept === "all" ? "All Departments" : dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant={filters.hasIssues ? "default" : "outline"}
          onClick={() => setFilters({ ...filters, hasIssues: !filters.hasIssues })}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Issues Only
        </Button>
      </div>

      {/* Timesheets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timesheets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Week Starting</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Regular Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimesheets.map((timesheet) => (
                <TableRow key={timesheet.employeeId} className={timesheet.hasIssues ? "bg-yellow-50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {timesheet.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{timesheet.employeeName}</p>
                        <p className="text-sm text-muted-foreground">ID: {timesheet.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{timesheet.department}</TableCell>
                  <TableCell>{new Date(timesheet.weekStarting).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{timesheet.totalHours}h</TableCell>
                  <TableCell>{timesheet.regularHours}h</TableCell>
                  <TableCell>
                    {timesheet.overtimeHours > 0 ? (
                      <span className="text-orange-600 font-medium">{timesheet.overtimeHours}h</span>
                    ) : (
                      <span className="text-muted-foreground">0h</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(timesheet.status)} variant="outline">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(timesheet.status)}
                        {timesheet.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {timesheet.hasIssues ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">{timesheet.validationFlags.length} issues</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Valid</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(timesheet)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {timesheet.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleApprove(timesheet.employeeId)}>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(timesheet.employeeId)}>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
