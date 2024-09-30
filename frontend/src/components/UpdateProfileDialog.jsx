import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Upload, X, User, Mail, Phone, MapPin, Briefcase, Code, FileText, Plus, Link as LinkIcon, Linkedin, Twitter, Facebook, Instagram, Github, Youtube } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import ImageGenerator from "./ImageGen"

const socialPlatforms = [
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Twitter', icon: Twitter },
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'GitHub', icon: Github },
  { name: 'YouTube', icon: Youtube },
]

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)
  const [loading, setLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
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
  const [newSkill, setNewSkill] = useState("")
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialLink, setNewSocialLink] = useState("")

  useEffect(() => {
    if (user?.profile?.skills) {
      let parsedSkills = user.profile.skills;
      
      if (typeof parsedSkills === 'string') {
        try {
          parsedSkills = JSON.parse(parsedSkills);
        } catch (e) {
          console.error("Error parsing skills:", e);
        }
      }
      
      if (Array.isArray(parsedSkills)) {
        parsedSkills = parsedSkills.map(skill => {
          if (typeof skill === 'string') {
            try {
              return JSON.parse(skill);
            } catch (e) {
              return skill;
            }
          }
          return skill;
        }).flat();
      }
      
      setFormData(prev => ({ ...prev, skills: parsedSkills }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddSocialLink = (e) => {
    e.preventDefault()
    if (newSocialPlatform && newSocialLink.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [newSocialPlatform]: newSocialLink.trim()
        }
      }))
      setNewSocialPlatform("")
      setNewSocialLink("")
    }
  }

  const handleRemoveSocialLink = (platform) => {
    setFormData(prev => {
      const newSocialLinks = { ...prev.socialLinks }
      delete newSocialLinks[platform]
      return { ...prev, socialLinks: newSocialLinks }
    })
  }

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0]
    if (file) {
      setFile(file)
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
          className={`mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-all duration-300 ease-in-out ${
            file ? "border-green-500 bg-green-50" : "hover:border-gray-400"
          }`}
        >
          <div className="text-center">
            <Upload className={`mx-auto h-12 w-12 ${file ? "text-green-500" : "text-gray-400"}`} aria-hidden="true" />
            <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
              <button
                type="button"
                className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
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
            <p className="text-xs leading-5 text-gray-600 mt-2">
              {type === "photo" ? "PNG, JPG, GIF up to 10MB" : "PDF up to 10MB"}
            </p>
            {file && (
              <p className="text-sm text-green-600 mt-2">
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
            className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto bg-primary text-primary-foreground p-1 rounded-full mb-4">
            <Avatar>
              <AvatarImage src={user.profile?.profilePhoto || "/placeholder.svg?height=128&width=128"} alt={user.fullname || "User"} />
              <AvatarFallback>{user.fullname?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Update Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="flex items-center gap-2">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin size={16} />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York, USA"
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience" className="flex items-center gap-2">
              <Briefcase size={16} />
              Years of Experience
            </Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your experience" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year} {year === 1 ? "year" : "years"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills" className="flex items-center gap-2">
              <Code size={16} />
              Skills
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-primary-foreground hover:text-red-300 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-grow"
              />
              <Button type="button" onClick={handleAddSkill} className="shrink-0">
                <Plus size={16} className="mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialLinks" className="flex items-center gap-2">
              <LinkIcon size={16} />
              Social Links
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(formData.socialLinks).map(([platform, link]) => {
                const SocialIcon = socialPlatforms.find(p => p.name === platform)?.icon || LinkIcon
                return (
                  <span key={platform} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                    <SocialIcon size={14} className="mr-1" />
                    {platform}: {link}
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(platform)}
                      className="ml-2 text-primary-foreground hover:text-red-300 focus:outline-none"
                      aria-label={`Remove ${platform} link`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="flex gap-2">
              <Select
                value={newSocialPlatform}
                onValueChange={setNewSocialPlatform}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.name} value={platform.name}>
                      <div className="flex items-center">
                        <platform.icon size={16} className="mr-2" />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="newSocialLink"
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
                placeholder="Profile URL"
                className="flex-grow"
              />
              <Button type="button" onClick={handleAddSocialLink} className="shrink-0">
                <Plus size={16} className="mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText size={16} />
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="resize-none w-full h-32"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <FileUploadArea
                type="photo"
                file={profilePhoto}
                setFile={setProfilePhoto}
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <Label>Resume</Label>
              <FileUploadArea
                type="resume"
                file={resume}
                setFile={setResume}
                accept="application/pdf"
              />
            </div>
            <div className="md:col-span-2">
              <ImageGenerator />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
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

export default UpdateProfileDialog