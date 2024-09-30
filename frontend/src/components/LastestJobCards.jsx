import React, { useState, useEffect, useCallback } from "react";
import { Bookmark, Share2, DollarSign, MapPin, User, Clock, Briefcase, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constant";
import JobShare from "./JobShare";

export default function JobCard({ job = {} }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);

  const {
    _id,
    company = {},
    title = "Job Title",
    jobType = "Full-time",
    experienceLevel = "Entry Level",
    salary = "Salary not specified",
    location = "Location not specified",
    position = "Position not specified",
    postedDate,
  } = job;

  const checkSavedStatus = useCallback(async () => {
    if (!_id) return;
    setIsCheckingSaved(true);
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/is-saved/${_id}`, { withCredentials: true });
      setIsJobSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    } finally {
      setIsCheckingSaved(false);
    }
  }, [_id]);

  useEffect(() => {
    checkSavedStatus();
  }, [checkSavedStatus]);

  const handleSaveToggle = async () => {
    if (isCheckingSaved) return;
    setIsSaving(true);
    try {
      if (isJobSaved) {
        await axios.get(`${JOB_API_END_POINT}/unsaved/${_id}`, { withCredentials: true });
        setIsJobSaved(false);
        toast.success("Job removed from saved list");
      } else {
        await axios.post(`${JOB_API_END_POINT}/save/${_id}`, {}, { withCredentials: true });
        setIsJobSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.error("Error toggling job save status:", error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/30 flex flex-col h-[500px]">
      <CardHeader className="relative pb-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-transparent flex items-center justify-center">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={`${company.name || "Unknown"} Logo`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${company.name || "U"}&background=random`;
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {company.name?.[0] || "U"}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">{company.name || "Unknown Company"}</h2>
              <p className="text-xs text-muted-foreground">
                {postedDate
                  ? formatDistanceToNow(new Date(postedDate), { addSuffix: true })
                  : "Posted date not available"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${isJobSaved ? "text-blue-500" : ""}`}
                    onClick={handleSaveToggle}
                    disabled={isSaving || isCheckingSaved}
                  >
                    <Bookmark className={`h-4 w-4 ${isJobSaved ? "fill-current" : ""}`} />
                    <span className="sr-only">{isJobSaved ? "Unsave job" : "Save job"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isJobSaved ? "Remove from saved jobs" : "Save this job"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share job</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="w-auto p-0">
                  <JobShare jobId={_id} jobTitle={title} jobDescription={position} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{jobType}</Badge>
          <Badge variant="secondary">{experienceLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2 flex-grow overflow-auto">
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{position}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{postedDate ? formatDistanceToNow(new Date(postedDate), { addSuffix: true }) : "Date not available"}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{jobType}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span>{experienceLevel}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between w-full space-x-4">
          <Button variant="outline" onClick={() => navigate(`/description/${_id}`)} className="flex-1">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}