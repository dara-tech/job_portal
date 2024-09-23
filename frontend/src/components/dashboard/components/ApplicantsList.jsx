import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Download } from 'lucide-react';

export function ApplicantsList({
  companiesWithApplicants,
  filteredApplicants,
  allAdminJobs,
  isLoadingApplicants,
  handleStatusChange,
  copyEmail,
  downloadResume
}) {
  const [selectedCompany, setSelectedCompany] = useState('all');

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
                          {applicant.applicant.fullname}
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
                          {applicant.applicant.profile.skills.join(", ")}
                        </TableCell>
                        <TableCell>
                          {applicant.applicant.profile.experience[0]} years
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
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  applicant._id,
                                  "accepted"
                                )
                              }
                              disabled={applicant.status === "accepted"}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  applicant._id,
                                  "rejected"
                                )
                              }
                              disabled={applicant.status === "rejected"}
                            >
                              Reject
                            </Button>
                            {applicant.applicant.profile.resume && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  downloadResume(
                                    applicant.applicant.profile.resume,
                                    applicant.applicant.fullname
                                  )
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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