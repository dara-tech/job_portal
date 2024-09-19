import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Briefcase, Clock, Home, Laptop, User, DollarSign, Calendar, MapPin } from "lucide-react";
import { JOB_API_END_POINT } from "@/utils/constant";

const UpdateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
    location: "",
    expire: "",
  });
  const [loading, setLoading] = useState(false);
  const { companies } = useSelector((store) => store.company);

  const jobTypes = [
    { label: "Full-time", icon: <Briefcase className="w-4 h-4" />, value: "full-time" },
    { label: "Part-time", icon: <Clock className="w-4 h-4" />, value: "part-time" },
    { label: "Remote", icon: <Home className="w-4 h-4" />, value: "remote" },
    { label: "Freelance", icon: <Laptop className="w-4 h-4" />, value: "freelance" },
  ];

  const experienceOptions = [
    { label: "No Experience", icon: <User className="w-4 h-4" />, value: "noexperience" },
    { label: "Fresher", icon: <User className="w-4 h-4" />, value: "fresher" },
    { label: "Junior", icon: <User className="w-4 h-4" />, value: "junior" },
    { label: "Senior", icon: <User className="w-4 h-4" />, value: "senior" },
  ];

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setInput({
            ...res.data.job,
            requirements: res.data.job.requirements || [],
          });
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while fetching job details.");
      }
    };

    fetchJobDetails();
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value });
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
      const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while updating the job.");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Update Job</CardTitle>
            <CardDescription>Edit the job details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={input.title}
                      onChange={changeEventHandler}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Select onValueChange={selectChangeHandler} value={input.companyId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              <div className="flex items-center gap-2">
                                <img src={company.logo} alt={company.name} className="w-6 h-6 rounded-full" />
                                <span>{company.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                        className="pl-10"
                        placeholder="Enter job location"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <div className="flex flex-wrap gap-2">
                      {jobTypes.map((type) => (
                        <Button
                          key={type.value}
                          type="button"
                          variant={input.jobType === type.value ? "default" : "outline"}
                          className="flex items-center gap-2"
                          onClick={() => selectJobType(type.value)}
                        >
                          {type.icon}
                          <span>{type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <div className="flex flex-wrap gap-2">
                      {experienceOptions.map((exp) => (
                        <Button
                          key={exp.value}
                          type="button"
                          variant={input.experience === exp.value ? "default" : "outline"}
                          className="flex items-center gap-2"
                          onClick={() => selectExperience(exp.value)}
                        >
                          {exp.icon}
                          <span>{exp.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Number of Positions</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="position"
                          name="position"
                          type="number"
                          value={input.position}
                          onChange={changeEventHandler}
                          className="pl-10"
                          placeholder="Enter number of positions"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary (optional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="salary"
                          name="salary"
                          value={input.salary}
                          onChange={changeEventHandler}
                          className="pl-10"
                          placeholder="Enter salary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expire">Application Expiry Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="expire"
                        name="expire"
                        type="date"
                        value={input.expire}
                        onChange={changeEventHandler}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="requirements" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <ScrollArea className=" w-full  ">
                      <ReactQuill
                        theme="snow"
                        value={input.description}
                        onChange={(value) => setInput({ ...input, description: value })}
                        modules={quillModules}
                        className="h-full border-2"
                      />
                    </ScrollArea>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Job Requirements</Label>
                    <ScrollArea className=" w-full ">
                      <ReactQuill
                        theme="snow"
                        value={input.requirements.join("\n")}
                        onChange={(value) => setInput({ ...input, requirements: value.split("\n") })}
                        modules={quillModules}
                        className="h-full border-2"
                      />
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateJob;