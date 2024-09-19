
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { COMPANY_API_END_POINT, APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setCompanies } from '@/redux/companySlice'
import { setAllApplicants } from '@/redux/applicationSlice'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Building, Briefcase, TrendingUp, Clipboard, Download, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Navbar from './shared/Navbar'
import AdminJobsTable from '../components/admin/AdminJobsTable'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
  const dispatch = useDispatch()
  const companies = useSelector((state) => state.company.companies) || []
  const appliedJobs = useSelector((state) => state.job.appliedJobs) || []
  const applicants = useSelector(store => store.application.applicants) || []
  const allAdminJobs = useSelector(store => store.job.allAdminJobs) || []

  const [selectedCompany, setSelectedCompany] = useState('all')
  const [companiesWithApplicants, setCompaniesWithApplicants] = useState([])
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true)
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCompanies, setFilteredCompanies] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCompanies(true)
      setIsLoadingApplicants(true)
      try {
        const [companiesRes, applicantsRes, jobsRes] = await Promise.all([
          axios.get(`${COMPANY_API_END_POINT}/all`, { withCredentials: true }),
          axios.get(`${APPLICATION_API_END_POINT}/applicants`, { withCredentials: true }),
          axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true })
        ])

        if (companiesRes.data.success) {
          dispatch(setCompanies(companiesRes.data.companies))
          setFilteredCompanies(companiesRes.data.companies)
        }
        if (applicantsRes.data.success) {
          dispatch(setAllApplicants(applicantsRes.data.applicants))
        }
        if (jobsRes.data.success) {
          dispatch(setAllAdminJobs(jobsRes.data.jobs))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingCompanies(false)
        setIsLoadingApplicants(false)
      }
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(allAdminJobs) && allAdminJobs.length > 0) {
      const companiesWithApps = new Set(
        allAdminJobs
          .map(job => job.company?.name)
          .filter(Boolean)
      )
      setCompaniesWithApplicants(Array.from(companiesWithApps))
      
      if (companiesWithApps.size > 0 && !companiesWithApps.has(selectedCompany)) {
        setSelectedCompany(Array.from(companiesWithApps)[0])
      }

      const filtered = selectedCompany === 'all' 
        ? applicants
        : applicants.filter(applicant => {
            const job = allAdminJobs.find(job => job._id === applicant.job)
            return job && job.company?.name === selectedCompany
          })
      setFilteredApplicants(filtered)
    } else {
      setCompaniesWithApplicants([])
      setFilteredApplicants([])
    }
  }, [applicants, allAdminJobs, selectedCompany])

  useEffect(() => {
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCompanies(filtered)
  }, [companies, searchTerm])

  const companyData = useMemo(() => {
    return (companies.slice(0, 6) || []).map(company => ({
      name: company.name,
      employees: company.employeeCount || 0,
      jobs: allAdminJobs.filter(job => job.company?._id === company._id).length,
      applicants: applicants.filter(applicant => 
        allAdminJobs.find(job => job._id === applicant.job && job.company?._id === company._id)
      ).length
    }))
  }, [companies, allAdminJobs, applicants])

  const jobData = useMemo(() => {
    return (allAdminJobs.slice(0, 6) || []).map(job => ({
      name: job.title,
      applications: job.applications?.length || 0,
      company: job.company?.name || 'Unknown'
    }))
  }, [allAdminJobs])

  const applicationStatusData = useMemo(() => {
    const statusCounts = applicants.reduce((acc, applicant) => {
      acc[applicant.status] = (acc[applicant.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }))
  }, [applicants])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const response = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status: newStatus },
        { withCredentials: true }
      )
      if (response.data.success) {
        const updatedApplicants = applicants.map(applicant => 
          applicant._id === applicantId ? { ...applicant, status: newStatus } : applicant
        )
        dispatch(setAllApplicants(updatedApplicants))
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email)
    // You might want to add some visual feedback here
  }

  const downloadResume = (resumeUrl, applicantName) => {
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = `${applicantName.replace(' ', '_')}_resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
              {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-4xl font-bold text-gray-800 dark:text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Companies" value={companies.length} icon={Building} trend={5.2} />
          <StatCard title="Total Applicants" value={applicants.length} icon={Users} trend={-2.5} />
          <StatCard title="Total Jobs" value={allAdminJobs.length} icon={Briefcase} trend={8.1} />
          <StatCard title="Applied Jobs" value={appliedJobs.length} icon={TrendingUp} trend={3.7} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {companyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" fill="#8884d8" name="Employees" />
                    <Bar dataKey="jobs" fill="#82ca9d" name="Jobs" />
                    <Bar dataKey="applicants" fill="#ffc658" name="Applicants" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No company data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {applicationStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No application status data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-6 w-6" />
              <span>Company List</span>
            </CardTitle>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {isLoadingCompanies ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-32"
                >
                  <p className="text-gray-500 dark:text-gray-400">Loading companies...</p>
                </motion.div>
              ) : filteredCompanies.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Company Name</TableHead>
                        <TableHead className="text-right">Applicants</TableHead>
                        <TableHead className="text-right">Jobs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => (
                        <TableRow key={company._id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell className="text-right">
                            {applicants.filter(applicant => 
                              allAdminJobs.find(job => job._id === applicant.job && job.company?._id === company._id)
                            ).length}
                          </TableCell>
                          <TableCell className="text-right">
                            {allAdminJobs.filter(job => job.company?._id === company._id).length}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-32"
                >
                  <p className="text-gray-500 dark:text-gray-400">No companies found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminJobsTable />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applicants</CardTitle>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companiesWithApplicants.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {isLoadingApplicants ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-32"
                >
                  <p className="text-gray-500 dark:text-gray-400">Loading applicants...</p>
                </motion.div>
              ) : filteredApplicants.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Job</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplicants.map((applicant) => {
                        const job = allAdminJobs.find(job => job._id === applicant.job)
                        return (
                          <TableRow key={applicant._id}>
                            <TableCell className="font-medium">{applicant.applicant.fullname}</TableCell>
                            <TableCell>
                              {applicant.applicant.email}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyEmail(applicant.applicant.email)}
                                className="ml-2"
                              >
                                <Clipboard className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell>{applicant.applicant.phoneNumber}</TableCell>
                            <TableCell>{job?.company?.name || 'Unknown'}</TableCell>
                            <TableCell>{job?.title || 'Unknown'}</TableCell>
                            <TableCell>{applicant.applicant.profile.skills.join(', ')}</TableCell>
                            <TableCell>{applicant.applicant.profile.experience[0]} years</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  applicant.status === 'accepted'
                                    ? 'success'
                                    : applicant.status === 'rejected'
                                    ? 'destructive'
                                    : 'default'
                                }
                              >
                                {applicant.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(applicant._id, 'accepted')}
                                  disabled={applicant.status === 'accepted'}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(applicant._id, 'rejected')}
                                  disabled={applicant.status === 'rejected'}
                                >
                                  Reject
                                </Button>
                                {applicant.applicant.profile.resume && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => downloadResume(applicant.applicant.profile.resume, applicant.applicant.fullname)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-32"
                >
                  <p className="text-gray-500 dark:text-gray-400">No applicants found.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard