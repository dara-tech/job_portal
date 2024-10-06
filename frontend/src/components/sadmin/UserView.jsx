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
import SkillsInput from '../form/SkillsInput'
import SocialLinksInput from '../form/SocialLinksInput'
import { useSelector } from 'react-redux'

const UserView = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.user)

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

  const handleEdit = () => {
    if (currentUser.role !== 'admin') {
      toast.error('Only administrators can edit user information.')
      return
    }
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setEditedUser(user)
  }

  const handleSave = async () => {
    if (currentUser.role !== 'admin') {
      toast.error('Only administrators can save user information.')
      return
    }
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

  const handleAddSkill = (newSkill) => {
    setEditedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: [...prev.profile.skills, newSkill]
      }
    }))
  }

  const handleRemoveSkill = (skillNameToRemove) => {
    setEditedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill.name !== skillNameToRemove)
      }
    }))
  }

  const handleUpdateSkill = (updatedSkill) => {
    setEditedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.map(skill => 
          skill.name === updatedSkill.name ? updatedSkill : skill
        )
      }
    }))
  }

  const handleAddSocialLink = (platform, link) => {
    setEditedUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: {
          ...prev.profile.socialLinks,
          [platform]: link
        }
      }
    }))
  }

  const handleRemoveSocialLink = (platform) => {
    setEditedUser(prev => {
      const newSocialLinks = { ...prev.profile.socialLinks }
      delete newSocialLinks[platform]
      return {
        ...prev,
        profile: {
          ...prev.profile,
          socialLinks: newSocialLinks
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
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen dark:bg-gradient-to-r from-black to-gray-950 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-4xl mx-auto bg-white/100 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-lime-500 to-blue-500 dark:text-slate-900 text-gray-200 p-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 shadow-lg">
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
            { icon: Calendar, label: 'Experience', value: 'experience' },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-4 text-sm">
              <item.icon className="h-6 w-6 text-muted-foreground justify-center items-center mt-2" />
              <div className="flex-grow">
                <Label className="text-sm text-gray-500">{item.label}</Label>
                {editing ? (
                  item.value === 'location' ? (
                    <Input
                      name={item.value}
                      value={editedUser.profile[item.value]}
                      onChange={handleChange}
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
                  <p className="text-sm font-medium">
                    {item.value === 'location'
                      ? user.profile[item.value] || 'N/A'
                      : item.value === 'experience'
                      ? `${user.profile[item.value][0]} years`
                      : user[item.value]}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 text-sm">
            <Briefcase className="h-6 w-6 text-muted-foreground justify-center items-center mt-2" />
            <div className="flex-grow">
              <Label className="text-sm text-gray-500">Skills</Label>
              {editing ? (
                <SkillsInput
                  skills={editedUser.profile.skills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                  onUpdateSkill={handleUpdateSkill}
                />
              ) : (
                <p className="text-sm font-medium">
                  {user.profile.skills.map(skill => skill.name).join(', ') || 'N/A'}
                </p>
              )}
            </div>
          </div>
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
              <p className="text-sm">{user.profile.bio || 'No bio provided'}</p>
            )}
          </div>
          <div className="mt-6">
            <Label className="text-sm text-gray-500">Social Links</Label>
            {editing ? (
              <SocialLinksInput
                socialLinks={editedUser.profile.socialLinks}
                onAddLink={handleAddSocialLink}
                onRemoveLink={handleRemoveSocialLink}
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(user.profile.socialLinks || {}).map(([platform, link]) => (
                  <Badge key={platform} variant="secondary">
                    {platform}: {link}
                  </Badge>
                ))}
              </div>
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
            currentUser.role === 'admin' && (
              <Button onClick={handleEdit} className="bg-primary hover:bg-primary-dark text-white">
                <Edit className="mr-2 h-4 w-4" /> Edit User Information
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
    </div>
   
  )
}

export default UserView