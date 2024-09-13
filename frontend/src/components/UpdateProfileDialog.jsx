import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    location: user?.profile?.location || "",
    experience: user?.profile?.experience || "",
    skills: user?.profile?.skills || "",
    resume: null, // Resume file
    profilePhoto: null, // Profile photo file
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const { name, files } = e.target;
    setInput({ ...input, [name]: files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("location", input.location);
    formData.append("experience", input.experience);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.resume) {
      formData.append("resume", input.resume);
    }
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      } else {
        toast.error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="max-h-screen">
      <DialogContent
        className="sm:max-w-[425px] max-h-full overflow-y-auto"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogTitle>Update Profile</DialogTitle>
        <form onSubmit={submitHandler} className="flex flex-col gap-2">
          <div className="grid gap-4">
            <div className="justify-center items-center gap-2">
              <Label className="items-start">Name</Label>
              <Input
                id="name"
                type="text"
                name="fullname"
                placeholder="Enter your name"
                value={input.fullname}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={input.email}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Location</Label>
              <Input
                id="location"
                type="text"
                name="location"
                placeholder="Enter your location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Year Experience</Label>
              <Input
                id="experience"
                type="number"
                name="experience"
                placeholder="Enter your experience"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Phone</Label>
              <Input
                id="number"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={input.phoneNumber}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Bio</Label>
              <Input
                id="bio"
                name="bio"
                placeholder="Enter your bio"
                value={input.bio}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Skills</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="Enter your skills"
                value={input.skills}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          {/* Profile Photo Upload */}
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Profile Photo</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
              />
            </div>
          </div>
          {/* Resume Upload */}
          <div className="grid gap-2">
            <div className="justify-center items-center gap-2">
              <Label>Resume</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="mt-2 w-full">
              <Button
                type={loading ? "button" : "submit"}
                className="w-full py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
