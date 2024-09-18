import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "sonner"
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
} from "lucide-react"
import { ModeToggle } from "../toggle"
import Logo from "../logo"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"

const Navbar = () => {
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate("/")
        toast.success(res.data.message)
      } else {
        toast.error("Logout failed. Please try again.")
      }
    } catch (error) {
      console.log("Logout Error: ", error)
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred"
      toast.error(errorMessage)
    }
  }

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        location.pathname === to
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )

  const recruiterLinks = [
    { to: "/admin/companies", icon: Building, label: "Companies" },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  ]

  const userLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/browse", icon: Globe, label: "Browse" },
  ]

  const links = user && user.role === "recruiter" ? recruiterLinks : userLinks

  return (
    <nav className="bg-background border-b">
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
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            {!user ? (
              <Link to="/signup">
                <Button>
                  <UserRound className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                    <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                      <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{user?.fullname}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.profile?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                  <Link to="/profile" className="block mb-2">
                    <Button variant="outline" className="w-full justify-start">
                      <UserRound className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full" onClick={logoutHandler}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
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
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <UserRound className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full" onClick={logoutHandler}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
