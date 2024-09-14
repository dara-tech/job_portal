import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

const JobDescription = () => {
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const { user } = useSelector((store) => store.auth);
  const job = useSelector((store) => store.job.singleJob);

  const isInitiallyApplied = job?.applications?.some(
    (app) => app.applicant === user?._id
  ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        // console.log("API Response:", res.data);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          if (user) {
            setIsApplied(
              res.data.job.applications.some(
                (application) => application.applicant === user?._id
              )
            );
          }
        } else {
          console.error("Failed to fetch job details:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("You need to be signed in to apply for this job");
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedJob = {
          ...job,
          applications: [...job.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJob));
        setIsApplied(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(
        error.response?.data?.message || "Failed to apply for the job"
      );
    }
  };

  const postedDate = isValidDate(new Date(job?.postedDate))
    ? formatDistanceToNow(new Date(job?.postedDate), { addSuffix: true })
    : "Unknown date";

  const expiresIn = isValidDate(new Date(job?.expire))
    ? formatDistanceToNow(new Date(job?.expire), { addSuffix: true })
    : "N/A";

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700 rounded-full p-2">
            <img
              src={job?.company?.logo}
              alt="Company Logo"
              className="w-28 h-28 object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold">
                {job?.company?.name || "Unknown Company"}
              </h1>
              <p className="text-sm text-gray-500">{postedDate}</p>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {job?.title || "No Job Title"}
            </h2>
            <div className="flex gap-4 flex-wrap mb-4">
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded ring-1 ring-gray-300 dark:ring-gray-600">
                {job?.jobType || "NA"}
              </span>
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded ring-1 ring-gray-300 dark:ring-gray-600">
                {job?.experienceLevel || "NA"}
              </span>
            </div>
            <Button
              onClick={!isApplied ? applyJobHandler : null}
              className="flex items-center gap-2"
              disabled={isApplied || !user} // Disable if already applied or not signed in
            >
              {isApplied ? (
                <>
                  Applied <Check className="w-4 text-green-500" />
                </>
              ) : user ? (
                "Apply now"
              ) : (
                "Sign in to apply"
              )}
            </Button>
          </div>
        </div>

        {/* Job Details */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <div
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: job?.description || "Description not available" }}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <h2 className="text-xl font-bold mb-4">Requirements</h2>
          {job?.requirements && job.requirements.length > 0 ? (
            <div
              className="text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: job.requirements.join('') }}
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300">No requirements specified.</p>
          )}
        </div>

        {/* Additional Details */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <h2 className="text-xl font-bold mb-4">Additional Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Role:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job?.title || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Location:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job?.location || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Experience Level:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job?.experienceLevel || "2 years+"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Salary:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job?.salary || "12k+"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Total Applications:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job?.applications?.length || "0"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Expires in:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {expiresIn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
