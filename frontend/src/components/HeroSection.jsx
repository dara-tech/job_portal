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
    <div className="text-center perspective-1000 transform-gpu">
      <div className="flex-1 mt-10 mb-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text animate-gradient">
          No.1 Job for Fresher Student Website
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
          We're working on your personalized job feed
        </p>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <form onSubmit={searchJobHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <Input
            type="text"
            placeholder="Find your dream job"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-64 px-6 py-3 text-gray-700 dark:text-gray-200"
          />
          <button 
            type="submit" 
            aria-label="Search for jobs"
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-r-full hover:from-green-500 hover:to-blue-600 transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        <div className="transform hover:scale-105 transition-transform duration-300">
          <CategoryCarousel />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
