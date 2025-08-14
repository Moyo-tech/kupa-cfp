"use client"
import { FileText, Upload, Plus, CheckCircle, Clock, AlertCircle, Users, ArrowRight, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getOnboardingProgress, sampleJobSpecs } from "@/data/job-specs"
import type { JobSpec } from "@/types/job-spec"

interface ClientOnboardingWelcomeProps {
  onCreateJobSpec: () => void
  onUploadDocument: () => void
  onViewJobSpec: (jobSpecId: string) => void
  onEditJobSpec: (jobSpecId: string) => void
  onAccessPlatform: () => void
}

export function ClientOnboardingWelcome({
  onCreateJobSpec,
  onUploadDocument,
  onViewJobSpec,
  onEditJobSpec,
  onAccessPlatform,
}: ClientOnboardingWelcomeProps) {
  const progress = getOnboardingProgress()
  const progressPercentage = progress.totalJobSpecs > 0 ? (progress.approvedJobSpecs / progress.totalJobSpecs) * 100 : 0

  const getStatusIcon = (status: JobSpec["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending-review":
      case "pending-approval":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">Kupa Global</h1>
              <p className="text-sm text-muted-foreground">Recruitment Platform</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Recruitment Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's get started by setting up your job specifications. Once approved by our team, you'll have full access
            to our recruitment platform.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Onboarding Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress.approvedJobSpecs} of {progress.totalJobSpecs} job specs approved
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progress.totalJobSpecs}</div>
                  <div className="text-sm text-muted-foreground">Total Job Specs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progress.approvedJobSpecs}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{progress.pendingJobSpecs}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{progress.rejectedJobSpecs}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Pending Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete these actions to proceed with your recruitment process
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!progress.hasAccessToPlatform && (
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900">Job Specifications Required</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          You need at least one approved job specification to access the recruitment platform.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={onCreateJobSpec}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Job Spec
                          </Button>
                          <Button variant="outline" size="sm" onClick={onUploadDocument}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {progress.hasAccessToPlatform && (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-green-900">Ready to Start Recruiting!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your job specifications have been approved. You can now access the full recruitment platform.
                        </p>
                        <Button className="mt-3" onClick={onAccessPlatform}>
                          Access Recruitment Platform
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Specifications List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Job Specifications</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onUploadDocument}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button size="sm" onClick={onCreateJobSpec}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {sampleJobSpecs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Specifications Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first job specification to get started with the recruitment process.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button onClick={onCreateJobSpec}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Job Spec
                      </Button>
                      <Button variant="outline" onClick={onUploadDocument}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sampleJobSpecs.map((jobSpec) => (
                      <div key={jobSpec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(jobSpec.status)}
                            <div className="flex-1">
                              <h3 className="font-medium">{jobSpec.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {jobSpec.department} • {jobSpec.location}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {getStatusBadge(jobSpec.status)}
                                <span className="text-xs text-muted-foreground">
                                  Updated {new Date(jobSpec.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onViewJobSpec(jobSpec.id)}>
                              View
                            </Button>
                            {jobSpec.status === "draft" || jobSpec.status === "rejected" ? (
                              <Button variant="outline" size="sm" onClick={() => onEditJobSpec(jobSpec.id)}>
                                Edit
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Guide */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Create Job Specifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Define your hiring requirements either manually or by uploading job descriptions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Internal Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team will review and may request clarifications on your job specs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Approval & Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Once approved, you'll gain full access to the recruitment platform.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is here to help you get started with your recruitment process.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
