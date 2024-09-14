import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "./Pagination";
import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const jobsPerPage = 8;

  const filterJobs = (jobs, query, sortOrder) => {
    let result = jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      );
    });

    if (sortOrder === "salary") {
      result = result.sort((a, b) => a.salary - b.salary); // Ascending order
    } else if (sortOrder === "salary-desc") {
      result = result.sort((a, b) => b.salary - a.salary); // Descending order
    } else if (sortOrder === "latest") {
      result = result.sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      );
    }

    return result;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    if (allJobs.length > 0) {
      const result = filterJobs(allJobs, searchedQuery, sortOrder);
      setFilteredJobs(result);
      setCurrentPage(1); // Reset to first page on filter change
      setVisibleJobs(result.slice(0, jobsPerPage)); // Show initial jobs
    }
  }, [allJobs, searchedQuery, sortOrder]);

  useEffect(() => {
    setVisibleJobs(filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage));
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="mt-4 font-light mb-16">
        <FilterCard setSortOrder={setSortOrder} />
        <div className="flex flex-col justify-center items-center mb-2">
          <div className="flex mt-2 mb-4 gap-2 text-center">
            <h1 className="text-1xl font-extrabold text-gray-600 dark:text-gray-200">
              Job Openings
              <span className="text-1xl font-extrabold bg-blue-600 p-1 px-2 rounded-e-lg text-white ml-2">
                Latest
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleJobs.length > 0
              ? visibleJobs.map((job) => <Job key={job._id} job={job} />)
              : <p>No jobs available</p>}
          </div>
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        className="absolute bottom-0 left-0 w-full"
      />
    </div>
  );
};

export default Jobs;
