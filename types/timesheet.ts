export interface TimesheetEntry {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  clockIn: string
  clockOut: string
  breakDuration: number // in minutes
  totalHours: number
  overtimeHours: number
  status: "pending" | "approved" | "rejected"
  notes?: string
  projectId?: string
  projectName?: string
  entryMethod: "manual" | "uploaded" | "clock_system"
  validationFlags: ValidationFlag[]
}

export interface ValidationFlag {
  type: "overtime" | "unusual_pattern" | "missing_entry" | "late_entry" | "early_departure" | "long_break"
  severity: "warning" | "error" | "info"
  message: string
}

export interface TimesheetSummary {
  employeeId: string
  employeeName: string
  department: string
  avatar?: string
  weekStarting: string
  totalHours: number
  regularHours: number
  overtimeHours: number
  status: "pending" | "approved" | "rejected" | "partial"
  entries: TimesheetEntry[]
  validationFlags: ValidationFlag[]
  hasIssues: boolean
}

export interface TimesheetStats {
  totalEmployees: number
  pendingApprovals: number
  totalHoursThisWeek: number
  averageHoursPerEmployee: number
  overtimeHours: number
  employeesWithIssues: number
  missingEntries: number
}

export interface TimesheetFilters {
  period: "this_week" | "last_30_days" | "custom"
  startDate?: string
  endDate?: string
  status: "all" | "pending" | "approved" | "rejected"
  department: string
  hasIssues?: boolean
}
