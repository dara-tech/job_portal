import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesAdminTable from "./CompaniesAdminTable";
import { useNavigate } from "react-router-dom";

import { SlidersHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import useGetAllAdminCompanies from "@/hooks/useGetAllAdminCompanies";

const AdminCompanies = () => {
  useGetAllAdminCompanies();
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
        
        <div className="my-4">
          <CompaniesAdminTable/>
        </div>
      </div>
    </div>
  );
};

export default AdminCompanies;
