export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  avatar?: string
  leaveType: "vacation" | "sick" | "personal" | "maternity" | "paternity" | "bereavement" | "other"
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  isEmergency: boolean
}

export interface LeaveBalance {
  employeeId: string
  employeeName: string
  vacation: {
    total: number
    used: number
    remaining: number
  }
  sick: {
    total: number
    used: number
    remaining: number
  }
  personal: {
    total: number
    used: number
    remaining: number
  }
}

export interface LeaveStats {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  employeesOnLeave: number
}
