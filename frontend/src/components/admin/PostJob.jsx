import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { TfiHummer } from "react-icons/tfi";
import { MdOutlineTitle } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  BsHandbagFill,
  BsClockFill,
  BsHouseDoorFill,
  BsLaptopFill,
} from "react-icons/bs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Building, Save, UserCheck2 } from "lucide-react";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { FaUser, FaNetworkWired, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

const PostJob = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
    location: "",
    expire: "",
  });
  const [loading, setLoading] = useState(false);

  const jobTypes = [
    { label: "Full-time", icon: <BsHandbagFill className="w-4 h-4" />, value: "full-time" },
    { label: "Part-time", icon: <BsClockFill className="w-4 h-4" />, value: "part-time" },
    { label: "Remote", icon: <BsHouseDoorFill className="w-4 h-4" />, value: "remote" },
    { label: "Freelance", icon: <BsLaptopFill className="w-4 h-4" />, value: "freelance" },
  ];

  const experienceOptions = [
    { label: "No Experience", icon: <FaUserPlus className="w-5 h-5" />, value: "noexperience" },
    { label: "Fresher", icon: <FaUser className="w-5 h-5" />, value: "fresher" },
    { label: "Junior", icon: <FaUserGraduate className="w-5 h-5" />, value: "junior" },
    { label: "Senior", icon: <FaUserTie className="w-5 h-5" />, value: "senior" },
  ];

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company._id === value);
    setInput({ ...input, companyId: selectedCompany ? selectedCompany._id : "" });
  };

  const selectJobType = (type) => {
    setInput({ ...input, jobType: type });
  };

  const selectExperience = (value) => {
    setInput({ ...input, experience: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.title || !input.description || !input.companyId || !input.location) {
      return toast.error("Please fill out all required fields.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="">
        <form onSubmit={submitHandler}>
          <div className="my-4 lg:px-60 sm:px-10 px-4">
            {/* Job Title */}
            <div className="flex flex-col sm:flex-row justify-between items-center gapx-4">
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <Label className="flex flex-col gap-1">
                  Job Title
                  <span className="text-muted-foreground text-xs">
                    A job title must describe one position only
                  </span>
                </Label>
              </div>
              <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded pr-20 mt-2 w-full sm:w-auto">
                <MdOutlineTitle className="w-4 h-4 ml-2 dark:text-gray-700" />
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter job title"
                  value={input.title}
                  onChange={changeEventHandler}
                  className="border-none flex-1"
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="border-t my-6">
              <div className="flex flex-col gapx-4 my-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1">
                    Job Description
                    <span className="text-muted-foreground text-xs">
                      Provide a short description about the job. Keep it short and to the point.
                    </span>
                  </Label>
                </div>
                <div className="mt-4 w-full">
                  <ReactQuill
                    value={input.description}
                    onChange={(value) => setInput({ ...input, description: value })}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Job Requirements */}
            <div className="border-t my-6">
              <div className="flex flex-col gapx-4 my-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1">
                    Job Requirements
                    <span className="text-muted-foreground text-xs">
                      Provide a short requirement about the job. Keep it short and to the point.
                    </span>
                  </Label>
                </div>
                <div className="mt-4 w-full">
                  <ReactQuill
                    value={input.requirements}
                    onChange={(value) => setInput({ ...input, requirements: value })}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Company */}
            <div className="border-t my-6">
              <div className="flex flex-col gapx-4 my-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1  mb-4">Company</Label>
                </div>
                <div className="w-full">
                  <Select onValueChange={selectChangeHandler} defaultValue="">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            <div className="flex items-center gap-3">
                              <img src={company.logo} alt={company.name} className="w-6 h-6 rounded-full" />
                              {company.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div className="border-t my-6">
              <div className="flex flex-col gapx-4 my-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mb-4">Job Type</Label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {jobTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={input.jobType === type.value ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => selectJobType(type.value)}
                    >
                      {type.icon}
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="border-t my-6">
              <div className="flex flex-col gapx-4 my-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mb-4">Experience Level</Label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {experienceOptions.map((exp) => (
                    <Button
                      key={exp.value}
                      variant={input.experience === exp.value ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => selectExperience(exp.value)}
                    >
                      {exp.icon}
                      {exp.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="border-t my-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gapx-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mt-4">Number of Positions</Label>
                </div>
                <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded pr-20 mt-2 w-full sm:w-auto">
                  <FaUser className="w-4 h-4 ml-2 dark:text-gray-700" />
                  <Input
                    type="number"
                    name="position"
                    placeholder="Enter number of positions"
                    value={input.position}
                    onChange={changeEventHandler}
                    className="border-none flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="border-t my-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gapx-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mt-4">Salary (optional)</Label>
                </div>
                <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded pr-20 mt-2 w-full sm:w-auto">
                  <CiMoneyBill className="w-4 h-4 ml-2 dark:text-gray-700" />
                  <Input
                    type="text"
                    name="salary"
                    placeholder="Enter salary"
                    value={input.salary}
                    onChange={changeEventHandler}
                    className="border-none flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t my-6 ">
              <div className="flex flex-col sm:flex-row justify-between items-center gapx-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mt-4">Location</Label>
                </div>
                <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded pr-20 mt-2 w-full sm:w-auto">
                  <CiLocationOn className="w-4 h-4 ml-2 dark:text-gray-700" />
                  <Input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="border-none flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="border-t my-6 ">
              <div className="flex flex-col sm:flex-row justify-between items-center gapx-4">
                <div className="w-full sm:w-auto mb-2 sm:mb-0">
                  <Label className="flex flex-col gap-1 mt-4">Application Expiry Date</Label>
                </div>
                <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded pr-20 mt-2 w-full sm:w-auto">
                  <FaNetworkWired className="w-4 h-4 ml-2 dark:text-gray-700" />
                  <Input
                    type="date"
                    name="expire"
                    value={input.expire}
                    onChange={changeEventHandler}
                    className="border-none flex-1 "
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t my-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Posting..." : "Post Job"} 
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
