import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { BrushIcon, Filter, RouteOff } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { MdClearAll } from "react-icons/md";

const filterData = [
  {
    filterType: "Location",
    array: ["Banteay Meanchey", "Battambang", "Kandal"],
  },
  {
    filterType: "Industry",
    array: ["Software Development", "Data Science"],
  },
  {
    filterType: "Salary",
    array: ["0-100", "100-1000", "1000-10K"],
  },
];

const FilterCard = ({ setSortOrder }) => {
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("jobFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          Location: "Select Location",
          Industry: "Select Industry",
          Salary: "Select Salary",
        };
  });

  const [sortOrder, setSortOrderState] = useState("latest"); // Maintain sortOrder state

  const dispatch = useDispatch();

  useEffect(() => {
    const activeFilters = Object.values(selectedFilters).filter(
      (filter) =>
        filter !== "Location" &&
        filter !== "Industry" &&
        filter !== "Salary"
    );

    dispatch(setSearchedQuery(activeFilters.join(" ")));

    // Save filters to local storage
    localStorage.setItem("jobFilters", JSON.stringify(selectedFilters));
  }, [selectedFilters, dispatch]);

  const handleSelect = (filterType, item) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterType]: item,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      Location: "Location",
      Industry: "Industry",
      Salary: "Salary",
    });
    localStorage.removeItem("jobFilters");
  };

  const handleSortChange = (value) => {
    setSortOrderState(value);
    setSortOrder(value); // Pass the selected value to the parent component
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center text-xs font-semibold gap-2">
        {filterData.map((filter) => (
          <DropdownMenu key={filter.filterType}>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer text-start dark:bg-gray-800 rounded-md py-2 px-2 border border-gray-300 p-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {selectedFilters[filter.filterType]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {filter.array.map((item, itemIndex) => (
                <DropdownMenuItem
                  key={itemIndex}
                  className="hover:bg-gray-200"
                  onClick={() => handleSelect(filter.filterType, item)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        <div className="flex gap-2 items-center">
          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="text-sm text-blue-800 border border-blue-800 rounded-md py-1.5 px-2 hover:bg-blue-500 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <RouteOff className="w-4 h-4" /> Clear
            </span>
          </button>
          {/* Sort Dropdown with Icon */}
          <div className="relative">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Sort by Latest</SelectItem>
                <SelectItem value="salary">Sort by Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCard;
