import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBuilding, faUser } from "@fortawesome/free-solid-svg-icons";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Navbar from "../shared/Navbar";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser, setAuthToken } from "@/redux/authSlice";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem("authToken", token);
        dispatch(setUser(user));
        dispatch(setAuthToken(token));
        navigate("/");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to log in");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-black flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 bg-gray-50 dark:bg-gray-700 p-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={submitHandler}>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <RadioGroup
                name="role"
                value={input.role}
                onValueChange={(value) => setInput((prev) => ({ ...prev, role: value }))}
                className="flex flex-col space-y-2"
              >
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select your role</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Student</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recruiter" id="recruiter" />
                    <Label htmlFor="recruiter" className="flex items-center space-x-2 cursor-pointer">
                      <FontAwesomeIcon icon={faBuilding} className="text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Recruiter</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex items-center space-x-2 cursor-pointer">
                      <FontAwesomeIcon icon={faUser} className="text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Admin</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 bg-gray-50 dark:bg-gray-700 p-6">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}