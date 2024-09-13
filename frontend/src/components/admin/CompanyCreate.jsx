import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { toast } from "sonner"; // Import toast notification

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(''); // Initialize with an empty string
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    try {
        const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true
        });
        if(res?.data?.success){
            dispatch(setSingleCompany(res.data.company));
            toast.success(res.data.message);
            const companyId = res?.data?.company?._id;
            navigate(`/admin/companies/${companyId}`);
        }
    } catch (error) {
        console.log(error);
    }
}

  return (
    <div>
      <Navbar />
      <div className="my-4 px-4">
        <div>
          <h1 className="font-semibold text-2xl">Your Company Name</h1>
          <p className="text-muted-foreground">
            What would you like to name your company? You can change this later.
          </p>
        </div>
        <div>
          <Label>Company Name</Label>
          <Input
            type="text"
            className="my-2"
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
            value={companyName} // Bind the value to the input
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/companies")}>
              Cancel
            </Button>
            <Button onClick={registerNewCompany}>Continue</Button> {/* Call registerNewCompany on click */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
