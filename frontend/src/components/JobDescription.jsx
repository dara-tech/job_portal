import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Check, MapPin, Briefcase, DollarSign, Users, Clock, ArrowLeft, Building } from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "./shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant"
import { setSingleJob } from "@/redux/jobSlice"

const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime())

const JobDescription = () => {
  const dispatch = useDispatch()
  const { id: jobId } = useParams()
  const { user } = useSelector((store) => store.auth)
  const job = useSelector((store) => store.job.singleJob)
  const [loading, setLoading] = useState(true)
  const [isApplied, setIsApplied] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job))
          setIsApplied(res.data.job.applications.some((app) => app.applicant === user?._id))
        } else {
          toast.error("Failed to fetch job details")
        }
      } catch (error) {
        toast.error("Error fetching job details")
      } finally {
        setLoading(false)
      }
    }
    fetchSingleJob()
  }, [jobId, dispatch, user?._id])

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("You need to be signed in to apply for this job")
      return
    }
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setSingleJob({ ...job, applications: [...job.applications, { applicant: user?._id }] }))
        setIsApplied(true)
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for the job")
    }
  }

  const postedDate = isValidDate(new Date(job?.postedDate))
    ? formatDistanceToNow(new Date(job?.postedDate), { addSuffix: true })
    : "Unknown date"

  const expiresIn = isValidDate(new Date(job?.expire))
    ? formatDistanceToNow(new Date(job?.expire), { addSuffix: true })
    : "N/A"

  const handleLogoError = () => {
    setLogoError(true)
  }

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* <Navbar /> */}
        <div className="max-w-4xl mx-auto p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="relative  rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
                    {!logoError && job?.company?.logo ? (
                      <img
                        src={job.company.logo}
                        alt={`${job.company.name} logo`}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={handleLogoError}
                      />
                    ) : (
                      <Building className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{job?.title || "No Job Title"}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{job?.company?.name || "Unknown Company"} • Posted {postedDate}</p>
                  </div>
                </div>
                <Button
                  onClick={!isApplied ? applyJobHandler : null}
                  disabled={isApplied || !user}
                  className="w-full md:w-auto"
                >
                  {isApplied ? (
                    <>
                      Applied <Check className="ml-2 h-4 w-4" />
                    </>
                  ) : user ? (
                    "Apply now"
                  ) : (
                    "Sign in to apply"
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="flex items-center">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {job?.jobType || "NA"}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {job?.experienceLevel || "NA"}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {job?.location || "NA"}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {job?.salary || "12k+"}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Expires {expiresIn}
                </Badge>
              </div>
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Job Description</h2>
                  <div
                    className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: job?.description || "Description not available" }}
                  />
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Requirements</h2>
                  {job?.requirements && job.requirements.length > 0 ? (
                    <div
                      className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.requirements.join('') }}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No requirements specified.</p>
                  )}
                </section>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Applications: {job?.applications?.length || "0"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default JobDescription