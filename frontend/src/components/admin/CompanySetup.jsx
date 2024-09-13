import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { FaUpload } from 'react-icons/fa';
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Building,
  Earth,
  LocateIcon,
  NotepadText,
  Save,
  User2Icon,
} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

// Default image URL or base64 string
const defaultLogoUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.logo || null,
      });
    }
  }, [singleCompany]);

  useEffect(() => {
    return () => {
      if (input.file && input.file instanceof File) {
        URL.revokeObjectURL(input.file);
      }
    };
  }, [input.file]);

  return (
    <div>
      <Navbar />
      <div className="my-4 px-4">
        <form onSubmit={submitHandler}>
          <div className="flex justify-between">
            <Button variant="outline" className="flex gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-semibold">Back</span>
            </Button>
            <Button type="submit" className="flex gap-2" disabled={loading}>
              <Save className="w-4 h-4 " />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div>
            <h1 className="font-bold text-xl my-2">Company Setup</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <div className="flex flex-col gap-2">
                <label className="relative w-24 h-24 group cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                  <div className="relative w-full h-full flex items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={
                        input.file instanceof File
                          ? URL.createObjectURL(input.file)
                          : input.file || defaultLogoUrl
                      }
                      alt="Logo"
                      className="object-cover rounded-full w-full h-full transition duration-300 ease-in-out group-hover:blur-sm"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                      <FaUpload className="text-2xl" />
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <Label>Company Name</Label>
              <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded mt-2">
                <Building className="w-4 h-4 ml-2 dark:text-gray-700" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter company name"
                  value={input.name}
                  onChange={changeEventHandler}
                  className="border-none"
                />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded mt-2">
                <Earth className="w-4 h-4 ml-2 dark:text-gray-700" />
                <Input
                  type="text"
                  name="website"
                  placeholder="Enter website"
                  value={input.website}
                  onChange={changeEventHandler}
                  className="border-none"
                />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded mt-2">
                <LocateIcon className="w-4 h-4 ml-2 dark:text-gray-700" />
                <Input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="border-none"
                />
              </div>
            </div>
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <Label>Description</Label>
              <div className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded mt-2">
                <NotepadText className="w-4 h-4 ml-2 dark:text-gray-700" />
                <Input
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="border-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
