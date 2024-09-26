import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Mail, Phone, MapPin, Briefcase, Calendar, Save, X, ChevronDown, Edit } from 'lucide-react'
import { ADMIN_API_END_POINT } from '@/utils/constant'
import Navbar from '../shared/Navbar'

const UserView = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_END_POINT}/user/${id}`, { withCredentials: true })
        setUser(response.data.user)
        setEditedUser(response.data.user)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error(error.response?.data?.message || 'Failed to fetch user details. Please try again.')
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleEdit = () => setEditing(true)
  const handleCancel = () => {
    setEditing(false)
    setEditedUser(user)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await axios.put(`${ADMIN_API_END_POINT}/user/${id}`, editedUser, { withCredentials: true })
      setUser(response.data.user)
      setEditing(false)
      toast.success('User information updated successfully')
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.response?.data?.message || 'Failed to update user information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => {
      if (name in prev) {
        return { ...prev, [name]: value }
      } else {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [name]: value
          }
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 to-gray-200">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <div className="text-center text-2xl font-bold text-gray-800">User not found</div>
  }

  return (
    <div>
      {/* <Navbar/> */}
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-black to-gray-950 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-4xl mx-auto bg-white/100 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900 to- text-white p-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profile.profilePhoto} alt={user.fullname} />
              <AvatarFallback ><span className='text-2xl'>{user.fullname}</span>
               </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold mb-2">
                {editing ? (
                  <Input
                    name="fullname"
                    value={editedUser.fullname}
                    onChange={handleChange}
                    className="bg-white/10 text-white border-none text-2xl"
                    aria-label="Full Name"
                  />
                ) : (
                  user.fullname
                )}
              </CardTitle>
              <Badge variant="secondary" className="text-sm py-1">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-4 ">
          {[ 
            { icon: Mail, label: 'Email', value: 'email' },
            { icon: Phone, label: 'Phone', value: 'phoneNumber' },
            { icon: MapPin, label: 'Location', value: 'location' },
            { icon: Briefcase, label: 'Skills', value: 'skills' },
            { icon: Calendar, label: 'Experience', value: 'experience' },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-4 text-sm">
              <item.icon className="h-6 w-6 text-muted-foreground justify-center items-center mt-4" />
              <div className="flex-grow">
                <Label className="text-sm text-gray-500">{item.label}</Label>
                {editing ? (
                  item.value === 'skills' || item.value === 'location' ? (
                    <Input
                      name={item.value}
                      value={editedUser.profile[item.value].join(', ')}
                      onChange={(e) => handleChange({ target: { name: item.value, value: e.target.value.split(', ') } })}
                      className="mt-1"
                      aria-label={item.label}
                    />
                  ) : item.value === 'experience' ? (
                    <Input
                      name={item.value}
                      value={editedUser.profile[item.value][0]}
                      onChange={(e) => handleChange({ target: { name: item.value, value: [e.target.value] } })}
                      type="number"
                      min="0"
                      className="mt-1"
                      aria-label={`Years of ${item.label}`}
                    />
                  ) : (
                    <Input
                      name={item.value}
                      value={editedUser[item.value]}
                      onChange={handleChange}
                      className="mt-1"
                      aria-label={item.label}
                    />
                  )
                ) : (
                  <p className="text-lg font-medium">
                    {item.value === 'skills' || item.value === 'location'
                      ? user.profile[item.value].join(', ') || 'N/A'
                      : item.value === 'experience'
                      ? `${user.profile[item.value][0]} years`
                      : user[item.value]}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="mt-6">
            <Label className="text-sm text-gray-500">Bio</Label>
            {editing ? (
              <Textarea
                name="bio"
                value={editedUser.profile.bio}
                onChange={handleChange}
                className="mt-1"
                rows={4}
                aria-label="Bio"
              />
            ) : (
              <p className="text-lg">{user.profile.bio || 'No bio provided'}</p>
            )}
          </div>
          {editing && (
            <div className="mt-6">
              <Label htmlFor="role" className="text-sm text-gray-500">Role</Label>
              <Select 
                name="role" 
                value={editedUser.role} 
                onValueChange={(value) => handleChange({ target: { name: 'role', value } })}
              >
                <SelectTrigger id="role" className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex justify-end gap-4">
          {editing ? (
            <>
              <Button onClick={handleCancel} variant="outline" disabled={saving}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-dark text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="bg-primary hover:bg-primary-dark text-white">
              <Edit className="mr-2 h-4 w-4" /> Edit User Information
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
    </div>
   
  )
}

export default UserView