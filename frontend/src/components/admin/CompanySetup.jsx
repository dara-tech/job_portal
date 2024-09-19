'use client'

import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Building, Earth, LocateIcon, NotepadText, Save, Upload, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { COMPANY_API_END_POINT } from "@/utils/constant"
import useGetCompanyById from "@/hooks/useGetCompanyById"
import Navbar from "../shared/Navbar"

const defaultLogoUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png"

export default function CompanySetup() {
  const params = useParams()
  useGetCompanyById(params.id)

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  })
  const { singleCompany } = useSelector((store) => store.company)

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setInput({ ...input, file })
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProgress(0)
    const formData = new FormData()
    formData.append("name", input.name)
    formData.append("description", input.description)
    formData.append("website", input.website)
    formData.append("location", input.location)

    if (input.file instanceof File) {
      formData.append("file", input.file)
    }

    try {
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentCompleted)
          },
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/admin/companies")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.logo || null,
      })
    }
  }, [singleCompany])

  useEffect(() => {
    return () => {
      if (input.file instanceof File) {
        URL.revokeObjectURL(input.file)
      }
    }
  }, [input.file])

  const isFormComplete = input.name && input.description && input.website && input.location

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-4xl mx-auto backdrop-blur-lg bg-white/80 dark:bg-slate-950 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to previous page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Company Setup
                </CardTitle>
              </div>
              <CardDescription className="text-center mt-2">
                Update your company information and branding to stand out in the market.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Label htmlFor="logo" className="cursor-pointer group relative">
                    <Avatar className="w-32 h-32 border-4 border-purple-400 dark:border-purple-600 transition-all duration-300 group-hover:border-pink-400 dark:group-hover:border-pink-600">
                      <AvatarImage src={input.file instanceof File ? URL.createObjectURL(input.file) : input.file || defaultLogoUrl} alt="Company Logo" />
                      <AvatarFallback>{input.name?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <motion.div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </motion.div>
                  </Label>
                  <Input id="logo" type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('logo').click()}>
                    Change Logo
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                        className="pl-10 dark:ring-1 dark:ring-gray-700  "
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Earth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="website"
                        name="website"
                        value={input.website}
                        onChange={changeEventHandler}
                        className="pl-10 dark:ring-1 dark:ring-gray-700  "
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <LocateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                        className="pl-10 dark:ring-1 dark:ring-gray-700  "
                        placeholder="Enter company location"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <div className="relative">

                      <Textarea
                        id="description"
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                        className="min-h-[100px] dark:ring-1 dark:ring-gray-700  "
                        placeholder="Enter company description"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {isFormComplete ? 'All fields completed' : 'Please fill all fields'}
                </span>
                <AnimatePresence>
                  {isFormComplete && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-green-500"
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button 
                type="submit" 
                onClick={submitHandler} 
                disabled={loading || !isFormComplete} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              {loading && (
                <Progress value={progress} className="w-full" />
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}