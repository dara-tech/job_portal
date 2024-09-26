import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  Users,
  Clock,
} from "lucide-react";
import { JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";

const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSavedJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/saved`, {
        withCredentials: true,
      });
      const jobsWithDetails = await Promise.all(
        response.data.savedJobs.map(async (savedJob) => {
          try {
            const jobResponse = await axios.get(
              `${JOB_API_END_POINT}/get/${savedJob._id}`,
              { withCredentials: true }
            );
            return jobResponse.data.job;
          } catch (err) {
            console.error("Error fetching job details:", err);
            return null;
          }
        })
      );
      setSavedJobs(jobsWithDetails.filter((job) => job !== null));
    } catch (err) {
      setError("Failed to fetch saved jobs. Please try again later.");
      console.error("Error fetching saved jobs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleRemove = useCallback(async (jobId) => {
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/unsaved/${jobId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        toast.success("Job removed from saved list");
      } else {
        throw new Error(response.data.message || "Failed to remove the job");
      }
    } catch (err) {
      console.error("Error removing saved job:", err);
      toast.error(err.response?.data?.message || "Failed to remove the job. Please try again.");
    }
  }, []);

  if (isLoading) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="container mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24 mr-2" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {/* <Navbar /> */}
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
          <Card className="w-full bg-red-50 dark:bg-red-900">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <Card className="w-full">
            <CardContent className="p-4">
              <p className="text-gray-600 dark:text-gray-300">
                You haven't saved any jobs yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <Card key={job._id} className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
                      {job.company && job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={`${job.company.name} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${job.company.name}&background=random`;
                          }}
                        />
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {job.title || "Untitled Job"}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.company ? job.company.name : "Unknown Company"} •
                        Posted{" "}
                        {isValidDate(new Date(job.postedDate))
                          ? formatDistanceToNow(new Date(job.postedDate), {
                              addSuffix: true,
                            })
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {job.jobType || "N/A"}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {job.experienceLevel || "N/A"}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.location || "N/A"}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" />
                      {job.salary || "Salary not specified"}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Expires{" "}
                      {isValidDate(new Date(job.expire))
                        ? formatDistanceToNow(new Date(job.expire), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {job.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    ) : (
                      "No description available."
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/description/${job._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(job._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;