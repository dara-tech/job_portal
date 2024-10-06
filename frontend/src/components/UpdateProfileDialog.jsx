'use client'

import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Upload, X, User, Mail, Phone, MapPin, Briefcase, Code, FileText, Plus, Link as LinkIcon, Linkedin, Twitter, Facebook, Instagram, Github, Youtube, Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { motion } from "framer-motion"
import ImageGenerator from "./ImageGen"
import ExperienceSelect from "./form/ExperienceSelect"
import SkillsInput from "./form/SkillsInput"
import SocialLinksInput from "./form/SocialLinksInput"

const socialPlatforms = [
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Twitter', icon: Twitter },
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'GitHub', icon: Github },
  { name: 'YouTube', icon: Youtube },
]

const InputField = ({ icon: Icon, name, label, value, onChange, type = "text", required = false }) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-2 text-primary dark:text-primary-dark">
      <Icon size={16} />
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full bg-gray-300 dark:bg-gray-800/10 backdrop-blur-md border-gray-300/50 dark:border-gray-700/50 focus:ring-primary dark:focus:ring-primary-dark rounded-xl"
      required={required}
    />
  </div>
);

export default function UpdateProfileDialog({ open, setOpen }) {
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const [loading, setLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profileCoverPhoto, setProfileCoverPhoto] = useState(null)
  const [resume, setResume] = useState(null)
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    location: user?.profile?.location || "",
    experience: user?.profile?.experience || "",
    skills: [],
    socialLinks: user?.profile?.socialLinks || {},
  })
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user?.profile?.skills) {
      let parsedSkills = user.profile.skills;
      
      if (typeof parsedSkills === 'string') {
        try {
          parsedSkills = JSON.parse(parsedSkills);
        } catch (e) {
          console.error("Error parsing skills:", e);
          parsedSkills = [];
        }
      }
      
      if (Array.isArray(parsedSkills)) {
        parsedSkills = parsedSkills.map(skill => {
          if (typeof skill === 'string') {
            try {
              return JSON.parse(skill);
            } catch (e) {
              return { name: skill, rating: 1 };
            }
          }
          return skill;
        });
      } else {
        parsedSkills = [];
      }
      
      setFormData(prev => ({ ...prev, skills: parsedSkills }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = (newSkill) => {
    if (newSkill.name && !formData.skills.some(skill => skill.name === newSkill.name)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }))
    }
  }

  const handleRemoveSkill = (skillNameToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillNameToRemove)
    }))
  }

  const handleUpdateSkill = (updatedSkill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.name === updatedSkill.name ? updatedSkill : skill
      )
    }))
  }

  const handleAddSocialLink = (platform, link) => {
    if (platform && link.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: link.trim()
        }
      }))
    }
  }

  const handleRemoveSocialLink = (platform) => {
    setFormData(prev => {
      const newSocialLinks = { ...prev.socialLinks }
      delete newSocialLinks[platform]
      return { ...prev, socialLinks: newSocialLinks }
    })
  }

  const handleFileChange = async (e, setFile) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true);
      try {
        // Here you would typically upload the file to your server or cloud storage
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFile(file)
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const submitFormData = new FormData()

    Object.keys(formData).forEach(key => {
      if (key === 'skills' || key === 'socialLinks') {
        submitFormData.append(key, JSON.stringify(formData[key]))
      } else {
        submitFormData.append(key, formData[key])
      }
    })

    if (profilePhoto) {
      submitFormData.append("profilePhoto", profilePhoto)
    }
    if (profileCoverPhoto) {
      submitFormData.append("profileCoverPhoto", profileCoverPhoto)
    }
    if (resume) {
      submitFormData.append("resume", resume)
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      if (res.data.success) {
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
        setOpen(false)
      } else {
        toast.error(res.data.message || "An error occurred.")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const FileUploadArea = ({ type, file, setFile, accept }) => {
    const fileInputRef = useRef(null)

    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    return (
      <div className="relative">
        <div
          className={`mt-2 flex justify-center rounded-2xl border-2 border-dashed border-gray-300/50 dark:border-gray-700/50 px-6 py-10 transition-all duration-300 ease-in-out backdrop-blur-sm ${
            file ? "border-green-500/50 bg-green-50/30 dark:bg-green-900/30" : "hover:border-gray-400/50 dark:hover:border-gray-600/50"
          }`}
        >
          <div className="text-center">
            <Upload className={`mx-auto h-12 w-12 ${file ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-600"}`} aria-hidden="true" />
            <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600 dark:text-gray-400">
              <button
                type="button"
                className="relative cursor-pointer rounded-full font-semibold text-primary dark:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-dark focus-within:ring-offset-2 hover:text-primary/80 dark:hover:text-primary-dark/80"
                onClick={handleClick}
              >
                <span>{file ? `Change ${type}` : `Upload ${type}`}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, setFile)}
                />
              </button>
            </div>
            <p className="text-xs leading-5 text-gray-600 dark:text-gray-400 mt-2">
              {type === "photo" ? "PNG, JPG, GIF up to 10MB" : "PDF up to 10MB"}
            </p>
            {file && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {file.name}
              </p>
            )}
          </div>
        </div>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 rounded-full"
            onClick={() => setFile(null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white/30 dark:bg-gray-900/30 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-3xl">
        <DialogHeader>
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Avatar className="w-full h-full border-4 border-primary dark:border-primary-dark shadow-lg rounded-full">
              <AvatarImage src={user.profile?.profilePhoto || "/placeholder.svg?height=128&width=128"} alt={user.fullname || "User"} />
              <AvatarFallback className="bg-primary dark:bg-primary-dark text-4xl rounded-full">{user.fullname?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary dark:bg-primary-dark rounded-full p-2 cursor-pointer hover:bg-primary-dark dark:hover:bg-primary transition-colors">
              {isUploading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <label htmlFor="profilePhotoInput" className="cursor-pointer">
                  <Camera size={20} className="dark:text-black text-white"/>
                  <input
                    id="profilePhotoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setProfilePhoto)}
                  />
                </label>
              )}
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark">
            Update Your Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={User} name="fullname" label="Full Name" value={formData.fullname} onChange={handleInputChange} required />
            <InputField icon={Mail} name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} required />
            <InputField icon={Phone} name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
            <InputField icon={MapPin} name="location" label="Location" value={formData.location} onChange={handleInputChange} />
          </div>

          <ExperienceSelect value={formData.experience} onChange={(value) => setFormData(prev => ({ ...prev, experience: value }))} />

          <SkillsInput 
            skills={formData.skills} 
            onAddSkill={handleAddSkill} 
            onRemoveSkill={handleRemoveSkill} 
            onUpdateSkill={handleUpdateSkill} 
          />

          <SocialLinksInput
            socialLinks={formData.socialLinks}
            onAddLink={handleAddSocialLink}
            onRemoveLink={handleRemoveSocialLink}
          />

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2 text-primary dark:text-primary-dark">
              <FileText size={16} />
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="resize-none w-full h-32 bg-gray-300 dark:bg-gray-800/10 backdrop-blur-md border-gray-300/50 dark:border-gray-700/50 focus:ring-primary dark:focus:ring-primary-dark rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadArea type="photo" file={profilePhoto} setFile={setProfilePhoto} accept="image/*" label="Profile Photo" />
            <FileUploadArea type="photo" file={profileCoverPhoto} setFile={setProfileCoverPhoto} accept="image/*" label="Profile Cover" />
            <FileUploadArea type="resume" file={resume} setFile={setResume} accept="application/pdf" label="Resume" />
            <div className="md:col-span-2">
              <ImageGenerator />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="dark:text-white shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
         disabled={loading}>
              {loading ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </motion.div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}