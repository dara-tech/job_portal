import React, { useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "@/redux/authSlice"
import { toast } from "sonner"
import { Loader2, Upload } from "lucide-react"
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York, USA"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
            >
              <SelectTrigger>
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
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="React, Node.js, TypeScript"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter your skills separated by commas.
            </p>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Profile Photo</Label>
              <div
                {...getProfilePhotoRootProps()}
                className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
                  profilePhoto ? "border-green-500" : ""
                }`}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white px-2 mb-2 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>{profilePhoto ? "Change photo" : "Upload a photo"}</span>
                      <input {...getProfilePhotoInputProps()} className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div>
              <Label>Resume</Label>
              <div
                {...getResumeRootProps()}
                className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
                  resume ? "border-green-500" : ""
                }`}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white px-2 mb-2 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>{resume ? "Change resume" : "Upload a resume"}</span>
                      <input {...getResumeInputProps()} className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PDF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
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