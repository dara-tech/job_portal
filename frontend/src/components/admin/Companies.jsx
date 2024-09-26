import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { SlidersHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const [input,setInput] = useState('');
  const navigate = useNavigate();
   // Correctly calling the hook to get the navigate function
   const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setSearchCompanyByText(input))
  }, [input])
  return (
    <div>
      {/* <Navbar /> */}
      <div className="px-2 mt-4">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center ring-1 ring-gray-200 rounded-md dark:ring-gray-700 cursor-pointer">  
            <SlidersHorizontal className="ml-2 w-4 h-4 hover:animate-spin"/>
            <Input placeholder="Filter by name "
            className="border-none"
            onChange={(e)=> setInput(e.target.value)}

          /></div>
         
          <Button onClick={() => navigate("/admin/companies/create")}>
            Add Company
          </Button>
        </div>
        <div className="my-4">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
