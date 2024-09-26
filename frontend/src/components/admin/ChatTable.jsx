'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { ADMIN_API_END_POINT, CHAT_API_ENDPOINT } from "@/utils/constant"
import Navbar from "../shared/Navbar"
import ChatModal from "../sadmin/ChatModal"

const ITEMS_PER_PAGE = 10

export default function ChatTable() {
  const [chats, setChats] = useState([])
  const [filteredChats, setFilteredChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    filterChats()
  }, [chats, filter])

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${CHAT_API_ENDPOINT}/api/v1/chat/recent`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      })

      if (response.data && Array.isArray(response.data.data)) {
        const currentUserId = localStorage.getItem('userId')
        const groupedChats = response.data.data.reduce((acc, message) => {
          const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId
          if (!acc[otherUserId]) {
            acc[otherUserId] = {
              otherUser: {
                _id: otherUserId,
                fullname: "",
                email: "",
                profile: {
                  profilePhoto: ""
                }
              },
              latestMessage: {
                content: message.message,
                timestamp: message.timestamp
              }
            }
            fetchUserDetails(otherUserId, acc[otherUserId])
          } else if (new Date(message.timestamp) > new Date(acc[otherUserId].latestMessage.timestamp)) {
            acc[otherUserId].latestMessage = {
              content: message.message,
              timestamp: message.timestamp
            }
          }
          return acc
        }, {})

        setChats(Object.values(groupedChats))
      } else {
        console.error("Unexpected response format:", response.data)
        setChats([])
        toast.error("Received invalid data from the server")
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching chats:", error)
      toast.error("Failed to fetch chats. Please try again.")
      setChats([])
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId, chatObj) => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      })

      if (response.data && response.data.success && response.data.user) {
        const user = response.data.user
        chatObj.otherUser = {
          _id: userId,
          fullname: user.fullname,
          email: user.email,
          profile: {
            profilePhoto: user.profile.profilePhoto || "/placeholder.svg?height=40&width=40"
          }
        }
        setChats(prevChats => {
          const newChats = [...prevChats]
          const index = newChats.findIndex(chat => chat.otherUser._id === userId)
          if (index !== -1) {
            newChats[index] = { ...newChats[index], ...chatObj }
          }
          return newChats
        })
      } else {
        console.error('Unexpected user data format:', response.data)
      }
    } catch (error) {
      console.error(`Error fetching user details for ${userId}:`, error)
      toast.error(`Failed to fetch details for user ${userId}`)
    }
  }

  const filterChats = () => {
    if (!Array.isArray(chats)) {
      console.error("Chats is not an array:", chats)
      setFilteredChats([])
      return
    }
    const filtered = chats.filter((chat) =>
      chat.otherUser.fullname.toLowerCase().includes(filter.toLowerCase()) ||
      chat.otherUser.email.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredChats(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleChat = useCallback((chat) => {
    setSelectedUser(chat.otherUser)
    setIsChatModalOpen(true)
  }, [])

  const closeChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedUser(null)
  }

  const totalPages = Math.ceil(filteredChats.length / ITEMS_PER_PAGE)
  const paginatedChats = filteredChats.slice(
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
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <main className="container mx-auto py-10">
        <header className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-foreground">Recent Chats</h1>
        </header>
        <div className="mb-6">
          <Input
            placeholder="Filter by name or email"
            value={filter}
            onChange={handleFilterChange}
            className="max-w-sm"
            aria-label="Filter chats"
          />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Latest Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChats.map((chat) => (
                <TableRow key={chat.otherUser._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={chat.otherUser.profile.profilePhoto} alt={`${chat.otherUser.fullname}'s avatar`} />
                      <AvatarFallback>{chat.otherUser.fullname[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{chat.otherUser.fullname}</TableCell>
                  <TableCell>{chat.otherUser.email}</TableCell>
                  <TableCell>{chat.latestMessage.content}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleChat(chat)}>
                      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Chat
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredChats.length)} of {filteredChats.length} chats
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </main>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={closeChatModal}
        user={selectedUser}
      />
    </div>
  )
}