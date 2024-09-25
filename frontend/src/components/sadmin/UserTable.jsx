import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Loader2, Trash, Edit, Eye, User2, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ADMIN_API_END_POINT } from "@/utils/constant"
import Navbar from "../shared/Navbar"
import ChatModal from "./ChatModal"

const ITEMS_PER_PAGE = 10

const UserTable = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, filters])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/user`, { withCredentials: true })
      setUsers(response.data.users)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users. Please try again.")
      setLoading(false)
    }
  }

  const filterUsers = () => {
    const filtered = users.filter((user) => {
      return (
        user.fullname.toLowerCase().includes(filters.fullname.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.phoneNumber.includes(filters.phoneNumber) &&
        user.role.toLowerCase().includes(filters.role.toLowerCase())
      )
    })
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleEdit = (userId) => {
    navigate(`/admin/user/${userId}`, { state: { withCredentials: true } })
  }

  const handleDelete = async () => {
    if (!deleteUserId) return

    try {
      await axios.delete(`${ADMIN_API_END_POINT}/user/${deleteUserId}`, { withCredentials: true })
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user. Please try again.")
    } finally {
      setDeleteUserId(null)
    }
  }

  const handleChat = (user) => {
    setSelectedUser(user)
    setIsChatModalOpen(true)
  }

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <User2 />
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">All Users</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Filter by name"
            name="fullname"
            value={filters.fullname}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by phone"
            name="phoneNumber"
            value={filters.phoneNumber}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by role"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.profile.profilePhoto} alt={user.fullname} />
                      <AvatarFallback>{user.fullname[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(user._id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChat(user)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteUserId(user._id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        user={selectedUser}
      />

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserTable