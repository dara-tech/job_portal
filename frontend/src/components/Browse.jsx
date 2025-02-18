import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import Navbar from './shared/Navbar'
import Job from './Job'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Briefcase, MapPin, DollarSign, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"

const Browse = () => {
  useGetAllJobs()
  const { allJobs } = useSelector(store => store.job)
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    salary: ''
  })

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""))
    }
  }, [dispatch])

  const filteredJobs = allJobs.filter(job =>
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.jobType ? job.jobType === filters.jobType : true) &&
    (filters.location ? job.location === filters.location : true) &&
    (filters.salary ? job.salary >= parseInt(filters.salary) : true)
  )

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.postedDate) - new Date(a.postedDate)
    } else if (sortBy === 'oldest') {
      return new Date(a.postedDate) - new Date(b.postedDate)
    }
    return 0
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({
      jobType: '',
      location: '',
      salary: ''
    })
    setSearchTerm('')
    setSortBy('newest')
  }

  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(filter => filter !== '')

  return (
    <div className=" bg-gray-50 dark:bg-gray-950">
      {/* <Navbar /> */}
      <main className="px-4 py-8">
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Find Your Dream Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search jobs or companies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                  <SelectTrigger>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                  <SelectTrigger>
                    <MapPin className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.salary} onValueChange={(value) => handleFilterChange('salary', value)}>
                  <SelectTrigger>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Salary Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30000">$30,000+</SelectItem>
                    <SelectItem value="50000">$50,000+</SelectItem>
                    <SelectItem value="80000">$80,000+</SelectItem>
                    <SelectItem value="100000">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex items-center justify-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="text-sm">
                Search: {searchTerm}
              </Badge>
            )}
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <Badge key={key} variant="secondary" className="text-sm">
                  {key}: {value}
                </Badge>
              )
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-gray-500 dark:text-gray-400">{sortedJobs.length} results found</p>
        </div>

        <Separator className="mb-6" />

        <AnimatePresence>
          {sortedJobs.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {sortedJobs.map((job) => (
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-2">No jobs found</p>
                  <p className="text-muted-foreground text-center">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Browse