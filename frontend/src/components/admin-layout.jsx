"'use client'"

import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, Outlet } from "react-router-dom"
import { motion } from "framer-motion";
import {
  Building,
  BriefcaseBusiness,
  LayoutDashboardIcon,
  User,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react"
import Logo from "../logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AdminLayoutComponent() {
  const { user } = useSelector((store) => store.auth)
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const adminLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { to: "/admin/companies", icon: Building, label: "Companies" },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/users", icon: User, label: "Users" },
  ]

  const recruiterLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { to: "/admin/companies", icon: Building, label: "Companies" },
    { to: "/admin/jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { to: "/admin/chat", icon: MessageSquare, label: "Chat" },
  ]

  const links = user?.role === "admin" ? adminLinks : recruiterLinks

  const NavLink = ({ to, icon: Icon, label, onClick }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
        location.pathname === to
          ? "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900"
          : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
      }`}
      onClick={onClick}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )

  return (
    (<div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden md:flex flex-col border-r transition-all duration-300 ${
          isCollapsed ? "'w-16'" : "'w-64'"
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <Logo />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
              <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div>
                <p className="font-medium">{user?.fullname}</p>
                <p className="text-sm text-slate-500 capitalize dark:text-slate-400">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-2 px-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <NavLink {...link} onClick={() => setIsMobileMenuOpen(false)} />
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                  <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.fullname}</p>
                  <p className="text-sm text-slate-500 capitalize dark:text-slate-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] sm:w-[300px]"
                startAdornment={<Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />} />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
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
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>)
  );
}