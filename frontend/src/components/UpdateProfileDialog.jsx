import React, { useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
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
import { motion, AnimatePresence } from "framer-motion"

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
    skills: user?.profile?.skills?.join(", ") || "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onDrop = useCallback((acceptedFiles, fileType) => {
    const file = acceptedFiles[0]
    if (fileType === "profilePhoto") {
      setProfilePhoto(file)
    } else if (fileType === "resume") {
      setResume(file)
    }
  }, [])

  const { getRootProps: getProfilePhotoRootProps, getInputProps: getProfilePhotoInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, "profilePhoto"),
    accept: "image/*",
    maxFiles: 1,
  })

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, "resume"),
    accept: "application/pdf",
    maxFiles: 1,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const submitFormData = new FormData()

    Object.keys(formData).forEach(key => {
      submitFormData.append(key, formData[key])
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

  const FileUploadArea = ({ type, file, rootProps, inputProps, onRemove }) => (
    <div className="relative">
      <div
        {...rootProps}
        className={`mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-all duration-300 ease-in-out ${
          file ? "border-green-500 bg-green-50" : "hover:border-gray-400"
        }`}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${file ? "text-green-500" : "text-gray-400"}`} aria-hidden="true" />
          <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
            >
              <span>{file ? `Change ${type}` : `Upload ${type}`}</span>
              <input {...inputProps} className="sr-only" />
            </label>
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
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Update Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
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
              <Label htmlFor="location">Location</Label>
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
            <Label htmlFor="experience">Years of Experience</Label>
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
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="React, Node.js, TypeScript"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your skills separated by commas.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
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
                rootProps={getProfilePhotoRootProps()}
                inputProps={getProfilePhotoInputProps()}
                onRemove={() => setProfilePhoto(null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Resume</Label>
              <FileUploadArea
                type="resume"
                file={resume}
                rootProps={getResumeRootProps()}
                inputProps={getResumeInputProps()}
                onRemove={() => setResume(null)}
              />
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