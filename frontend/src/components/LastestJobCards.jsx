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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };


  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    const amount = parseFloat(salary);
    return amount ? `$${amount.toLocaleString()}` : salary;
  };

  const getTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

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
    <Card className="ring-1 ring-gray-300 dark:ring-gray-700 w-full max-w-md mx-auto transition-all duration-300 hover:shadow-xl flex flex-col h-[500px] overflow-hidden group backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 border border-white/50 dark:border-gray-700/50">
      <CardHeader className="relative pb-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/20 dark:to-gray-700/10 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
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
                <span className="text-2xl font-bold text-gray-600/80 dark:text-gray-300/80">
                  {company.name?.[0] || "U"}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800/90 dark:text-gray-100/90 group-hover:text-primary/90 dark:group-hover:text-primary/70 transition-colors">{company.name || "Unknown Company"}</h2>
              <p className="text-xs text-muted-foreground/80">
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
                    className={`text-gray-600/80 hover:text-primary/80 dark:text-gray-300/80 dark:hover:text-primary/70 ${isJobSaved ? "text-primary/80 dark:text-primary/70" : ""} transition-colors`}
                    onClick={handleSaveToggle}
                    disabled={isSaving || isCheckingSaved}
                  >
                    <Bookmark className={`h-4 w-4 ${isJobSaved ? "fill-current" : ""} transition-all`} />
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
                  <Button variant="ghost" size="icon" className="text-gray-600/80 hover:text-primary/80 dark:text-gray-300/80 dark:hover:text-primary/70 transition-colors">
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
        <h1 className="text-xl font-bold text-gray-900/90 dark:text-gray-50/90 mb-3 group-hover:text-primary/90 dark:group-hover:text-primary/70 transition-colors">{title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="group-hover:bg-primary/80 group-hover:text-white/90 dark:group-hover:bg-primary/70 dark:group-hover:text-white/80 transition-colors">{jobType}</Badge>
          <Badge variant="secondary" className="group-hover:bg-primary/80 group-hover:text-white/90 dark:group-hover:bg-primary/70 dark:group-hover:text-white/80 transition-colors">{experienceLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2 flex-grow overflow-auto">
        <div className="space-y-1 text-sm text-gray-700/80 dark:text-gray-200/80">
          {[
            { icon: DollarSign, text: salary },
            { icon: MapPin, text: location },
            { icon: User, text: position },
            { icon: Clock, text: postedDate ? formatDistanceToNow(new Date(postedDate), { addSuffix: true }) : "Date not available" },
            { icon: Briefcase, text: jobType },
            { icon: TrendingUp, text: experienceLevel }
          ].map((item, index) => (
            <div key={index} className="flex items-center group/item hover:bg-gray-100/30 dark:hover:bg-gray-800/30 p-2 rounded-md transition-colors">
              <item.icon className="h-4 w-4 text-gray-500/80 dark:text-gray-400/80 mr-2 flex-shrink-0 group-hover/item:text-primary/80 dark:group-hover/item:text-primary/70 transition-colors" />
              <span className="group-hover/item:text-primary/80 dark:group-hover/item:text-primary/70 transition-colors">{item.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4 bg-gray-50/30 dark:bg-gray-800/30 border-t border-white/30 dark:border-gray-700/30">
        <div className="flex justify-between w-full space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/description/${_id}`)} 
            className="flex-1 group-hover:bg-primary/80 group-hover:text-white/90 dark:group-hover:bg-primary/70 dark:group-hover:text-white/80 transition-all duration-300 ease-in-out transform group-hover:scale-105 dark:border-gray-600/50 dark:text-gray-200/80 dark:hover:border-primary/50"
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}