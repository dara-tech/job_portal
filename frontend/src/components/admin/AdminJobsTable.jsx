import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { setAuthToken } from "@/redux/authSlice";

const AdminJobsTable = () => {
  const dispatch = useDispatch();
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const { authToken } = useSelector((store) => store.auth);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    }) || [];
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const handleDelete = async (jobId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this job? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`https://job-portal-qpq4.onrender.com/api/v1/job/delete/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setFilterJobs(filterJobs.filter(job => job._id !== jobId));
      } else {
        console.error("Failed to delete job", response.status, response.data);
      }
    } catch (error) {
      console.error("Error deleting job", error.response ? error.response.data : error.message);
    }
  };

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
              <TableRow key={job._id}>
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
                    <PopoverContent className="w-32 text-sm text-muted-foreground mr-4">
                      <div
                        onClick={() => navigate(`/admin/job/update/${job._id}`)}
                        className="flex items-center gap-2 w-full hover:bg-gray-200 dark:hover:text-black px-1 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center px-1 gap-1 w-full hover:bg-gray-200 dark:hover:text-black rounded cursor-pointer mt-2"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                      <div
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center px-1 gap-1 w-full hover:bg-gray-200 dark:hover:text-black rounded cursor-pointer mt-2"
                      >
                        <Trash2 className="w-4" />
                        <span>Delete</span>
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
