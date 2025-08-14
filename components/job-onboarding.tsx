"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { JobSpec, ContractType } from "@/types/job-spec"

interface JobOnboardingProps {
  existingJobSpec?: JobSpec
  onComplete: (jobSpec: Partial<JobSpec>) => void
  onCancel: () => void
}

interface FormData {
  title: string
  department: string
  location: string
  contractType: ContractType
  salaryMin: string
  salaryMax: string
  currency: string
  mustHaveSkills: string[]
  niceToHaveSkills: string[]
  experienceMin: string
  experienceMax: string
  startDate: string
  hiringManager: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

const initialFormData: FormData = {
  title: "",
  department: "",
  location: "",
  contractType: "full-time",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  mustHaveSkills: [],
  niceToHaveSkills: [],
  experienceMin: "",
  experienceMax: "",
  startDate: "",
  hiringManager: "",
  description: "",
  responsibilities: [],
  requirements: [],
  benefits: [],
}

const steps = [
  { id: 1, title: "Basic Information", description: "Job title, department, and location" },
  { id: 2, title: "Skills & Experience", description: "Required and preferred qualifications" },
  { id: 3, title: "Job Details", description: "Contract type, salary, and timeline" },
  { id: 4, title: "Description", description: "Job description and responsibilities" },
  { id: 5, title: "Review & Submit", description: "Review all information before submitting" },
]

export function JobOnboarding({ existingJobSpec, onComplete, onCancel }: JobOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(() => {
    if (existingJobSpec) {
      return {
        title: existingJobSpec.title,
        department: existingJobSpec.department,
        location: existingJobSpec.location,
        contractType: existingJobSpec.contractType,
        salaryMin: existingJobSpec.salaryRange.min.toString(),
        salaryMax: existingJobSpec.salaryRange.max.toString(),
        currency: existingJobSpec.salaryRange.currency,
        mustHaveSkills: existingJobSpec.mustHaveSkills,
        niceToHaveSkills: existingJobSpec.niceToHaveSkills,
        experienceMin: existingJobSpec.experienceYears.min.toString(),
        experienceMax: existingJobSpec.experienceYears.max.toString(),
        startDate: existingJobSpec.startDate,
        hiringManager: existingJobSpec.hiringManager,
        description: existingJobSpec.description,
        responsibilities: existingJobSpec.responsibilities,
        requirements: existingJobSpec.requirements,
        benefits: existingJobSpec.benefits,
      }
    }
    return initialFormData
  })

  const [skillInput, setSkillInput] = useState("")
  const [niceToHaveInput, setNiceToHaveInput] = useState("")
  const [responsibilityInput, setResponsibilityInput] = useState("")
  const [requirementInput, setRequirementInput] = useState("")
  const [benefitInput, setBenefitInput] = useState("")

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = (type: "mustHave" | "niceToHave") => {
    const input = type === "mustHave" ? skillInput : niceToHaveInput
    const field = type === "mustHave" ? "mustHaveSkills" : "niceToHaveSkills"

    if (input.trim()) {
      updateFormData(field, [...formData[field], input.trim()])
      if (type === "mustHave") {
        setSkillInput("")
      } else {
        setNiceToHaveInput("")
      }
    }
  }

  const removeSkill = (type: "mustHave" | "niceToHave", index: number) => {
    const field = type === "mustHave" ? "mustHaveSkills" : "niceToHaveSkills"
    updateFormData(
      field,
      formData[field].filter((_, i) => i !== index),
    )
  }

  const addListItem = (type: "responsibility" | "requirement" | "benefit") => {
    const inputs = {
      responsibility: responsibilityInput,
      requirement: requirementInput,
      benefit: benefitInput,
    }

    const fields = {
      responsibility: "responsibilities",
      requirement: "requirements",
      benefit: "benefits",
    } as const

    const setters = {
      responsibility: setResponsibilityInput,
      requirement: setRequirementInput,
      benefit: setBenefitInput,
    }

    const input = inputs[type]
    const field = fields[type]

    if (input.trim()) {
      updateFormData(field, [...formData[field], input.trim()])
      setters[type]("")
    }
  }

  const removeListItem = (type: "responsibilities" | "requirements" | "benefits", index: number) => {
    updateFormData(
      type,
      formData[type].filter((_, i) => i !== index),
    )
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.department && formData.location)
      case 2:
        return formData.mustHaveSkills.length > 0 && formData.experienceMin && formData.experienceMax
      case 3:
        return !!(
          formData.contractType &&
          formData.salaryMin &&
          formData.salaryMax &&
          formData.startDate &&
          formData.hiringManager
        )
      case 4:
        return !!(formData.description && formData.responsibilities.length > 0 && formData.requirements.length > 0)
      case 5:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const jobSpec: Partial<JobSpec> = {
      id: existingJobSpec?.id || `job-${Date.now()}`,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      contractType: formData.contractType,
      salaryRange: {
        min: Number.parseInt(formData.salaryMin),
        max: Number.parseInt(formData.salaryMax),
        currency: formData.currency,
      },
      mustHaveSkills: formData.mustHaveSkills,
      niceToHaveSkills: formData.niceToHaveSkills,
      experienceYears: {
        min: Number.parseInt(formData.experienceMin),
        max: Number.parseInt(formData.experienceMax),
      },
      startDate: formData.startDate,
      hiringManager: formData.hiringManager,
      description: formData.description,
      responsibilities: formData.responsibilities,
      requirements: formData.requirements,
      benefits: formData.benefits,
      status: "pending-review",
      createdAt: existingJobSpec?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    }

    onComplete(jobSpec)
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {existingJobSpec ? "Edit Job Specification" : "Create Job Specification"}
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => updateFormData("department", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="e.g. Remote, New York, NY, or San Francisco, CA"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Must-Have Skills *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a required skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill("mustHave")}
                    />
                    <Button type="button" onClick={() => addSkill("mustHave")}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.mustHaveSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => removeSkill("mustHave", index)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Nice-to-Have Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={niceToHaveInput}
                      onChange={(e) => setNiceToHaveInput(e.target.value)}
                      placeholder="Add a preferred skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill("niceToHave")}
                    />
                    <Button type="button" onClick={() => addSkill("niceToHave")}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.niceToHaveSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => removeSkill("niceToHave", index)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experienceMin">Minimum Experience (years) *</Label>
                    <Input
                      id="experienceMin"
                      type="number"
                      value={formData.experienceMin}
                      onChange={(e) => updateFormData("experienceMin", e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceMax">Maximum Experience (years) *</Label>
                    <Input
                      id="experienceMax"
                      type="number"
                      value={formData.experienceMax}
                      onChange={(e) => updateFormData("experienceMax", e.target.value)}
                      placeholder="10"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="contractType">Contract Type *</Label>
                  <Select
                    value={formData.contractType}
                    onValueChange={(value: ContractType) => updateFormData("contractType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency *</Label>
                    <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salaryMin">Minimum Salary *</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => updateFormData("salaryMin", e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Maximum Salary *</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => updateFormData("salaryMax", e.target.value)}
                      placeholder="80000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Intended Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData("startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hiringManager">Hiring Manager *</Label>
                    <Input
                      id="hiringManager"
                      value={formData.hiringManager}
                      onChange={(e) => updateFormData("hiringManager", e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Provide a detailed description of the role..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Key Responsibilities *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      placeholder="Add a key responsibility"
                      onKeyPress={(e) => e.key === "Enter" && addListItem("responsibility")}
                    />
                    <Button type="button" onClick={() => addListItem("responsibility")}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {formData.responsibilities.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{item}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeListItem("responsibilities", index)}>
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Requirements *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      placeholder="Add a requirement"
                      onKeyPress={(e) => e.key === "Enter" && addListItem("requirement")}
                    />
                    <Button type="button" onClick={() => addListItem("requirement")}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {formData.requirements.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{item}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeListItem("requirements", index)}>
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Benefits & Perks</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="Add a benefit or perk"
                      onKeyPress={(e) => e.key === "Enter" && addListItem("benefit")}
                    />
                    <Button type="button" onClick={() => addListItem("benefit")}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {formData.benefits.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{item}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeListItem("benefits", index)}>
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Review Your Job Specification</h3>
                  <p className="text-muted-foreground">
                    Please review all the information below before submitting for review.
                  </p>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong>Title:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Department:</strong> {formData.department}
                      </div>
                      <div>
                        <strong>Location:</strong> {formData.location}
                      </div>
                      <div>
                        <strong>Contract Type:</strong> {formData.contractType.replace("-", " ")}
                      </div>
                      <div>
                        <strong>Hiring Manager:</strong> {formData.hiringManager}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Compensation & Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong>Salary Range:</strong> {formData.currency} {formData.salaryMin} - {formData.salaryMax}
                      </div>
                      <div>
                        <strong>Experience:</strong> {formData.experienceMin}-{formData.experienceMax} years
                      </div>
                      <div>
                        <strong>Start Date:</strong> {formData.startDate}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <strong>Must-Have Skills:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.mustHaveSkills.map((skill, index) => (
                            <Badge key={index} variant="default">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {formData.niceToHaveSkills.length > 0 && (
                        <div>
                          <strong>Nice-to-Have Skills:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.niceToHaveSkills.map((skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <strong>Description:</strong>
                        <p className="mt-1 text-muted-foreground">{formData.description}</p>
                      </div>
                      <div>
                        <strong>Key Responsibilities:</strong>
                        <ul className="mt-1 space-y-1">
                          {formData.responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Requirements:</strong>
                        <ul className="mt-1 space-y-1">
                          {formData.requirements.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {formData.benefits.length > 0 && (
                        <div>
                          <strong>Benefits & Perks:</strong>
                          <ul className="mt-1 space-y-1">
                            {formData.benefits.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!validateStep(currentStep)}>
              Submit for Review
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
