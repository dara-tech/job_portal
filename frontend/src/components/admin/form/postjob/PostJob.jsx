'use client'

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/shared/Navbar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Briefcase, Clock, Home, Laptop, User, DollarSign, Calendar, MapPin, Wand2, Loader2, Brain } from "lucide-react"
import { JOB_API_END_POINT } from "@/utils/constant"
import AIAssistant from '@/components/admin/AIAssistant'

export default function PostJob() {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    title: "",
    salary: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
    location: "",
    expire: "",
    description: "",
    requirements: ""
  })
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { companies } = useSelector((store) => store.company)

  const jobTypes = [
    { label: "Full-time", icon: <Briefcase className="w-4 h-4" />, value: "full-time" },
    { label: "Part-time", icon: <Clock className="w-4 h-4" />, value: "part-time" },
    { label: "Remote", icon: <Home className="w-4 h-4" />, value: "remote" },
    { label: "Freelance", icon: <Laptop className="w-4 h-4" />, value: "freelance" },
  ]

  const experienceOptions = [
    { label: "No Experience", icon: <User className="w-4 h-4" />, value: "noexperience" },
    { label: "Fresher", icon: <User className="w-4 h-4" />, value: "fresher" },
    { label: "Junior", icon: <User className="w-4 h-4" />, value: "junior" },
    { label: "Senior", icon: <User className="w-4 h-4" />, value: "senior" },
  ]

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company._id === value)
    setInput({ ...input, companyId: selectedCompany ? selectedCompany._id : "" })
  }

  const selectJobType = (type) => {
    setInput({ ...input, jobType: type })
  }

  const selectExperience = (value) => {
    setInput({ ...input, experience: value })
  }

  const handleAIContentUpdate = (content) => {
    setInput(prev => ({ ...prev, ...content }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return input.title && input.companyId && input.location
      case 1:
        return input.jobType && input.experience && input.position && input.expire
      case 2:
        return input.description && input.requirements
      default:
        return false
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!validateStep(2)) {
      return toast.error("Please fill out all required fields.")
    }

    try {
      setLoading(true)
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/admin/jobs")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "An error occurred while posting the job.")
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill out all required fields before proceeding.")
      return
    }
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
  }

  const handlePrevious = () =>  setCurrentStep(prev => Math.max(0, prev - 1))

  const steps = [
    { title: "Basic Info", icon: <Briefcase className="w-5 h-5" /> },
    { title: "Job Details", icon: <DollarSign className="w-5 h-5" /> },
    { title: "AI Assistant", icon: <Brain className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Create a New Job Listing</CardTitle>
            <CardDescription>Use our AI-powered form to quickly create a compelling job post</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    <div className={`rounded-full p-2 ${
                      index <= currentStep ? "bg-primary text-white dark:bg-teal-700 " : "bg-gray-200 "
                    }`}>
                      {step.icon}
                    </div>
                    <span className="mt-2 text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={input.title}
                          onChange={changeEventHandler}
                          placeholder="e.g. Senior React Developer"
                          className="text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Select onValueChange={selectChangeHandler} value={input.companyId} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {companies.map((company) => (
                                <SelectItem key={company._id} value={company._id}>
                                  <div className="flex items-center gap-2">
                                    <img src={company.logo} alt={company.name} className="w-6 h-6 rounded-full" />
                                    <span>{company.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="location"
                            name="location"
                            value={input.location}
                            onChange={changeEventHandler}
                            className="pl-10 text-sm"
                            placeholder="e.g. New York, NY or Remote"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Job Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {jobTypes.map((type) => (
                            <Button
                              key={type.value}
                              type="button"
                              variant={input.jobType === type.value ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => selectJobType(type.value)}
                            >
                              {type.icon}
                              <span>{type.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Experience Level</Label>
                        <div className="flex flex-wrap gap-2">
                          {experienceOptions.map((exp) => (
                            <Button
                              key={exp.value}
                              type="button"
                              variant={input.experience === exp.value ? "default" : "outline"}
                              className="flex items-center gap-2"
                              onClick={() => selectExperience(exp.value)}
                            >
                              {exp.icon}
                              <span>{exp.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="position">Number of Positions</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="position"
                              name="position"
                              type="number"
                              value={input.position}
                              onChange={changeEventHandler}
                              className="pl-10 text-sm"
                              placeholder="e.g. 2"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary">Salary Range (optional)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="salary"
                              name="salary"
                              value={input.salary}
                              onChange={changeEventHandler}
                              className="pl-10 text-sm"
                              placeholder="e.g. $80,000 - $120,000"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expire">Application Deadline</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="expire"
                            name="expire"
                            type="date"
                            value={input.expire}
                            onChange={changeEventHandler}
                            className="pl-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <AIAssistant
                      jobData={input}
                      onUpdate={handleAIContentUpdate}
                      initialContent={{ description: input.description, requirements: input.requirements }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="w-32" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Post Job
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}