"use client"
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  UserCheck,
  UserPlus,
  CheckCircle,
  ChevronRight,
  Activity,
  Target,
  Coffee,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface EmployeeRole {
  id: string
  title: string
  department: string
  totalEmployees: number
  activeEmployees: number
  onLeave: number
  probation: number
  needsAttention: number
  performanceReviewsDue: number
  timesheetsPending: number
  lastActivity: string
  healthScore: number
}

interface DashboardMetrics {
  totalEmployees: number
  newHiresThisMonth: number
  checkInsDue: number
  actionItems: number
  averageHealthScore: number
  employeeSatisfaction: number
}

// Sample employee role data
const employeeRoles: EmployeeRole[] = [
  {
    id: "1",
    title: "Software Engineers",
    department: "Engineering",
    totalEmployees: 12,
    activeEmployees: 10,
    onLeave: 1,
    probation: 1,
    needsAttention: 2,
    performanceReviewsDue: 3,
    timesheetsPending: 2,
    lastActivity: "2 hours ago",
    healthScore: 85,
  },
  {
    id: "2",
    title: "Product Managers",
    department: "Product",
    totalEmployees: 4,
    activeEmployees: 4,
    onLeave: 0,
    probation: 0,
    needsAttention: 0,
    performanceReviewsDue: 1,
    timesheetsPending: 1,
    lastActivity: "1 hour ago",
    healthScore: 92,
  },
  {
    id: "3",
    title: "Designers",
    department: "Design",
    totalEmployees: 6,
    activeEmployees: 5,
    onLeave: 1,
    probation: 0,
    needsAttention: 1,
    performanceReviewsDue: 2,
    timesheetsPending: 1,
    lastActivity: "3 hours ago",
    healthScore: 88,
  },
  {
    id: "4",
    title: "Sales",
    department: "Sales",
    totalEmployees: 8,
    activeEmployees: 7,
    onLeave: 0,
    probation: 1,
    needsAttention: 1,
    performanceReviewsDue: 2,
    timesheetsPending: 3,
    lastActivity: "30 minutes ago",
    healthScore: 78,
  },
  {
    id: "5",
    title: "Marketing",
    department: "Marketing",
    totalEmployees: 5,
    activeEmployees: 5,
    onLeave: 0,
    probation: 0,
    needsAttention: 0,
    performanceReviewsDue: 1,
    timesheetsPending: 1,
    lastActivity: "1 hour ago",
    healthScore: 90,
  },
  {
    id: "6",
    title: "Operations",
    department: "Operations",
    totalEmployees: 3,
    activeEmployees: 3,
    onLeave: 0,
    probation: 0,
    needsAttention: 0,
    performanceReviewsDue: 0,
    timesheetsPending: 0,
    lastActivity: "4 hours ago",
    healthScore: 95,
  },
]

// Calculate dashboard metrics
const dashboardMetrics: DashboardMetrics = {
  totalEmployees: employeeRoles.reduce((acc, role) => acc + role.totalEmployees, 0),
  newHiresThisMonth: 5,
  checkInsDue: 12,
  actionItems: employeeRoles.reduce((acc, role) => acc + role.needsAttention, 0),
  averageHealthScore: Math.round(employeeRoles.reduce((acc, role) => acc + role.healthScore, 0) / employeeRoles.length),
  employeeSatisfaction: 87,
}

interface ActionItem {
  id: string
  type: "review" | "timesheet" | "check-in" | "attention"
  message: string
  employee: string
  role: string
  urgency: "high" | "medium" | "low"
  dueDate?: string
}

const actionItems: ActionItem[] = [
  {
    id: "1",
    type: "review",
    message: "Performance review overdue",
    employee: "Sarah Chen",
    role: "Software Engineers",
    urgency: "high",
    dueDate: "2 days overdue",
  },
  {
    id: "2",
    type: "attention",
    message: "Multiple late arrivals",
    employee: "Mike Johnson",
    role: "Sales",
    urgency: "medium",
  },
  {
    id: "3",
    type: "check-in",
    message: "30-day check-in due",
    employee: "Alex Rivera",
    role: "Software Engineers",
    urgency: "medium",
    dueDate: "Tomorrow",
  },
  {
    id: "4",
    type: "timesheet",
    message: "Timesheet missing for last week",
    employee: "Emma Davis",
    role: "Marketing",
    urgency: "low",
    dueDate: "3 days ago",
  },
]

function RoleCard({ role, onViewEmployees }: { role: EmployeeRole; onViewEmployees: (roleId: string) => void }) {
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-blue-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onViewEmployees(role.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{role.title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {role.totalEmployees}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{role.department}</p>
            <div className="flex items-center gap-2">
              
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Employee Status Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-green-600">{role.activeEmployees}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-blue-600">{role.onLeave}</div>
              <div className="text-xs text-muted-foreground">On Leave</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-yellow-600">{role.probation}</div>
              <div className="text-xs text-muted-foreground">Probation</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2 pt-2 border-t">
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reviews Due</span>
              <span
                className={role.performanceReviewsDue > 0 ? "text-orange-600 font-medium" : "text-muted-foreground"}
              >
                {role.performanceReviewsDue}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timesheets Pending</span>
              <span className={role.timesheetsPending > 0 ? "text-blue-600 font-medium" : "text-muted-foreground"}>
                {role.timesheetsPending}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span>Last activity: {role.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionItemsPanel() {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Target className="h-4 w-4 text-purple-500" />
      case "timesheet":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "check-in":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "attention":
        return <AlertCircle className="h-4 w-4 text-red-500" />
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
          <AlertCircle className="h-5 w-5" />
          Action Items ({actionItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionItems.map((item) => (
          <div key={item.id} className={`border-l-4 ${getUrgencyColor(item.urgency)} pl-4 py-2`}>
            <div className="flex items-start gap-3">
              {getActionIcon(item.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.message}</p>
                <p className="text-xs text-muted-foreground">
                  {item.employee} • {item.role}
                </p>
                {item.dueDate && <p className="text-xs text-muted-foreground mt-1">Due: {item.dueDate}</p>}
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function EmployeeManagementDashboard({ onViewEmployees }: { onViewEmployees: (roleId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">Overview of your workforce and key metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{dashboardMetrics.totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{dashboardMetrics.newHiresThisMonth}</p>
                <p className="text-sm text-muted-foreground">New Hires This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{dashboardMetrics.checkInsDue}</p>
                <p className="text-sm text-muted-foreground">Check-ins Due</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{dashboardMetrics.actionItems}</p>
                <p className="text-sm text-muted-foreground">Action Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Health Overview */}
          

          {/* Role Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Teams & Roles ({employeeRoles.length})</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {employeeRoles.map((role) => (
                <RoleCard key={role.id} role={role} onViewEmployees={onViewEmployees} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActionItemsPanel />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex justify-between">
                <span className="text-sm">Performance Reviews Due</span>
                <span className="text-sm font-medium text-orange-600">
                  {employeeRoles.reduce((acc, role) => acc + role.performanceReviewsDue, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Timesheets Pending</span>
                <span className="text-sm font-medium text-blue-600">
                  {employeeRoles.reduce((acc, role) => acc + role.timesheetsPending, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Employees on Leave</span>
                <span className="text-sm font-medium">
                  {employeeRoles.reduce((acc, role) => acc + role.onLeave, 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <UserCheck className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">New hire onboarding completed</p>
                  <p className="text-xs text-muted-foreground">Jessica Wong • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">Performance review submitted</p>
                  <p className="text-xs text-muted-foreground">David Kim • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">Leave request approved</p>
                  <p className="text-xs text-muted-foreground">Maria Garcia • 1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
