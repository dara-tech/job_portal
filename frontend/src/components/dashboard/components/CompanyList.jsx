import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Building, Search } from "lucide-react";

export function CompanyList({ companies, applicants, allAdminJobs, isLoading, searchTerm, setSearchTerm }) {
  return (
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
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-32"
            >
              <p className="text-gray-500 dark:text-gray-400">Loading companies...</p>
            </motion.div>
          ) : companies.length > 0 ? (
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
                  {companies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="text-right">
                        {applicants.filter((applicant) =>
                          allAdminJobs.find(
                            (job) => job._id === applicant.job && job.company?._id === company._id
                          )
                        ).length}
                      </TableCell>
                      <TableCell className="text-right">
                        {allAdminJobs.filter((job) => job.company?._id === company._id).length}
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
  );
}