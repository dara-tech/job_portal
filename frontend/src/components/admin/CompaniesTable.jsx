import React, { useEffect, useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Edit3, FilePenLine } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies = [], loading, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate()

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
  }, [companies, searchCompanyByText]);

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
          ) : filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You haven't registered any company yet
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
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
                    <PopoverTrigger asChild>
                      <button
                        className="p-2 cursor-pointer"
                        aria-label="Edit Company"
                      >
                        <FilePenLine className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div onClick={()=>navigate(`/admin/companies/${company._id}`)}
                       className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                        <span className="font-semibold text-sm">Edit</span>
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
