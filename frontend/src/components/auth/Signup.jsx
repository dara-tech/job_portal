import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User2Icon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import store from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    location: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [preview, setPreview] = useState(null); // State to hold the image preview
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl); // Set the preview URL
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("location", input.location);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow py-2 mb-2">
        <form
          onSubmit={submitHandler}
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-extrabold mb-6">Sign Up</h1>

          <div className="mb-4">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              id="fullname"
              placeholder="Enter your full name"
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              id="email"
              placeholder="Enter your email"
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              value={input.location}
              name="location"
              onChange={changeEventHandler}
              id="location"
              placeholder="Enter your location"
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              id="phoneNumber"
              placeholder="Enter your phone number"
              className="w-full mt-2"
            />
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              id="password"
              placeholder="Enter your password"
              className="w-full mt-2 pr-10"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={toggleShowPassword}
              style={{
                position: "absolute",
                alignItems: "center",
                right: "0.5rem",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2 ring-1 ring-gray-200 dark:ring-gray-700 px-2 rounded py-2">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  id="r1"
                  className="cursor-pointer"
                />
                <label htmlFor="r1">Student</label>
              </div>
              <div className="flex items-center space-x-2 ring-1 ring-gray-200 dark:ring-gray-700 px-2 rounded py-2">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  id="r2"
                  className="cursor-pointer"
                />
                <label htmlFor="r2">Recruiter</label>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label
                htmlFor="profile-pic"
                className="ring-1 ring-gray-200 dark:ring-gray-700 p-2 rounded cursor-pointer"
              >
                <User2Icon />
              </Label>
              <Input
                id="profile-pic"
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="hidden"
              />
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Image Preview"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
            </div>
          )}

          <Button type={loading ? "button" : "submit"} className="w-full py-2">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
