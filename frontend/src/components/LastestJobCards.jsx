import React from "react";
import { Bookmark } from "lucide-react";
import { FaMeta } from "react-icons/fa6";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CiBadgeDollar, CiLocationOn, CiShare1, CiUser } from "react-icons/ci";

const LastestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-2 relative p-3 bg-white dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-700 shadow-md hover:shadow-lg rounded-lg transition-shadow duration-300">
      {/* Job Header */}
      <div className="flex justify-between items-center mb-5">
        {/* Company Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="ring-1 ring-gray-200 rounded-full p-1">
            <img
              src={job?.company?.logo}
              alt={`${job?.company?.name || "Unknown"} Logo`}
              className="w-8 h-8 object-cover rounded-full"
              loading="lazy"
            />
          </div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            {job?.company?.name || "Unknown Company"}
          </h2>
        </div>

        {/* Action Icons */}
        <div className="flex items-center ">
          <button
            aria-label="Save job"
            className="text-gray-500 font-light hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
          >
            <Bookmark className="w-5 h-5 font-light" />
          </button>
          <button
            aria-label="Share job"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
          >
            <CiShare1 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Job Title */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
      <p className="text-xs font-light text-muted-foreground mb-2">
          {job?.postedDate
            ? formatDistanceToNow(new Date(job.postedDate), {
                addSuffix: true,
              })
            : "Posted date not available"}
        </p>
        {job?.title || "Job Title"}
      </h1>

      {/* Job Type and Experience */}
      <div className="flex flex-wrap gap-2 mb-4">
        
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs">
          {job?.jobType || "Full-time"}
        </span>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs">
          {job?.experienceLevel || "Entry Level"}
        </span>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-20 text-gray-700 dark:text-gray-300">
        <div className="flex items-center">
          <CiBadgeDollar className="w-5 h-5 text-gray-500 mr-2" />
          <span>{job?.salary || "Salary not specified"}</span>
        </div>
        <div className="flex items-center">
          <CiLocationOn className="w-5 h-5 text-gray-500 mr-2" />
          <span>{job?.location || "Location not specified"}</span>
        </div>
        <div className="flex items-center">
          <CiUser className="w-5 h-5 text-gray-500 mr-2" />
          <span>{job?.position || "Position not specified"}</span>
        </div>
       
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate(`/description/${job?._id}`)}
            className="text-xs"
          >
            View
          </Button>
          {/* <Button className="text-xs">Apply</Button> */}
        </div>
      </div>
    </div>
  );
};

export default LastestJobCards;
