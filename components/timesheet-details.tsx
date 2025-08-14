"use client"

import { useState } from "react"
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  Edit,
  FileText,
  ArrowLeft,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TimesheetSummary, TimesheetEntry, ValidationFlag } from "@/types/timesheet"

interface TimesheetDetailsProps {
  timesheet: TimesheetSummary
  onBack: () => void
  onApprove?: (employeeId: string) => void
  onReject?: (employeeId: string) => void
}

export function TimesheetDetails({ timesheet, onBack, onApprove, onReject }: TimesheetDetailsProps) {
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null)

  const getValidationColor = (severity: ValidationFlag["severity"]) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getValidationIcon = (severity: ValidationFlag["severity"]) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getEntryMethodIcon = (method: TimesheetEntry["entryMethod"]) => {
    switch (method) {
      case "uploaded":
        return <Upload className="h-4 w-4" />
      case "manual":
        return <Edit className="h-4 w-4" />
      case "clock_system":
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getEntryMethodLabel = (method: TimesheetEntry["entryMethod"]) => {
    switch (method) {
      case "uploaded":
        return "Uploaded"
      case "manual":
        return "Manual Entry"
      case "clock_system":
        return "Clock System"
      default:
        return "Unknown"
    }
  }

  const formatTime = (time: string) => {
    if (!time) return "Not recorded"
    return new Date(`2024-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timesheets
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {timesheet.employeeName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{timesheet.employeeName}</h1>
              <p className="text-muted-foreground">
                {timesheet.department} • Week of {new Date(timesheet.weekStarting).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {timesheet.status === "pending" && (
            <>
              <Button variant="outline" onClick={() => onReject?.(timesheet.employeeId)}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => onApprove?.(timesheet.employeeId)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{timesheet.totalHours}h</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{timesheet.regularHours}h</p>
                <p className="text-sm text-muted-foreground">Regular Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{timesheet.overtimeHours}h</p>
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{timesheet.entries.length}</p>
                <p className="text-sm text-muted-foreground">Days Recorded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Issues */}
      {timesheet.validationFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Validation Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timesheet.validationFlags.map((flag, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Badge className={getValidationColor(flag.severity)} variant="outline">
                    <div className="flex items-center gap-1">
                      {getValidationIcon(flag.severity)}
                      {flag.severity}
                    </div>
                  </Badge>
                  <span className="text-sm">{flag.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Break</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Entry Method</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheet.entries.map((entry) => (
                <TableRow key={entry.id} className={entry.validationFlags.length > 0 ? "bg-yellow-50" : ""}>
                  <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatTime(entry.clockIn)}</TableCell>
                  <TableCell>{formatTime(entry.clockOut)}</TableCell>
                  <TableCell>{formatDuration(entry.breakDuration)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.totalHours}h</span>
                      {entry.overtimeHours > 0 && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          +{entry.overtimeHours}h OT
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.projectName ? (
                      <div>
                        <p className="font-medium text-sm">{entry.projectName}</p>
                        <p className="text-xs text-muted-foreground">{entry.projectId}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No project</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEntryMethodIcon(entry.entryMethod)}
                      <span className="text-sm">{getEntryMethodLabel(entry.entryMethod)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.validationFlags.length > 0 ? (
                      <div className="space-y-1">
                        {entry.validationFlags.map((flag, index) => (
                          <Badge key={index} className={getValidationColor(flag.severity)} variant="outline">
                            <div className="flex items-center gap-1">
                              {getValidationIcon(flag.severity)}
                              <span className="text-xs">{flag.type.replace("_", " ")}</span>
                            </div>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.notes ? (
                      <p className="text-sm text-muted-foreground max-w-xs truncate" title={entry.notes}>
                        {entry.notes}
                      </p>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
