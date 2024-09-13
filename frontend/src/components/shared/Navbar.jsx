import React from "react";
import { ModeToggle } from "../toggle";
import Logo from "../logo";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BriefcaseBusiness,
  Building,
  Globe,
  HomeIcon,
  LogOut,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.log("Logout Error: ", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="border-b-8 bg-white dark:bg-gray-900 rounded-t-lg rounded-lg p-2">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex">
            {user && user.role === "recruiter" ? (
              <ul className="flex items-center lg:gap-6 gap-3 font-extralight ring-1 ring-gray-200 dark:ring-gray-700 rounded-md px-4">
                <Link to="/admin/companies" className="hover:text-blue-800">
                  <li>
                    <div className="">
                      <Building className="w-4 ml-4" />
                      <span className="flex items-center text-xs hover:text-blue-800 font-semibold text-muted-foreground">
                        Company
                      </span>
                    </div>
                  </li>
                </Link>
                <Link to="/admin/jobs" className="hover:text-blue-800">
                  <li>
                    <div className="">
                      <BriefcaseBusiness className="w-4 ml-1" />
                      <span className="flex items-center hover:text-blue-800 text-xs font-semibold text-muted-foreground">
                        Jobs
                      </span>
                    </div>
                  </li>
                </Link>
              </ul>
            ) : (
              <ul className="flex items-center lg:gap-6 gap-3 font-extralight ring-1 ring-gray-200 dark:ring-gray-700 rounded-md px-4">
                <Link to="/" className="hover:text-blue-800">
                  <li>
                    <div className="">
                      <HomeIcon className="w-4 ml-[7px]" />
                      <span className="flex hover:text-blue-800 items-center text-xs font-semibold text-muted-foreground">
                        Home
                      </span>
                    </div>
                  </li>
                </Link>
                <Link to="/jobs" className="hover:text-blue-800">
                  <li>
                    <div className="">
                      <BriefcaseBusiness className="w-4 ml-0.5" />
                      <span className="flex hover:text-blue-800 items-center text-xs font-semibold text-muted-foreground">
                        Job
                      </span>
                    </div>
                  </li>
                </Link>
                <Link to="/browse" className="hover:text-blue-800">
                  <li>
                    <Globe className="ml-3 w-4" />
                    <span className="flex items-center hover:text-blue-800 text-xs font-semibold text-muted-foreground">
                      Browse
                    </span>
                  </li>
                </Link>
              </ul>
            )}
          </div>
          <div className="ring-1 rounded-md ring-gray-200 dark:ring-gray-900">
            <ModeToggle />
          </div>

          {!user ? (
            <div className="flex gap-2 text-sm ring-1 rounded-md ring-gray-200 dark:ring-gray-900">
              <Link to="/signup">
                <Button>
                  <UserRound className="w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="mr-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="avatar"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Link to="/profile">
                    <div className="flex-1">
                      <h4 className="text-base font-light hover:font-semibold">
                        {user?.fullname}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </Link>
                  <div className="ml-auto cursor-pointer">
                    <Button onClick={logoutHandler}>
                      <LogOut />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
