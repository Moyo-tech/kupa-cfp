"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Upload, ArrowLeft, ArrowRight, Loader2, Check, Sparkles } from "lucide-react"

interface FormData {
  // Step 1: Personal Info
  fullName: string
  email: string
  phone: string

  // Step 2: Role Selection
  role: string

  // Step 3: Dynamic Questions
  socialMediaExperience?: string
  portfolioLink?: string
  socialMediaTools?: string
  contentCreation?: string
  emailMarketing?: string
  location?: string
  socialMediaPages?: string

  itExpertise?: string
  teachingExperience?: string
  complexConcepts?: string
  lmsPlatforms?: string
  itPortfolio?: string

  curriculumExperience?: string
  needsAnalysis?: string
  curriculumPortfolio?: string
  toolsProficiency?: string
  curriculumEvaluation?: string

  // Step 4: File Uploads
  coverLetter?: File
  resume?: File
}

const steps = [
  { id: 1, title: "Personal Info", description: "Basic information" },
  { id: 2, title: "Role Selection", description: "Choose your position" },
  { id: 3, title: "Role Questions", description: "Specific questions" },
  { id: 4, title: "Documents", description: "Upload files" },
  { id: 5, title: "Review", description: "Review & submit" },
]

const roles = [
  { value: "social-media-manager", label: "Social Media Manager" },
  { value: "it-tutor", label: "IT Tutor" },
  { value: "curriculum-designer", label: "Curriculum Designer" },
]

