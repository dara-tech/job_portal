import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MoreHorizontal, ClipboardCopy, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector((state) => state.application);
    const [copiedEmail, setCopiedEmail] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            const response = await axios.put(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred while updating status");
        }
    };

    const handleCopy = (email) => {
        navigator.clipboard.writeText(email).then(() => {
            setCopiedEmail(email);
            toast.success("Email copied to clipboard");
            setTimeout(() => setCopiedEmail(null), 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy email");
        });
    };

    if (!applicants || !applicants.applications || applicants.applications.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-lg font-semibold text-gray-600">No applicants found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableCaption>A list of recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants.applications.map((applicant) => (
                        <TableRow key={applicant._id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={applicant?.applicant?.profile?.profilePhoto} alt={applicant?.applicant?.fullname || 'Unknown Applicant'} />
                                        <AvatarFallback>{applicant?.applicant?.fullname?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{applicant?.applicant?.fullname || 'N/A'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {applicant?.applicant?.email ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleCopy(applicant.applicant.email)}
                                    >
                                        <span className="sr-only">Copy email</span>
                                        <ClipboardCopy className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    'N/A'
                                )}
                            </TableCell>
                            <TableCell>{applicant?.applicant?.phoneNumber || 'N/A'}</TableCell>
                            <TableCell>
                                {applicant.applicant?.profile?.resume ? (
                                    <a 
                                        href={applicant.applicant.profile.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span>Resume</span>
                                    </a>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(applicant.applicant.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40">
                                        {shortlistingStatus.map((status) => (
                                            <Button
                                                key={status}
                                                variant="ghost"
                                                className="w-full justify-start font-normal"
                                                onClick={() => statusHandler(status, applicant._id)}
                                            >
                                                {status}
                                            </Button>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;