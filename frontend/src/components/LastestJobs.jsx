import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BriefcaseBusiness, ArrowRight, Loader2 } from "lucide-react";
// import LatestJobCards from "@/components/LastestJobCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JobCard from "@/components/LastestJobCards";

export default function LatestJobs() {
  const { allJobs, loading, error } = useSelector((state) => state.job);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 bg-red-50 dark:bg-red-900">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-center text-red-600 dark:text-red-300">
            Error Loading Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500 dark:text-red-400">
            {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8 dark:bg-transparent border-none ">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-200">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Latest
          </span>{" "}
          Job Openings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allJobs.length <= 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <BriefcaseBusiness className="mx-auto h-12 w-12 mb-4" />
            <p>No jobs available at the moment. Check back later!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {allJobs.slice(0, 6).map((job) => (
              <motion.div key={job._id} variants={item}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {allJobs.length > 6 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="group">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
