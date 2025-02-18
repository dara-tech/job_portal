"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT, APPLICATION_API_END_POINT } from "@/utils/constant";
import { setCompanies } from "@/redux/companySlice";
import { setAllApplicants } from "@/redux/applicationSlice";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Briefcase, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminJobsTable from "../admin/AdminJobsTable";
import { StatCard } from "./components/StatCard";
import { CompanyOverviewChart } from "./components/CompanyOverviewChart";
import { ApplicationStatusChart } from "./components/ApplicationStatusChart";
import { CompanyList } from "./components/CompanyList";
import { ApplicantsList } from "./components/ApplicantsList";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const { allAdminJobs } = useSelector((state) => state.job);
  const { applicants } = useSelector((state) => state.application);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [companiesWithApplicants, setCompaniesWithApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState({ applicants: true, companies: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [previousStats, setPreviousStats] = useState({
    companies: 0,
    applicants: 0,
    jobs: 0,
    users: 0,
  });

  const fetchData = async () => {
    setIsLoading({ applicants: true, companies: true });
    setError(null);
    try {
      const [companiesRes, applicantsRes, jobsRes, usersRes] = await Promise.all([
        axios.get(`${ADMIN_API_END_POINT}/companies`, { withCredentials: true }),
        axios.get(`${APPLICATION_API_END_POINT}/applicants`, { withCredentials: true }),
        axios.get(`${ADMIN_API_END_POINT}/alljobs`, { withCredentials: true }),
        axios.get(`${ADMIN_API_END_POINT}/user`, { withCredentials: true }),
      ]);

      if (companiesRes.data.success) {
        dispatch(setCompanies(companiesRes.data.companies));
        setFilteredCompanies(companiesRes.data.companies);
      }
      if (applicantsRes.data.success) dispatch(setAllApplicants(applicantsRes.data.applicants));
      if (jobsRes.data.success) dispatch(setAllAdminJobs(jobsRes.data.jobs));
      if (usersRes.data.success) setAllUsers(usersRes.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please check your network connection and try again.");
    } finally {
      setIsLoading({ applicants: false, companies: false });
    }
  };

  useEffect(() => {
    fetchData();
    setPreviousStats({
      companies: companies.length - Math.floor(Math.random() * 10),
      applicants: (applicants?.length || 0) - Math.floor(Math.random() * 20),
      jobs: allAdminJobs.length - Math.floor(Math.random() * 15),
      users: (allUsers.length || 0) - Math.floor(Math.random() * 5),
    });
  }, [dispatch]);

  useEffect(() => {
    if (allAdminJobs.length > 0) {
      const companiesWithApps = new Set(allAdminJobs.map((job) => job.company?.name).filter(Boolean));
      setCompaniesWithApplicants(Array.from(companiesWithApps));
      if (companiesWithApps.size > 0 && !companiesWithApps.has(selectedCompany)) {
        setSelectedCompany(Array.from(companiesWithApps)[0]);
      }
      setFilteredApplicants(
        selectedCompany === "all"
          ? applicants || []
          : (applicants || []).filter((applicant) => {
              const job = allAdminJobs.find((job) => job._id === applicant.job);
              return job && job.company?.name === selectedCompany;
            })
      );
    } else {
      setCompaniesWithApplicants([]);
      setFilteredApplicants([]);
    }
  }, [applicants, allAdminJobs, selectedCompany]);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [companies, searchTerm]);

  const companyData = useMemo(() => {
    return companies.slice(0, 6).map((company) => ({
      name: company.name,
      employees: company.employeeCount || 0,
      jobs: allAdminJobs.filter((job) => job.company?._id === company._id).length,
      applicants: Array.isArray(applicants) 
        ? applicants.filter(
            (applicant) =>
              allAdminJobs.find(
                (job) =>
                  job._id === applicant.job && job.company?._id === company._id
              )
          ).length 
        : 0,
    }));
  }, [companies, allAdminJobs, applicants]);

  const applicationStatusData = useMemo(() => {
    if (!Array.isArray(applicants)) return [];
    
    const statusCounts = applicants.reduce(
      (acc, applicant) => {
        acc[applicant.status] = (acc[applicant.status] || 0) + 1;
        return acc;
      },
      {}
    );
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [applicants]);

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const response = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${applicantId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedApplicants = Array.isArray(applicants) 
          ? applicants.map((applicant) =>
              applicant._id === applicantId
                ? { ...applicant, status: newStatus }
                : applicant
            )
          : [];
        dispatch(setAllApplicants(updatedApplicants));
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      setError("Failed to update application status. Please try again.");
    }
  };

  const copyEmail = (email) => navigator.clipboard.writeText(email);

  const downloadResume = (resumeUrl, applicantName) => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `${applicantName.replace(" ", "_")}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateTrend = (current, previous) =>
    previous === 0 ? 100 : ((current - previous) / previous) * 100;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={fetchData} className="w-full mt-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Companies"
            value={companies.length}
            icon={Building}
            trend={calculateTrend(companies.length, previousStats.companies)}
          />
          <StatCard
            title="Applicants"
            value={applicants?.length || 0}
            icon={Users}
            trend={calculateTrend(applicants?.length || 0, previousStats.applicants)}
          />
          <StatCard
            title="Jobs"
            value={allAdminJobs.length}
            icon={Briefcase}
            trend={calculateTrend(allAdminJobs.length, previousStats.jobs)}
          />
          <StatCard
            title="Users"
            value={allUsers.length}
            icon={Users}
            trend={calculateTrend(allUsers.length, previousStats.users)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CompanyOverviewChart companyData={companyData} />
          <ApplicationStatusChart applicationStatusData={applicationStatusData} />
        </div>

        <CompanyList
          companies={filteredCompanies}
          applicants={applicants}
          allAdminJobs={allAdminJobs}
          isLoading={isLoading.companies}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminJobsTable jobs={allAdminJobs} />
          </CardContent>
        </Card>

        <ApplicantsList
          companiesWithApplicants={companiesWithApplicants}
          filteredApplicants={filteredApplicants}
          allAdminJobs={allAdminJobs}
          isLoadingApplicants={isLoading.applicants}
          handleStatusChange={handleStatusChange}
          copyEmail={copyEmail}
          downloadResume={downloadResume}
        />
      </div>
    </div>
  );
};

export default Dashboard;