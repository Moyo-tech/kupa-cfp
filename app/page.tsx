import JobApplicationForm from "@/components/job-application-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Our Team</h1>
          <p className="text-slate-600">Complete your application in just a few steps</p>
        </div>
        <JobApplicationForm />
      </div>
    </div>
  )
}
