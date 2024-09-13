import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="mb-4 ">
        <h1 className="font-bold text-muted-foreground mb-2">Applied Jobs</h1>
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className="mb-4  ring-gray-500 dark:ring-gray-700 rounded-md  mt-2 ">
      <h1 className=" bg-blue-800 text-white font-bold text-muted-foreground  rounded-t-md px-2 py-2 mt-4 ">
        Applied Jobs
      </h1>
      <Table>
        <TableCaption>A list of your applications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date Applied</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.map((appliedJob) => {
            const applicationDate = new Date(
              appliedJob.createdAt
            ).toLocaleDateString();
            const jobTitle = appliedJob.job?.title || "N/A";
            const companyName = appliedJob.job?.company?.name || "N/A";
            const status = appliedJob.status || "N/A";

            return (
              <TableRow key={appliedJob._id}>
                <TableCell>{applicationDate}</TableCell>
                <TableCell>{jobTitle}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {appliedJob.job?.company?.logo && (
                      <img
                        src={appliedJob.job.company.logo}
                        alt={`${appliedJob.job.company.name} logo`}
                        className="w-8 h-8 mr-2 rounded-full"
                      />
                    )}
                    {companyName}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`
      ${status === "pending" ? "bg-gray-500" : ""}
      ${status === "rejected" ? "bg-red-500 dark:bg-red-500 dark:text-white": ""}
      ${status === "accepted" ? "bg-green-500 dark:bg-teal-800 dark:text-white" : ""}
      text-white
    `}
                  >
                    {status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