export default function JobApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateFormData = (field: keyof FormData, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Must start with + followed by country code (1-4 digits) and phone number
    const phoneRegex = /^\+\d{1,4}\d{6,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const validateURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        else if (!validatePhoneNumber(formData.phone))
          newErrors.phone = "Phone number must include country code (e.g., +1234567890)"
        break
      case 2:
        if (!formData.role) newErrors.role = "Please select a role"
        break
      case 3:
        if (formData.role === "social-media-manager") {
          if (!formData.socialMediaExperience?.trim()) newErrors.socialMediaExperience = "This field is required"
          if (!formData.portfolioLink?.trim()) newErrors.portfolioLink = "Portfolio link is required"
          else if (!validateURL(formData.portfolioLink)) newErrors.portfolioLink = "Please enter a valid URL"
          if (!formData.socialMediaTools?.trim()) newErrors.socialMediaTools = "This field is required"
          if (!formData.contentCreation) newErrors.contentCreation = "Please select an option"
          if (!formData.emailMarketing?.trim()) newErrors.emailMarketing = "This field is required"
          if (!formData.location) newErrors.location = "Please select an option"
          if (!formData.socialMediaPages?.trim()) newErrors.socialMediaPages = "This field is required"
        } else if (formData.role === "it-tutor") {
          if (!formData.itExpertise?.trim()) newErrors.itExpertise = "This field is required"
          if (!formData.teachingExperience?.trim()) newErrors.teachingExperience = "This field is required"
          if (!formData.complexConcepts?.trim()) newErrors.complexConcepts = "This field is required"
          if (!formData.lmsPlatforms?.trim()) newErrors.lmsPlatforms = "This field is required"
          if (!formData.itPortfolio?.trim()) newErrors.itPortfolio = "Portfolio link is required"
          else if (!validateURL(formData.itPortfolio)) newErrors.itPortfolio = "Please enter a valid URL"
        } else if (formData.role === "curriculum-designer") {
          if (!formData.curriculumExperience?.trim()) newErrors.curriculumExperience = "This field is required"
          if (!formData.needsAnalysis?.trim()) newErrors.needsAnalysis = "This field is required"
          if (!formData.curriculumPortfolio?.trim()) newErrors.curriculumPortfolio = "Portfolio link is required"
          else if (!validateURL(formData.curriculumPortfolio))
            newErrors.curriculumPortfolio = "Please enter a valid URL"
          if (!formData.toolsProficiency?.trim()) newErrors.toolsProficiency = "This field is required"
          if (!formData.curriculumEvaluation?.trim()) newErrors.curriculumEvaluation = "This field is required"
        }
        break
      case 4:
        if (!formData.coverLetter) newErrors.coverLetter = "Cover letter is required"
        if (!formData.resume) newErrors.resume = "CV/Resume is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)

    // Simulate API call with 1.5 second delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted with data:", formData)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleFileUpload = (field: "coverLetter" | "resume", file: File | null) => {
    if (file) {
      updateFormData(field, file)
    }
  }

  const progress = (currentStep / 5) * 100

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ecfdf4] via-white to-[#d1fae3] p-4">
        <Card className="modern-card w-full max-w-2xl mx-auto">
          <CardContent className="pt-16 pb-16 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
              className="mb-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#34d392] to-[#10b97a] rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-[#34d392] to-[#10b97a] rounded-full flex items-center justify-center shadow-2xl shadow-[#34d392]/40">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-8 h-8 text-[#34d392]" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#34d392] to-[#10b97a] bg-clip-text text-transparent mb-6">
                Application Submitted!
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Thank you for your interest in joining our team. We've received your application and will review it
                carefully.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-[#ecfdf4] to-[#d1fae3] rounded-xl p-6"
              >
                <p className="text-gray-600 font-medium">
                  You should hear back from us within 5-7 business days. We appreciate your patience!
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfdf4] via-white to-[#d1fae3] p-4">
      <Card className="modern-card w-full max-w-2xl mx-auto">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Job Application
            </CardTitle>
            <motion.span
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
            >
              Step {currentStep} of 5
            </motion.span>
          </div>

          <div className="progress-bar h-3 mb-6">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`step-indicator w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step.id < currentStep
                      ? "completed text-white"
                      : step.id === currentStep
                        ? "active text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step.id < currentStep ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    step.id
                  )}
                </motion.div>
                <span className="text-xs mt-2 text-center font-medium text-gray-600">{step.title}</span>
              </motion.div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                  >
                    Personal Information
                  </motion.h3>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <div className="modern-input">
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                          errors.fullName ? "text-red-600" : ""
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-red-500 font-medium"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <div className="modern-input">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder="Enter your email address"
                        className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                          errors.email ? "text-red-600" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-red-500 font-medium"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="modern-input">
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="+1234567890 (include country code)"
                        className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                          errors.phone ? "text-red-600" : ""
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-red-500 font-medium"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              )}

              {/* Step 2: Role Selection */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                  >
                    Role Selection
                  </motion.h3>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label className="text-sm font-semibold text-gray-700">Select Position *</Label>
                    <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                      <SelectTrigger
                        className={`modern-input h-14 text-lg font-medium ${errors.role ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Choose a position" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border-gray-200">
                        {roles.map((role) => (
                          <SelectItem
                            key={role.value}
                            value={role.value}
                            className="text-lg font-medium hover:bg-[#ecfdf4] focus:bg-[#ecfdf4]"
                          >
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-red-500 font-medium"
                      >
                        {errors.role}
                      </motion.p>
                    )}
                  </motion.div>

                  {formData.role && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-gradient-to-r from-[#ecfdf4] to-[#d1fae3] p-6 rounded-2xl border border-[#34d392]/20"
                    >
                      <h4 className="font-bold text-lg text-gray-800 mb-3">
                        {roles.find((r) => r.value === formData.role)?.label}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {formData.role === "social-media-manager" &&
                          "Manage social media accounts, create content, and engage with audiences across various platforms."}
                        {formData.role === "it-tutor" &&
                          "Provide IT education and tutoring services to help students learn technology skills."}
                        {formData.role === "curriculum-designer" &&
                          "Design and develop educational curricula and instructional materials for various programs."}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Role-Specific Questions */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                  >
                    Role-Specific Questions
                  </motion.h3>

                  {/* Social Media Manager Questions */}
                  {formData.role === "social-media-manager" && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="socialMediaExperience" className="text-sm font-semibold text-gray-700">
                          How long have you managed social media accounts? *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="socialMediaExperience"
                            value={formData.socialMediaExperience || ""}
                            onChange={(e) => updateFormData("socialMediaExperience", e.target.value)}
                            placeholder="e.g., 3 years"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.socialMediaExperience ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.socialMediaExperience && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.socialMediaExperience}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="portfolioLink" className="text-sm font-semibold text-gray-700">
                          Upload link to portfolio/social handles *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="portfolioLink"
                            type="url"
                            value={formData.portfolioLink || ""}
                            onChange={(e) => updateFormData("portfolioLink", e.target.value)}
                            placeholder="https://..."
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.portfolioLink ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.portfolioLink && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.portfolioLink}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="socialMediaTools" className="text-sm font-semibold text-gray-700">
                          Which social media tools are you familiar with? *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="socialMediaTools"
                            value={formData.socialMediaTools || ""}
                            onChange={(e) => updateFormData("socialMediaTools", e.target.value)}
                            placeholder="e.g., Hootsuite, Buffer, Canva"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.socialMediaTools ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.socialMediaTools && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.socialMediaTools}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label className="text-sm font-semibold text-gray-700">
                          Can you create content, film & edit videos? *
                        </Label>
                        <RadioGroup
                          value={formData.contentCreation || ""}
                          onValueChange={(value) => updateFormData("contentCreation", value)}
                          className={`flex flex-col gap-2 ${
                            errors.contentCreation ? "border border-red-500 rounded p-2" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="yes" id="content-yes" className="h-5 w-5" />
                            <Label htmlFor="content-yes" className="text-gray-600 font-medium">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="no" id="content-no" className="h-5 w-5" />
                            <Label htmlFor="content-no" className="text-gray-600 font-medium">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.contentCreation && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.contentCreation}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="emailMarketing" className="text-sm font-semibold text-gray-700">
                          Are you familiar with email marketing? List tools *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="emailMarketing"
                            value={formData.emailMarketing || ""}
                            onChange={(e) => updateFormData("emailMarketing", e.target.value)}
                            placeholder="e.g., Mailchimp, ConvertKit"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.emailMarketing ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.emailMarketing && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.emailMarketing}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label className="text-sm font-semibold text-gray-700">
                          Do you live at Ajah, Ado, Badore or environs? *
                        </Label>
                        <RadioGroup
                          value={formData.location || ""}
                          onValueChange={(value) => updateFormData("location", value)}
                          className={`flex flex-col gap-2 ${
                            errors.location ? "border border-red-500 rounded p-2" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="yes" id="location-yes" className="h-5 w-5" />
                            <Label htmlFor="location-yes" className="text-gray-600 font-medium">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="no" id="location-no" className="h-5 w-5" />
                            <Label htmlFor="location-no" className="text-gray-600 font-medium">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.location && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.location}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label htmlFor="socialMediaPages" className="text-sm font-semibold text-gray-700">
                          Share your social media pages *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="socialMediaPages"
                            value={formData.socialMediaPages || ""}
                            onChange={(e) => updateFormData("socialMediaPages", e.target.value)}
                            placeholder="List your social media handles/pages"
                            rows={3}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.socialMediaPages ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.socialMediaPages && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.socialMediaPages}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* IT Tutor Questions */}
                  {formData.role === "it-tutor" && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="itExpertise" className="text-sm font-semibold text-gray-700">
                          Areas of expertise in IT *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="itExpertise"
                            value={formData.itExpertise || ""}
                            onChange={(e) => updateFormData("itExpertise", e.target.value)}
                            placeholder="e.g., Web Development, Data Analysis, Cybersecurity"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.itExpertise ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.itExpertise && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.itExpertise}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="teachingExperience" className="text-sm font-semibold text-gray-700">
                          Describe teaching/tutoring experience *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="teachingExperience"
                            value={formData.teachingExperience || ""}
                            onChange={(e) => updateFormData("teachingExperience", e.target.value)}
                            placeholder="Describe your teaching background and experience"
                            rows={4}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.teachingExperience ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.teachingExperience && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.teachingExperience}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="complexConcepts" className="text-sm font-semibold text-gray-700">
                          How do you explain a complex concept to beginners? *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="complexConcepts"
                            value={formData.complexConcepts || ""}
                            onChange={(e) => updateFormData("complexConcepts", e.target.value)}
                            placeholder="Describe your teaching methodology"
                            rows={4}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.complexConcepts ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.complexConcepts && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.complexConcepts}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="lmsPlatforms" className="text-sm font-semibold text-gray-700">
                          LMS or teaching platforms you know *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="lmsPlatforms"
                            value={formData.lmsPlatforms || ""}
                            onChange={(e) => updateFormData("lmsPlatforms", e.target.value)}
                            placeholder="e.g., Moodle, Canvas, Blackboard"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.lmsPlatforms ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.lmsPlatforms && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.lmsPlatforms}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="itPortfolio" className="text-sm font-semibold text-gray-700">
                          Portfolio link to materials/tutorials/projects *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="itPortfolio"
                            type="url"
                            value={formData.itPortfolio || ""}
                            onChange={(e) => updateFormData("itPortfolio", e.target.value)}
                            placeholder="https://..."
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.itPortfolio ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.itPortfolio && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.itPortfolio}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Curriculum Designer Questions */}
                  {formData.role === "curriculum-designer" && (
                    <div className="space-y-6">
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="curriculumExperience" className="text-sm font-semibold text-gray-700">
                          Experience in curriculum/instructional design *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="curriculumExperience"
                            value={formData.curriculumExperience || ""}
                            onChange={(e) => updateFormData("curriculumExperience", e.target.value)}
                            placeholder="Describe your curriculum design experience"
                            rows={4}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.curriculumExperience ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.curriculumExperience && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.curriculumExperience}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="needsAnalysis" className="text-sm font-semibold text-gray-700">
                          Process for conducting needs analysis *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="needsAnalysis"
                            value={formData.needsAnalysis || ""}
                            onChange={(e) => updateFormData("needsAnalysis", e.target.value)}
                            placeholder="Describe your approach to needs analysis"
                            rows={4}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.needsAnalysis ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.needsAnalysis && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.needsAnalysis}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="curriculumPortfolio" className="text-sm font-semibold text-gray-700">
                          Portfolio link *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="curriculumPortfolio"
                            type="url"
                            value={formData.curriculumPortfolio || ""}
                            onChange={(e) => updateFormData("curriculumPortfolio", e.target.value)}
                            placeholder="https://..."
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.curriculumPortfolio ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.curriculumPortfolio && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.curriculumPortfolio}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="toolsProficiency" className="text-sm font-semibold text-gray-700">
                          Tools/software proficiency *
                        </Label>
                        <div className="modern-input">
                          <Input
                            id="toolsProficiency"
                            value={formData.toolsProficiency || ""}
                            onChange={(e) => updateFormData("toolsProficiency", e.target.value)}
                            placeholder="e.g., Articulate Storyline, Adobe Captivate"
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.toolsProficiency ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.toolsProficiency && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.toolsProficiency}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="curriculumEvaluation" className="text-sm font-semibold text-gray-700">
                          How do you evaluate effectiveness of curriculum? *
                        </Label>
                        <div className="modern-input">
                          <Textarea
                            id="curriculumEvaluation"
                            value={formData.curriculumEvaluation || ""}
                            onChange={(e) => updateFormData("curriculumEvaluation", e.target.value)}
                            placeholder="Describe your evaluation methods"
                            rows={4}
                            className={`border-0 bg-transparent text-lg font-medium placeholder:text-gray-400 focus:ring-0 ${
                              errors.curriculumEvaluation ? "text-red-600" : ""
                            }`}
                          />
                        </div>
                        {errors.curriculumEvaluation && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-red-500 font-medium"
                          >
                            {errors.curriculumEvaluation}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: File Uploads */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                  >
                    Upload Documents
                  </motion.h3>

                  <div className="space-y-6">
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="coverLetter" className="text-sm font-semibold text-gray-700">
                        Cover Letter *
                      </Label>
                      <div
                        className={`upload-area p-8 text-center ${formData.coverLetter ? "has-file" : ""} ${errors.coverLetter ? "border-red-500" : ""}`}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Upload className="mx-auto h-12 w-12 text-[#34d392] mb-4" />
                          <div className="space-y-3">
                            <p className="text-lg font-medium text-gray-700">
                              {formData.coverLetter ? formData.coverLetter.name : "Click to upload or drag and drop"}
                            </p>
                            <input
                              id="coverLetter"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileUpload("coverLetter", e.target.files?.[0] || null)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              onClick={() => document.getElementById("coverLetter")?.click()}
                              className="modern-button modern-button-primary px-6 py-3 text-lg font-semibold"
                            >
                              Choose File
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                      {errors.coverLetter && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm text-red-500 font-medium"
                        >
                          {errors.coverLetter}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="resume" className="text-sm font-semibold text-gray-700">
                        CV / Resume *
                      </Label>
                      <div
                        className={`upload-area p-8 text-center ${formData.resume ? "has-file" : ""} ${errors.resume ? "border-red-500" : ""}`}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Upload className="mx-auto h-12 w-12 text-[#34d392] mb-4" />
                          <div className="space-y-3">
                            <p className="text-lg font-medium text-gray-700">
                              {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                            </p>
                            <input
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              onClick={() => document.getElementById("resume")?.click()}
                              className="modern-button modern-button-primary px-6 py-3 text-lg font-semibold"
                            >
                              Choose File
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                      {errors.resume && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm text-red-500 font-medium"
                        >
                          {errors.resume}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                  >
                    Review Your Application
                  </motion.h3>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-lg text-gray-800">Personal Information</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-gray-700 space-y-2">
                        <p className="text-base">
                          <strong>Name:</strong> {formData.fullName}
                        </p>
                        <p className="text-base">
                          <strong>Email:</strong> {formData.email}
                        </p>
                        <p className="text-base">
                          <strong>Phone:</strong> {formData.phone}
                        </p>
                      </div>
                    </motion.div>

                    {/* Role Selection */}
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-lg text-gray-800">Position</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(2)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-gray-700">
                        <p className="text-base">
                          <strong>Role:</strong> {roles.find((r) => r.value === formData.role)?.label}
                        </p>
                      </div>
                    </motion.div>

                    {/* Role-Specific Answers */}
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-lg text-gray-800">Role-Specific Questions</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(3)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-gray-700 space-y-3">
                        {formData.role === "social-media-manager" && (
                          <>
                            <p className="text-base">
                              <strong>Experience:</strong> {formData.socialMediaExperience}
                            </p>
                            {formData.portfolioLink && (
                              <p className="text-base">
                                <strong>Portfolio:</strong> {formData.portfolioLink}
                              </p>
                            )}
                            {formData.socialMediaTools && (
                              <p className="text-base">
                                <strong>Tools:</strong> {formData.socialMediaTools}
                              </p>
                            )}
                            <p className="text-base">
                              <strong>Content Creation:</strong> {formData.contentCreation}
                            </p>
                            {formData.emailMarketing && (
                              <p className="text-base">
                                <strong>Email Marketing:</strong> {formData.emailMarketing}
                              </p>
                            )}
                            <p className="text-base">
                              <strong>Location:</strong> {formData.location}
                            </p>
                            {formData.socialMediaPages && (
                              <p className="text-base">
                                <strong>Social Pages:</strong> {formData.socialMediaPages}
                              </p>
                            )}
                          </>
                        )}
                        {formData.role === "it-tutor" && (
                          <>
                            <p className="text-base">
                              <strong>IT Expertise:</strong> {formData.itExpertise}
                            </p>
                            <p className="text-base">
                              <strong>Teaching Experience:</strong> {formData.teachingExperience}
                            </p>
                            <p className="text-base">
                              <strong>Teaching Method:</strong> {formData.complexConcepts}
                            </p>
                            {formData.lmsPlatforms && (
                              <p className="text-base">
                                <strong>LMS Platforms:</strong> {formData.lmsPlatforms}
                              </p>
                            )}
                            {formData.itPortfolio && (
                              <p className="text-base">
                                <strong>Portfolio:</strong> {formData.itPortfolio}
                              </p>
                            )}
                          </>
                        )}
                        {formData.role === "curriculum-designer" && (
                          <>
                            <p className="text-base">
                              <strong>Curriculum Experience:</strong> {formData.curriculumExperience}
                            </p>
                            <p className="text-base">
                              <strong>Needs Analysis:</strong> {formData.needsAnalysis}
                            </p>
                            <p className="text-base">
                              <strong>Evaluation Method:</strong> {formData.curriculumEvaluation}
                            </p>
                            {formData.curriculumPortfolio && (
                              <p className="text-base">
                                <strong>Portfolio:</strong> {formData.curriculumPortfolio}
                              </p>
                            )}
                            {formData.toolsProficiency && (
                              <p className="text-base">
                                <strong>Tools:</strong> {formData.toolsProficiency}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Documents */}
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-lg text-gray-800">Documents</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(4)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-gray-700 space-y-2">
                        <p className="text-base">
                          <strong>Cover Letter:</strong> {formData.coverLetter?.name || "Not uploaded"}
                        </p>
                        <p className="text-base">
                          <strong>CV/Resume:</strong> {formData.resume?.name || "Not uploaded"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="modern-button flex items-center gap-3 px-6 py-3 text-lg font-semibold border-2 border-gray-200 hover:border-[#34d392] hover:text-[#34d392] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="modern-button modern-button-primary flex items-center gap-3 px-8 py-3 text-lg font-semibold"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="modern-button modern-button-primary flex items-center gap-3 px-8 py-3 text-lg font-semibold disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
