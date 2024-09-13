import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CiLocationOn, CiMail, CiPhone } from "react-icons/ci";
import { Clock10, Award, Pickaxe } from "lucide-react";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const skills = user?.profile?.skills || [];

  return (
    <div>
      <Navbar />
      <div className="flex mt-4 items-center justify-between">
        <div className="flex w-full gap-6  p-4 ring-1 ring-gray-200 dark:ring-gray-700 rounded-md">
          <div className="flex gap-4  ">
            <div>
              <Avatar className="h-[110px] w-[110px] rounded-md">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://i.mydramalist.com/XdvgoJ_5c.jpg"
                  }
                />
              </Avatar>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl flex ">
                {user?.fullname || "User Name"}
              </h1>
              <p className="font-light text-xs text-muted-foreground">
                {user?.profile?.bio || "No bio available."}
              </p>
              <div className="flex gap-2 mt-2 my-2 ">
                <div>
                  <span
                    className="cursor-pointer bg-teal-700 rounded text-white px-2 py-1 text-xs"
                    onClick={() => setOpen(true)}
                  >
                    Edit
                  </span>
                </div>
                <div>
                  <span className="ring-1 dark:ring-gray-800 ring-gray-200 rounded text-gray-400 px-2 py-1 text-xs">
                    Public
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 mb-2">
                <CiLocationOn className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {Array.isArray(user?.profile?.location)
                    ? user.profile.location.join(", ")
                    : "Location not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-2 mb-2">
                <CiPhone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 mb-2">
                <CiMail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.email || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex gap-2 mt-4 px-4 justify-between items-center">
          <span className="flex gap-2 ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 rounded text-gray-400 px-3 py-1 text-xs items-center">
            <Clock10 />
            <div className="flex flex-col">
              <h1 className="text-gray-700 dark:text-muted-foreground font-bold text-sm">
                {user?.profile?.experience || "N/A"} Year
              </h1>
              <span className="text-xs">Experienced</span>
            </div>
          </span>
          <span className="flex gap-2 ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 rounded text-gray-400 px-3 py-1 text-xs items-center">
            <Award />
            <div className="flex flex-col">
              <h1 className="text-gray-700 dark:text-muted-foreground font-bold text-sm">
                Certificate
              </h1>
              <span className="text-xs">Achievement</span>
            </div>
          </span>
          <span className="flex gap-2 ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-gray-800 rounded text-gray-400 px-3 py-1 text-xs items-center">
            <Pickaxe />
            <div className="flex flex-col">
              <h1 className="text-gray-700 dark:text-muted-foreground font-bold text-sm">
                Skill
              </h1>
              <span className="text-xs">
                {skills.length > 0 ? skills[0] : "No skills listed"}
              </span>
            </div>
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {skills.length > 0 ? (
          skills.map((item, index) => (
            <span
              className="ring-1 ring-gray-200 dark:ring-gray-700 px-2 rounded text-muted-foreground font-base text-sm"
              key={index}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="ring-1 ring-gray-200 dark:ring-gray-700 px-2 rounded text-muted-foreground font-base text-sm">
            Don't have skills listed
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 justify-center mt-4 border-t-2 space-y-2">
        <label className="text-sm font-semibold flex items-start mt-2">
          Resume:
        </label>
        {user?.profile?.resume ? (
          <a
            href={user.profile.resume}
            download
            className="text-blue-500 hover:underline cursor-pointer text-sm"
            aria-label="Download the resume"
          >
            Download Resume
          </a>
        ) : (
          <span className="text-gray-500 text-sm">N/A</span>
        )}
      </div>

      <div className="px-2 ">
        <div>  <AppliedJobTable /></div>
      
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
