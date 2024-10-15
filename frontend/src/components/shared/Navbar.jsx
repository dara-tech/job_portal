import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  BriefcaseBusiness,
  Globe,
  Building,
  LayoutDashboardIcon,
  LogOut,
  UserRound,
  Menu,
  X,
  ChevronDown,
  Settings,
  HelpCircle,
  User,
  MessageSquare,
  IdCardIcon,
  ShoppingCart,
} from "lucide-react";
import { ModeToggle } from "../toggle";
import Logo from "../logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
        location.pathname === to
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  const recruiterLinks = [
    { to: "/admin/companies", icon: Building, label: "Companies" },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { to: "/admin/chat", icon: MessageSquare, label: "Chat" },
  ];
  const adminLinks = [
    { to: "/admin/companies", icon: Building, label: "Companies" },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/user", icon: User, label: "User" },
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  ];

  const userLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/browse", icon: Globe, label: "Browse" },
    { to: "/products", icon: ShoppingCart, label: "Products" },
  ];

  const links =
    user && (user.role === "recruiter" || user.role === "admin")
      ? user.role === "admin"
        ? adminLinks
        : recruiterLinks
      : userLinks;

  return (
    <motion.nav
      className={`sticky top-0 z-50 bg-background border-b transition-shadow duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {links.map((link) => (
                  <NavLink key={link.to} {...link} />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            {!user ? (
              <Link to="/signup">
                <Button>
                  <UserRound className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="avatar"
                      />
                      <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.fullname}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/resume/new")}>
                    <IdCardIcon className="w-4 h-4 mr-2" />
                    AI Resume Builder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserRound className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/saved")}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Save jobs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {links.map((link) => (
                <NavLink key={link.to} {...link} />
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {!user ? (
                <div className="px-2">
                  <Link to="/signup">
                    <Button className="w-full">
                      <UserRound className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/resume")}
                  >
                    <IdCardIcon className="w-4 h-4 mr-2" />
                    AI Resume Builder
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <UserRound className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/saved")}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Saved Jobs
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={logoutHandler}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
