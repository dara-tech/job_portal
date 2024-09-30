import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import CategoryCarousel from "./CategoryCarousel";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (e) => {
    e.preventDefault();  // Prevent form submission
    if (query.trim()) {  // Only proceed if query is not empty
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  }

  return (
    <div className="text-center">
      <div className="flex-1 mt-10 mb-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
          No.1 Job for Fresher Student Website
        </h1>
        <p className="text-gray-600 dark:text-gray-200 text-muted-foreground text-xs">
          We're working on your personalized job feed
        </p>
      </div>
      <div className="flex items-center justify-center">
        <form onSubmit={searchJobHandler} className="flex items-center ring-1 ring-gray-200 dark:ring-gray-700 rounded px-2 gap-4">
          <Input
            type="text"
            placeholder="Find your dream job"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-fit items-center justify-center"
          />
          <button 
            type="submit" 
            aria-label="Search for jobs"
            className="ring-1 ring-gray-200 dark:ring-gray-700 px-1 rounded-md cursor-pointer bg-gray-200 dark:bg-gray-700"
          >
            <Search className="w-4 text-gray-700 dark:text-white hover:animate-pulse" />
          </button>
        </form>
        <div className="ml-2">
          <CategoryCarousel />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
