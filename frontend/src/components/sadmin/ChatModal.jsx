import React, { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { X, Send, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CHAT_API_ENDPOINT } from '@/utils/constant'

const MessageBubble = React.memo(({ message, isCurrentUser }) => (
  <div
    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`rounded-lg p-3 max-w-[70%] ${
        isCurrentUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary'
      }`}
    >
      <p className="break-words">{message.message}</p>
      <span className="text-xs opacity-50 mt-1 block">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  </div>
))

MessageBubble.displayName = 'MessageBubble'

export default function ChatModal({ isOpen, onClose, user }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef(null)
  const chatContainerRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const response = await axios.get(`${CHAT_API_ENDPOINT}/api/v1/chat/history/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setMessages(response.data.data)
      } else if (Array.isArray(response.data)) {
        setMessages(response.data)
      } else {
        throw new Error('Received invalid data from the server')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError(`Failed to load chat history: ${error.message || 'Unknown error'}`)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const setupSocket = useCallback(() => {
    if (!user || socketRef.current) return

    socketRef.current = io(CHAT_API_ENDPOINT, {
      path: '/socket.io',
      transports: ['websocket'],
      query: { userId: user._id },
      auth: {
        token: localStorage.getItem('authToken')
      }
    })

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully')
      setError(null)
      socketRef.current.emit('join', user._id)
    })

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setError(`Failed to connect to chat server: ${err.message}`)
    })

    socketRef.current.on('message', (message) => {
      console.log('Received message:', message)
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket')
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [user])

  useEffect(() => {
    setupSocket()
    fetchMessages()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [user, setupSocket, fetchMessages])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const messageData = {
      receiverId: user._id,
      message: newMessage
    }

    try {
      setIsLoading(true)
      const response = await axios.post(`${CHAT_API_ENDPOINT}/api/v1/chat/send`, messageData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        withCredentials: true
      })
      
      if (response.status === 201) {
        setNewMessage('')
        
        const newMessageObj = {
          _id: response.data._id,
          senderId: localStorage.getItem('userId'),
          receiverId: user._id,
          message: newMessage,
          timestamp: new Date().toISOString(),
        }
        setMessages(prevMessages => [...prevMessages, newMessageObj])
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError(`Failed to send message: ${error.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" role="dialog" aria-modal="true" aria-labelledby="chat-modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-lg">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user.profile.profilePhoto} alt={user.fullname} />
              <AvatarFallback>{user.fullname[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 id="chat-modal-title" className="text-lg font-semibold text-gray-700 dark:text-white">{user.fullname}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-grow p-4" ref={chatContainerRef}>
          {error && (
            <div className="text-red-500 mb-4 p-2 bg-red-100 dark:bg-red-900 rounded" role="alert">
              {error}
            </div>
          )}
          {isLoading && messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isCurrentUser={message.senderId !== user._id}
            />
          ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              aria-label="Type your message"
              disabled={isLoading}
            />
            <Button type="submit" aria-label="Send message" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}