import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("All Admin Jobs:", allAdminJobs);
    console.log("Search Text:", searchJobByText);

    const filteredJobs = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    }) || [];

    console.log("Filtered Jobs:", filteredJobs);
    setFilterJobs(filteredJobs);

    // Log each company's logo URL for debugging
    allAdminJobs?.forEach((job) => {
      console.log(`Company Name: ${job?.company?.name}`);
      console.log(`Company Logo URL: ${job?.company?.logo}`); // Assuming job.company.logo contains the URL
    });
  }, [allAdminJobs, searchJobByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.length > 0 ? (
            filterJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={job?.company?.logo || "default_logo_url"} // Fallback URL
                      alt={`${job?.company?.name} logo`}
                      className="object-cover h-full w-full"
                    />
                  </Avatar>
                </TableCell>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>
                  {job?.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32 text-sm text-muted-foreground mr-4 ">
                      <div
                        onClick={() => navigate(`/admin/job/update/${job._id}`)}
                        className="flex items-center gap-2 w-full hover:bg-gray-200 dark:hover:text-black px-1 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center px-1 gap-1 w-full hover:bg-gray-200 dark:hover:text-black rounded cursor-pointer mt-2"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
