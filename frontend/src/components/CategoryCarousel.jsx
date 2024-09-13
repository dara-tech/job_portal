import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const categories = [
  "Software Development",
  "Data Science",
  "Web Development",
  "Digital Marketing",
  "Graphic Design",
  "Content Writing",
  "Sales & Marketing",
  "Customer Support",
  "Human Resources",
  "Business Development",
  "Finance & Accounting",
  "Quality Assurance (QA)",
  "IT Support",
  "Project Management",
  "Administrative Assistant",
  "Product Management",
  "UI/UX Design",
  "Network Engineering",
  "Operations Management",
  "Supply Chain Management",
];

const CategoryDropdown = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (category) => {
    setQuery(category);
    dispatch(setSearchedQuery(category));
    navigate('/browse');
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Category</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-40 overflow-y-auto">
          {categories.map((category, index) => (
            <DropdownMenuItem 
              key={index}
              onClick={() => searchJobHandler(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryDropdown;
