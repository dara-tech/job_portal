import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import Navbar from "./shared/Navbar"
import FilterCard from "./FilterCard"
import Job from "./Job"
import Pagination from "./Pagination"
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const Jobs = () => {
  const dispatch = useDispatch()
  const { allJobs, searchedQuery } = useSelector((store) => store.job)
  const [filteredJobs, setFilteredJobs] = useState([])
  const [visibleJobs, setVisibleJobs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("latest")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const jobsPerPage = 8

  const filterJobs = (jobs, query, sortOrder) => {
    let result = jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      )
    })

    if (sortOrder === "salary") {
      result = result.sort((a, b) => a.salary - b.salary)
    } else if (sortOrder === "salary-desc") {
      result = result.sort((a, b) => b.salary - a.salary)
    } else if (sortOrder === "latest") {
      result = result.sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      )
    }

    return result
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs))
        } else {
          setError("Failed to fetch jobs. Please try again.")
        }
      } catch (error) {
        console.error(error)
        setError("An error occurred while fetching jobs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [dispatch])

  useEffect(() => {
    if (allJobs.length > 0) {
      const result = filterJobs(allJobs, searchedQuery, sortOrder)
      setFilteredJobs(result)
      setCurrentPage(1)
      setVisibleJobs(result.slice(0, jobsPerPage))
    }
  }, [allJobs, searchedQuery, sortOrder])

  useEffect(() => {
    setVisibleJobs(filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage))
  }, [filteredJobs, currentPage])

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg font-medium">Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-8">
        <FilterCard setSortOrder={setSortOrder} />
        <Card className="mt-8">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">
              Job Openings
              <span className="ml-2 text-sm font-medium bg-primary text-primary-foreground px-2 py-1 rounded">
                Latest
              </span>
            </h1>
            {visibleJobs.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {visibleJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No jobs available</p>
            )}
          </CardContent>
        </Card>
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  )
}

export default Jobs