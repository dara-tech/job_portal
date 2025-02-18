import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  BriefcaseBusiness,
  LayoutDashboardIcon,
  LogOut,
  UserRound,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  User,
  MessageSquare,
  Bell,
  Search,
  HelpCircle,
  HomeIcon,
  FileText,
  ListChecks,
  SquarePen,
  CircleGauge,
  Earth,
  Plus,
  Package,
  ShoppingCart,
} from "lucide-react";
import { ModeToggle } from "../toggle";
import Logo from "../logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const NavLink = ({ to, icon: Icon, label, badge, submenu, isCollapsed }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (submenu) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
            isOpen ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
          </div>
          {!isCollapsed && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && !isCollapsed && (
          <div className="ml-6 mt-2 space-y-2">
            {submenu.map((item) => (
              <NavLink key={item.to} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 ${
        location.pathname === to
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5" />}
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
      {!isCollapsed && badge && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

const AdminLayout = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const recruiterLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { to: "/admin/companies", icon: Building, label: "Companies",
      submenu: [
      { to: "/admin/allcompanies", icon: ListChecks, label: "Companies List" },
      { to: "/admin/companies/create", icon: Plus, label: "Create Company" },

    ], },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs",
      submenu: [
        { to: "/admin/jobs", icon: ListChecks, label: "Jobs List" },
        { to: "/admin/job/create", icon: Plus, label: "Create Job" },

      ],
     },
    { to: "/admin/chat", icon: MessageSquare, label: "Chat", badge: "3" },
  ];
  const adminLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/admin/admindashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { to: "/admin/allcompanies", icon: Building, label: "Companies",
      submenu: [
        { to: "/admin/allcompanies", icon: ListChecks, label: "Companies List" },
        { to: "/admin/companies/create", icon: Plus, label: "Create Company" },

      ],
     },
    { to: "/admin/alljobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/products", icon: Package, label: "Products",
      submenu: [
        { to: "/admin/products", icon: ListChecks, label: "Products List" },
        { to: "/admin/products/add", icon: Plus, label: "Create Product" },
        { to: "/admin/pos", icon: ShoppingCart, label: "POS" },
      ],
    },
    { to: "/admin/user", icon: User, label: "Users" },
    {
      icon: FileText,
      label: "Blog",
      submenu: [
        { to: "/admin/bloglist", icon: ListChecks, label: "Blog List" },
        { to: "/admin/blogdashboard", icon: CircleGauge, label: "Blog Dashboard" },
        { to: "/admin/blog/create", icon: SquarePen, label: "Create Blog" },
      ],
    },
    { to: "/admin/page", icon: Earth, label: "Pages"},
    

  ];

  const links = user?.role === "admin" ? adminLinks : recruiterLinks;

  return (
    <div className="flex h-screen bg-background">
      <motion.aside
        className={`hidden md:flex flex-col border-r dark:border-gray-900 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <Logo />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {links.map((link, index) => (
              <li key={link.to || `submenu-${index}`}>
                <NavLink {...link} isCollapsed={isCollapsed} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
              <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div>
                <p className="font-medium">{user?.fullname}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
      <div className="flex-1 flex flex-col overflow-hidden ">
        <header className=" bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b dark:border-gray-900">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navigate through your admin panel
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-4">
                    {links.map((link, index) => (
                      <NavLink key={link.to || `mobile-submenu-${index}`} {...link} isCollapsed={isCollapsed} />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              {/* <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 " />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  className="w-[200px] sm:w-[300px] pl-8"
                />
              </div> */}
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
             
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                      <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium hidden sm:inline">{user?.fullname}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserRound className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/help')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto lg:p-2 md:p-0 sm:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;