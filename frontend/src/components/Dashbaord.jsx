import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './shared/Navbar'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, Building, Briefcase, TrendingUp, Clipboard, Download } from 'lucide-react'
import { setAllApplicants } from '@/redux/applicationSlice'
import { setAllAdminJobs } from '@/redux/jobSlice'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import AdminJobsTable from '../components/admin/AdminJobsTable'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { loading: companiesLoading, error: companiesError } = useGetAllCompanies()
  useGetAppliedJobs()

  const companies = useSelector((state) => state.company.companies) || []
  const appliedJobs = useSelector((state) => state.job.appliedJobs) || []
  const applicants = useSelector(store => store.application.applicants) || []
  const { allAdminJobs } = useSelector(store => store.job)

  const [selectedCompany, setSelectedCompany] = useState('all')
  const [jobDetails, setJobDetails] = useState({})
  const [companiesWithApplicants, setCompaniesWithApplicants] = useState([])
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true)

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoadingApplicants(true)
      try {
        const response = await axios.get(`${APPLICATION_API_END_POINT}/applicants`, { withCredentials: true })
        if (response.data.success) {
          dispatch(setAllApplicants(response.data.applicants))
        } else {
          console.error('Failed to fetch applicants:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching applicants:', error)
      } finally {
        setIsLoadingApplicants(false)
      }
    }
    fetchApplicants()
  }, [dispatch])

  useEffect(() => {
    const fetchAdminJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true })
        if (response.data.success) {
          dispatch(setAllAdminJobs(response.data.jobs))
          const jobMap = response.data.jobs.reduce((acc, job) => {
            acc[job._id] = { title: job.title, company: job.company.name }
            return acc
          }, {})
          setJobDetails(jobMap)
        }
      } catch (error) {
        console.error('Error fetching admin jobs:', error)
      }
    }
    fetchAdminJobs()
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(applicants) && applicants.length > 0) {
      const companiesWithApps = new Set(
        applicants
          .map(applicant => getJobDetails(applicant.job).company)
          .filter(company => company)
      )
      setCompaniesWithApplicants(Array.from(companiesWithApps))
      
      if (companiesWithApps.size > 0 && !companiesWithApps.has(selectedCompany)) {
        setSelectedCompany(Array.from(companiesWithApps)[0])
      }

      const filtered = selectedCompany === 'all' 
        ? applicants.filter(applicant => getJobDetails(applicant.job).company)
        : applicants.filter(applicant => {
            const job = getJobDetails(applicant.job)
            return job.company === selectedCompany
          })
      setFilteredApplicants(filtered)
    } else {
      setCompaniesWithApplicants([])
      setFilteredApplicants([])
    }
  }, [applicants, jobDetails, selectedCompany])

  const companyData = (companies.slice(0, 6) || []).map(company => ({
    name: company.name,
    employees: company.employeeCount || 0,
    jobs: company.jobCount || 0
  }))

  const jobData = (allAdminJobs.slice(0, 6) || []).map(job => ({
    name: job.title,
    applications: job.applicationsCount || 0,
    company: job.company?.name
  }))

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

  const getJobDetails = (jobId) => {
    return jobDetails[jobId] || { title: '', company: '' }
  }

  if (companiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-2xl font-semibold text-gray-800 dark:text-white">Loading...</div>
      </div>
    )
  }

  if (companiesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-2xl font-semibold text-red-600 dark:text-red-400">{companiesError}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredApplicants.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allAdminJobs.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appliedJobs.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No company data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Applications Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {jobData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#8884d8" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No job data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company List</CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Company Name</th>
                      <th scope="col" className="px-6 py-3">Employees</th>
                      <th scope="col" className="px-6 py-3">Jobs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {company.name}
                        </td>
                        <td className="px-6 py-4">{company.employeeCount || 0}</td>
                        <td className="px-6 py-4">{company.jobCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No companies available</p>
            )}
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
            {isLoadingApplicants ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading applicants...</p>
              </div>
            ) : filteredApplicants.length > 0 ? (
              <div className="overflow-x-auto">
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
                      const job = getJobDetails(applicant.job)
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
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.title}</TableCell>
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
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <p>No applicants found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard