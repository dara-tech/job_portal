import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Clipboard, Download, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ApplicantsList({
  companiesWithApplicants,
  filteredApplicants,
  allAdminJobs,
  isLoadingApplicants,
  handleStatusChange,
  copyEmail,
  downloadResume,
  handleViewProfile
}) {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const navigate = useNavigate();

  const handleViewUser = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
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
              <p className="text-gray-500 dark:text-gray-400">
                Loading applicants...
              </p>
            </motion.div>
          ) : filteredApplicants && filteredApplicants.length > 0 ? (
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
                    const job = allAdminJobs.find(
                      (job) => job._id === applicant.job
                    );
                    return (
                      <TableRow key={applicant._id}>
                        <TableCell className="font-medium">
                          <Link to={`/admin/user/${applicant.applicant._id}`} className="hover:underline">
                            {applicant.applicant.fullname}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {applicant.applicant.email}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              copyEmail(applicant.applicant.email)
                            }
                            className="ml-2"
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {applicant.applicant.phoneNumber}
                        </TableCell>
                        <TableCell>
                          {job?.company?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{job?.title || "Unknown"}</TableCell>
                        <TableCell>
                          {applicant.applicant.profile?.skills?.map(skill => skill.name).join(", ") || "N/A"}
                        </TableCell>
                        <TableCell>
                          {applicant.applicant.profile?.experience?.[0] || "N/A"} years
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              applicant.status === "accepted"
                                ? "success"
                                : applicant.status === "rejected"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {applicant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleViewUser(applicant.applicant._id)}
                              >
                                <User className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(
                                  applicant._id,
                                  "accepted"
                                )}
                                disabled={applicant.status === "accepted"}
                              >
                                Accept
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(
                                  applicant._id,
                                  "rejected"
                                )}
                                disabled={applicant.status === "rejected"}
                              >
                                Reject
                              </DropdownMenuItem>
                              {applicant.applicant.profile?.resume && (
                                <DropdownMenuItem
                                  onClick={() => downloadResume(
                                    applicant.applicant.profile.resume,
                                    applicant.applicant.fullname
                                  )}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Resume
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
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
              <p className="text-gray-500 dark:text-gray-400">
                No applicants found.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}