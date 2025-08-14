"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Briefcase,
  Star,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { JobSpec } from "@/types/job-spec"

interface JobSpecDetailsProps {
  jobSpec: JobSpec
  onBack: () => void
  onEdit: (jobSpec: JobSpec) => void
  onApprove: (jobSpec: JobSpec) => void
  onReject: (jobSpec: JobSpec, reason: string) => void
  canEdit?: boolean
  canApprove?: boolean
}

export function JobSpecDetails({
  jobSpec,
  onBack,
  onEdit,
  onApprove,
  onReject,
  canEdit = false,
  canApprove = false,
}: JobSpecDetailsProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const getStatusBadge = (status: JobSpec["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "pending-review":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pending Review</Badge>
      case "pending-approval":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Approval</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>
    }
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(jobSpec, rejectionReason)
      setShowRejectForm(false)
      setRejectionReason("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{jobSpec.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {jobSpec.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobSpec.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Start: {new Date(jobSpec.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(jobSpec.status)}
              {canEdit && (
                <Button variant="outline" onClick={() => onEdit(jobSpec)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Contract Type</Label>
                    <p className="capitalize">{jobSpec.contractType.replace("-", " ")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Hiring Manager</Label>
                    <p className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {jobSpec.hiringManager}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Salary Range</Label>
                    <p className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {jobSpec.salaryRange.currency} {jobSpec.salaryRange.min.toLocaleString()} -{" "}
                      {jobSpec.salaryRange.max.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Experience Required</Label>
                    <p>
                      {jobSpec.experienceYears.min}-{jobSpec.experienceYears.max} years
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{jobSpec.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobSpec.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobSpec.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobSpec.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Must Have</Label>
                  <div className="flex flex-wrap gap-2">
                    {jobSpec.mustHaveSkills.map((skill, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Nice to Have</Label>
                  <div className="flex flex-wrap gap-2">
                    {jobSpec.niceToHaveSkills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-muted-foreground">{new Date(jobSpec.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {jobSpec.submittedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <div>
                      <p className="font-medium">Submitted</p>
                      <p className="text-muted-foreground">{new Date(jobSpec.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {jobSpec.reviewedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <div>
                      <p className="font-medium">Reviewed</p>
                      <p className="text-muted-foreground">{new Date(jobSpec.reviewedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {jobSpec.approvedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Approved</p>
                      <p className="text-muted-foreground">{new Date(jobSpec.approvedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {jobSpec.rejectedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div>
                      <p className="font-medium">Rejected</p>
                      <p className="text-muted-foreground">{new Date(jobSpec.rejectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {(jobSpec.internalNotes || jobSpec.clientNotes || jobSpec.rejectionReason) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Notes & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobSpec.internalNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Internal Notes</Label>
                      <p className="text-sm mt-1 p-2 bg-blue-50 rounded border">{jobSpec.internalNotes}</p>
                    </div>
                  )}
                  {jobSpec.clientNotes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Client Notes</Label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">{jobSpec.clientNotes}</p>
                    </div>
                  )}
                  {jobSpec.rejectionReason && (
                    <div>
                      <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
                      <p className="text-sm mt-1 p-2 bg-red-50 rounded border border-red-200">
                        {jobSpec.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {canApprove && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!showRejectForm ? (
                    <>
                      <Button className="w-full" onClick={() => onApprove(jobSpec)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Job Spec
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setShowRejectForm(true)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="rejection-reason">Rejection Reason</Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Please provide a reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRejectForm(false)
                            setRejectionReason("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
