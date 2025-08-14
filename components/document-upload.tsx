"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, File, X, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedData?: {
    title: string
    department: string
    location: string
    skills: string[]
    experience: string
    salary: string
  }
}

interface DocumentUploadProps {
  onBack: () => void
  onComplete: (files: UploadedFile[]) => void
}

export function DocumentUpload({ onBack, onComplete }: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }, [])

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload and processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }

  const simulateFileProcessing = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "uploading") {
            const newProgress = Math.min(file.progress + 10, 100)
            if (newProgress === 100) {
              clearInterval(uploadInterval)
              // Start processing
              setTimeout(() => {
                setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 0 } : f)))
                simulateDataExtraction(fileId)
              }, 500)
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const simulateDataExtraction = (fileId: string) => {
    // Simulate AI processing
    const processingInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "processing") {
            const newProgress = Math.min(file.progress + 15, 100)
            if (newProgress === 100) {
              clearInterval(processingInterval)
              // Complete with extracted data
              setTimeout(() => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileId
                      ? {
                          ...f,
                          status: "completed",
                          extractedData: {
                            title: "Senior Software Engineer",
                            department: "Engineering",
                            location: "Remote",
                            skills: ["React", "TypeScript", "Node.js", "AWS"],
                            experience: "5+ years",
                            salary: "$80,000 - $120,000",
                          },
                        }
                      : f,
                  ),
                )
              }, 500)
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <File className="h-4 w-4 text-blue-500" />
    }
  }

  const completedFiles = files.filter((file) => file.status === "completed")
  const canProceed = completedFiles.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Welcome
          </Button>
          <h1 className="text-3xl font-bold mb-2">Upload Job Descriptions</h1>
          <p className="text-muted-foreground">
            Upload your job description documents and we'll extract the key information automatically.
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Drop your files here</h3>
                <p className="text-muted-foreground mb-4">or click to browse and select files</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer bg-transparent">
                    Select Files
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, DOC, DOCX, TXT</p>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(file.status)}
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              file.status === "completed"
                                ? "default"
                                : file.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {file.status === "uploading"
                              ? "Uploading"
                              : file.status === "processing"
                                ? "Processing"
                                : file.status === "completed"
                                  ? "Completed"
                                  : "Error"}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {(file.status === "uploading" || file.status === "processing") && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{file.status === "uploading" ? "Uploading..." : "Extracting information..."}</span>
                            <span>{file.progress}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      )}

                      {file.status === "completed" && file.extractedData && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="font-medium text-green-900 mb-2">Extracted Information:</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Title:</span> {file.extractedData.title}
                            </div>
                            <div>
                              <span className="font-medium">Department:</span> {file.extractedData.department}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {file.extractedData.location}
                            </div>
                            <div>
                              <span className="font-medium">Experience:</span> {file.extractedData.experience}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Skills:</span> {file.extractedData.skills.join(", ")}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Salary:</span> {file.extractedData.salary}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {canProceed && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ready to proceed</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedFiles.length} file{completedFiles.length !== 1 ? "s" : ""} processed successfully
                    </p>
                  </div>
                  <Button onClick={() => onComplete(completedFiles)}>Continue with Extracted Data</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
