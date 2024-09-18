import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit3, Trash2 } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { COMPANY_API_END_POINT } from "@/utils/constant";


const CompaniesTable = () => {
  const { companies = [], loading, searchCompanyByText } = useSelector((store) => store.company);
  const { authToken } = useSelector((store) => store.auth);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompanies = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompanies);
  }, [companies, searchCompanyByText]);

  const handleDelete = async (companyId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this company? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setFilterCompany(filterCompany.filter((company) => company._id !== companyId));
      } else {
        console.error("Failed to delete company", response.status, response.data);
      }
    } catch (error) {
      console.error("Error deleting company", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(5)
              .fill()
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton circle={true} height={40} width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={20} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton height={20} width={60} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton height={20} width={50} />
                  </TableCell>
                </TableRow>
              ))
          ) : filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You haven't registered any company yet
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={company.logo || "default_logo_url"}
                      alt={`${company.name} logo`}
                      className="object-cover h-full w-full"
                    />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger>
                      <button className="p-2 cursor-pointer" aria-label="More actions">
                        <MoreHorizontal />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="font-semibold text-sm">Edit</span>
                      </div>
                      <div
                        onClick={() => handleDelete(company._id)}
                        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-semibold text-sm">Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
