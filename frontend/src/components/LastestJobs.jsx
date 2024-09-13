import { BriefcaseBusiness } from "lucide-react";
import React from "react";
import LatestJobCards from "./LastestJobCards"; // Corrected component name
import { useSelector } from "react-redux";

const LastestJobs = () => {
  const { allJobs, loading, error } = useSelector((state) => state.job); // Added loading and error states

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading jobs: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center mb-2">
      <div className="mt-6 mb-6 text-center ">
        <h1 className="text-2xl font-extrabold text-gray-600 dark:text-gray-200">
          Job Opening
          <span className="text-2xl font-extrabold bg-blue-600 p-1 px-2 rounded-e-lg text-white">
            Latest
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      
        {allJobs.length <= 0 ? (
          <span>No jobs available</span>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LastestJobs;
