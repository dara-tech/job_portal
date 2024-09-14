import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setAuthToken } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
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
    e.preventDefault(); // Prevent default form submission

    try {
      dispatch(setLoading(true)); // Show loading state

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // If your API uses cookies for auth, keep this.
      });

      console.log("Login response:", res.data);

      if (res.data.success) {
        const { token, user } = res.data;

        // Store token in localStorage
        localStorage.setItem("authToken", token);

        // Update Redux state
        dispatch(setUser(user));
        dispatch(setAuthToken(token));

        // Navigate to the homepage after successful login
        navigate("/");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to log in");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      dispatch(setLoading(false)); // Hide loading state
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-dvh">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <form
          onSubmit={submitHandler}
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-extrabold mb-6">Login</h1>

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
              <div className="flex items-center space-x-2 ring-1 ring-gray-200 dark:ring-gray-700 px-2 py-2 rounded">
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
              <div className="flex items-center space-x-2 ring-1 ring-gray-200 dark:ring-gray-700 px-2 py-2 rounded">
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
          </div>
          <Button type={loading ? "button" : "submit"} className="w-full py-2">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="mt-4 text-center text-sm">
            <span>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Signup
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
