import React, { useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Loader2, Upload, X, User, Mail, Phone, MapPin, Briefcase, Code, FileText, Plus, Link as LinkIcon, Linkedin, Twitter, Facebook, Instagram, Github, Youtube } from "lucide-react"
const socialPlatforms = [
    { name: 'LinkedIn', icon: Linkedin },
    { name: 'Twitter', icon: Twitter },
    { name: 'Facebook', icon: Facebook },
    { name: 'Instagram', icon: Instagram },
    { name: 'GitHub', icon: Github },
    { name: 'YouTube', icon: Youtube },
  ]

const SocialLinksInput = ({ socialLinks, onAddLink, onRemoveLink }) => {
    const [newSocialPlatform, setNewSocialPlatform] = useState('');
    const [newSocialLink, setNewSocialLink] = useState('');
    const [error, setError] = useState('');

    const handleAddLink = () => {
        if (!newSocialPlatform) {
            setError('Please select a platform');
            return;
        }
        if (!newSocialLink.trim()) {
            setError('Please enter a URL');
            return;
        }

        // Updated URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(newSocialLink)) {
            setError('Please enter a valid URL');
            return;
        }

        onAddLink(newSocialPlatform, newSocialLink.trim());
        setNewSocialPlatform('');
        setNewSocialLink('');
        setError('');
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="socialLinks" className="flex items-center gap-2 text-primary">
                <LinkIcon size={16} />
                Social Links
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
                {Object.entries(socialLinks).map(([platform, link]) => (
                    <span key={platform} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md transition-all duration-300 hover:shadow-lg">
                        {React.createElement(socialPlatforms.find(p => p.name === platform)?.icon, { size: 16, className: 'mr-2' })}
                        {platform}: {link}
                        <X
                            size={16}
                            className="ml-2 cursor-pointer"
                            onClick={() => onRemoveLink(platform)}
                        />
                    </span>
                ))}
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
                <Select
                    value={newSocialPlatform}
                    onValueChange={(value) => {
                        setNewSocialPlatform(value);
                        setError('');
                    }}
                >
                    <SelectTrigger className="w-full bg-gray-300 dark:bg-gray-800 dark:border-gray-700">
                        <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:text-white text-black dark:border-gray-700">
                        {socialPlatforms.map((platform) => (
                            <SelectItem key={platform.name} value={platform.name} className="dark:text-white text-black hover:bg-gray-700">
                                <div className="flex items-center">
                                    <span className="mr-2">{React.createElement(platform.icon)}</span>
                                    {platform.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    id="newSocialLink"
                    value={newSocialLink}
                    onChange={(e) => {
                        setNewSocialLink(e.target.value);
                        setError('');
                    }}
                    placeholder={`Enter ${newSocialPlatform || 'social media'} profile URL`}
                    className="flex-grow bg-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:ring-primary"
                />
                <Button
                    type="button"
                    onClick={handleAddLink}
                    className="dark:text-white shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                >
                    <Plus size={16} className="mr-2" />
                    Add
                </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default SocialLinksInput;