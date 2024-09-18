import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, ClipboardCopy } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector((state) => state.application);
    const [copiedEmail, setCopiedEmail] = useState(null); // For copied email state

    const statusHandler = async (status, id) => {
        try {
            const response = await axios.put(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    };

    // Handle copy email
    const handleCopy = (email) => {
        navigator.clipboard.writeText(email).then(() => {
            setCopiedEmail(email);
            setTimeout(() => setCopiedEmail(null), 2000); // Reset after 2 seconds
        }).catch(err => console.error("Failed to copy text: ", err));
    };

    if (!applicants || !applicants.applications || applicants.applications.length === 0) {
        return <p>No applicants found.</p>;
    }

    return (
        <Table>
            <TableCaption>A list of recent applied users</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {applicants.applications.map((applicant) => (
                    <TableRow key={applicant._id}>
                        {/* Full Name and Profile Photo */}
                        <TableCell className="flex gap-2 items-center">
                            {applicant?.applicant?.profile?.profilePhoto ? (
                                <img
                                    src={applicant?.applicant?.profile?.profilePhoto}
                                    alt={applicant?.applicant?.fullname || 'Unknown Applicant'}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                'N/A'
                            )}
                            {applicant?.applicant?.fullname || 'N/A'}
                        </TableCell>

                        {/* Email with Copy-to-Clipboard */}
                        <TableCell className="text-center">
                            {applicant?.applicant?.email ? (
                                <div className="relative inline-block">
                                    <button
                                        onClick={() => handleCopy(applicant?.applicant?.email)}
                                        className="focus:outline-none"
                                    >
                                        <ClipboardCopy className="w-5 h-5 cursor-pointer" />
                                    </button>
                                    <span
                                        className={`absolute left-full ml-2 whitespace-nowrap ${copiedEmail === applicant?.applicant?.email ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 bg-gray-700 text-white text-xs rounded py-1 px-2`}
                                    >
                                        {copiedEmail === applicant?.applicant?.email ? 'Copied!' : 'Click to copy'}
                                    </span>
                                </div>
                            ) : (
                                'N/A'
                            )}
                        </TableCell>

                        {/* Contact */}
                        <TableCell>{applicant?.applicant?.phoneNumber || 'N/A'}</TableCell>

                        {/* Resume Download */}
                        <TableCell>
                            {applicant.applicant?.profile?.resume ? (
                                <a 
                                    className="text-blue-600 cursor-pointer" 
                                    href={applicant.applicant.profile.resume} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Download Resume
                                </a>
                            ) : (
                                <span>N/A</span>
                            )}
                        </TableCell>

                        {/* Date */}
                        <TableCell>{new Date(applicant.applicant.createdAt).toLocaleDateString()}</TableCell>

                        {/* Action */}
                        <TableCell className="text-right">
                            <Popover>
                                <PopoverTrigger>
                                    <MoreHorizontal />
                                </PopoverTrigger>
                                <PopoverContent className="w-30 mr-2">
                                    {shortlistingStatus.map((status) => (
                                        <div
                                            key={status}
                                            onClick={() => statusHandler(status, applicant._id)}
                                            className="flex w-full items-center my-2 dark:hover:text-black cursor-pointer hover:bg-gray-100 p-1 rounded"
                                        >
                                            <span className="text-sm font-semibold text-muted-foreground hover:text-teal-800 px-2 ">{status}</span>
                                        </div>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ApplicantsTable;
