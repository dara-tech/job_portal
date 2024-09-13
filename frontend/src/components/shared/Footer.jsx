import { Facebook, GithubIcon, InstagramIcon, Linkedin, LinkedinIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-w-full text-center dark:bg-gray-900 py-5 border-t-8 border-gray-200 rounded-t-md px-2 justify-between items-center">
      <p className="text-sm font-light">
        Sovandara Choel &copy; {currentYear}
      </p>
      <div className="flex gap-2">
        <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white p-1 rounded cursor-pointer">
          <LinkedinIcon />
        </a>
        <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="bg-black text-white dark:bg-gray-700 p-1 rounded cursor-pointer">
          <GithubIcon/>
        </a>
        <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white dark:bg-gray-700 p-1 rounded cursor-pointer">
          <InstagramIcon/>
        </a>
      </div>
    </div>
  );
};

export default Footer;
