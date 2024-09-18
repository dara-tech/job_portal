import React, { useState } from "react"
import { useSelector } from "react-redux"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Filter } from "lucide-react"

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applied Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No applications found.</p>
        </CardContent>
      </Card>
    )
  }

  const filteredJobs = allAppliedJobs.filter((job) => {
    const matchesSearch =
      job.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
      case "accepted":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Applied Jobs</CardTitle>
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs or companies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Choose Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>Accepted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your job applications</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date Applied</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((appliedJob) => {
                const applicationDate = new Date(appliedJob.createdAt).toLocaleDateString()
                const jobTitle = appliedJob.job?.title || "N/A"
                const companyName = appliedJob.job?.company?.name || "N/A"
                const status = appliedJob.status || "N/A"

                return (
                  <TableRow key={appliedJob._id}>
                    <TableCell>{applicationDate}</TableCell>
                    <TableCell className="font-medium">{jobTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {appliedJob.job?.company?.logo && (
                          <img
                            src={appliedJob.job.company.logo}
                            alt={`${companyName} logo`}
                            className="w-8 h-8 mr-2 rounded-full object-cover"
                          />
                        )}
                        {companyName !== "N/A" ? companyName : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={`${getStatusColor(status)} text-white`}>
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppliedJobTable