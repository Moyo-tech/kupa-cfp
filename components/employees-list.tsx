"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Users,
  Mail,
  MapPin,
  Calendar,
  Clock,
  MoreHorizontal,
  UserCheck,
  Coffee,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "on-leave" | "probation" | "inactive"
  startDate: string
  location: string
  manager: string
  avatar?: string
  phone?: string
  lastActivity: string
  healthScore: number
  upcomingReview?: string
  pendingActions: number
}

// Sample employee data
const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "Senior Software Engineer",
    department: "Engineering",
    status: "active",
    startDate: "2022-03-15",
    location: "San Francisco, CA",
    manager: "John Smith",
    phone: "+1 (555) 123-4567",
    lastActivity: "2 hours ago",
    healthScore: 92,
    upcomingReview: "2024-01-15",
    pendingActions: 1,
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Sales Manager",
    department: "Sales",
    status: "active",
    startDate: "2021-08-20",
    location: "New York, NY",
    manager: "Lisa Davis",
    phone: "+1 (555) 234-5678",
    lastActivity: "30 minutes ago",
    healthScore: 78,
    pendingActions: 2,
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@company.com",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "active",
    startDate: "2023-01-10",
    location: "Austin, TX",
    manager: "Robert Wilson",
    phone: "+1 (555) 345-6789",
    lastActivity: "1 hour ago",
    healthScore: 88,
    pendingActions: 1,
  },
  {
    id: "4",
    name: "Alex Rivera",
    email: "alex.rivera@company.com",
    role: "Software Engineer",
    department: "Engineering",
    status: "probation",
    startDate: "2024-11-01",
    location: "Remote",
    manager: "John Smith",
    phone: "+1 (555) 456-7890",
    lastActivity: "3 hours ago",
    healthScore: 85,
    upcomingReview: "2024-12-01",
    pendingActions: 0,
  },
  {
    id: "5",
    name: "Jessica Wong",
    email: "jessica.wong@company.com",
    role: "UX Designer",
    department: "Design",
    status: "active",
    startDate: "2022-11-05",
    location: "Seattle, WA",
    manager: "Maria Garcia",
    phone: "+1 (555) 567-8901",
    lastActivity: "45 minutes ago",
    healthScore: 94,
    pendingActions: 0,
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "Product Manager",
    department: "Product",
    status: "on-leave",
    startDate: "2021-05-12",
    location: "Los Angeles, CA",
    manager: "Sarah Johnson",
    phone: "+1 (555) 678-9012",
    lastActivity: "5 days ago",
    healthScore: 90,
    pendingActions: 0,
  },
]

function EmployeeCard({ employee }: { employee: Employee }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "on-leave":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "probation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(employee.status)} variant="outline">
                    {employee.status.replace("-", " ")}
                  </Badge>
                  
                </div>
              </div>

              <div className="flex items-center gap-2">
                {employee.pendingActions > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {employee.pendingActions} Action{employee.pendingActions > 1 ? "s" : ""}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Check-in</DropdownMenuItem>
                    <DropdownMenuItem>View Performance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{employee.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              
              {employee.upcomingReview && (
                <span className="text-orange-600">
                  Review due: {new Date(employee.upcomingReview).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EmployeesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = ["all", ...Array.from(new Set(employees.map((emp) => emp.department)))]
  const statuses = ["all", "active", "on-leave", "probation", "inactive"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Employees</h1>
          <p className="text-muted-foreground">Manage and view all employees across your organization</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {selectedStatus === "all" ? "All Status" : selectedStatus.replace("-", " ")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statuses.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                {status === "all" ? "All Status" : status.replace("-", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-lg font-semibold">{employees.filter((e) => e.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-lg font-semibold">{employees.filter((e) => e.status === "on-leave").length}</p>
                <p className="text-xs text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-lg font-semibold">{employees.filter((e) => e.status === "probation").length}</p>
                <p className="text-xs text-muted-foreground">Probation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-lg font-semibold">{employees.reduce((acc, emp) => acc + emp.pendingActions, 0)}</p>
                <p className="text-xs text-muted-foreground">Action Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Employees ({filteredEmployees.length})</h2>
        </div>
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  )
}
