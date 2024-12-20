import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Phone, Mail, Share2, ExternalLink, Linkedin, Twitter, Facebook, Instagram, Github, Youtube, Globe, Palette, Sparkles, Download, Briefcase, Award, Building2 } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInView } from 'react-intersection-observer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const socialIcons = {
    LinkedIn: Linkedin,
    Twitter: Twitter,
    Facebook: Facebook, 
    Instagram: Instagram,
    GitHub: Github,
    YouTube: Youtube,
    Website: Globe
}

const themes = {
    default: {
        primary: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        secondary: 'bg-gradient-to-r from-blue-700 to-indigo-800',
    },
    sunset: {
        primary: 'bg-gradient-to-r from-orange-400 to-pink-500',
        secondary: 'bg-gradient-to-r from-orange-600 to-pink-700',
    },
    forest: {
        primary: 'bg-gradient-to-r from-green-400 to-teal-500',
        secondary: 'bg-gradient-to-r from-green-600 to-teal-700',
    },
    ocean: {
        primary: 'bg-gradient-to-r from-blue-400 to-cyan-500',
        secondary: 'bg-gradient-to-r from-blue-600 to-cyan-700',
    },
    lavender: {
        primary: 'bg-gradient-to-r from-purple-400 to-pink-400',
        secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    },
    neon: {
        primary: 'bg-gradient-to-r from-yellow-300 via-green-300 to-pink-300',
        secondary: 'bg-gradient-to-r from-yellow-500 via-green-500 to-pink-500',
    },
    modern: {
        primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
        secondary: 'bg-gradient-to-r from-blue-700 to-purple-700',
    }
}

const NameCard = ({ user, socialLinks }) => {
    const [qrValue, setQrValue] = useState('');
    const [theme, setTheme] = useState('default');
    const [isHovering, setIsHovering] = useState(false);
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const controls = useAnimation();
    const [showQRCode, setShowQRCode] = useState(false);

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    useEffect(() => {
        setQrValue(`${window.location.origin}/profile/${user?.id || ''}`);
    }, [user?.id]);

    const exportNameCard = useCallback(() => {
        const nameCardElement = document.getElementById('name-card');
        html2canvas(nameCardElement, { scale: 2, logging: false, useCORS: true }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `${user?.fullname || 'User'}_digital_business_card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }, [user?.fullname]);

    const randomEmoji = useMemo(() => {
        const emojis = ['🚀', '💼', '🌟', '🔥', '💡', '🌈', '🎨', '🎭', '🎬', '📚'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }, []);

    return (
        <Card ref={ref} className="mt-8 shadow-xl transition-all duration-300 hover:shadow-2xl font-sans">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
                <motion.h3
                    className="text-2xl sm:text-3xl font-bold flex items-center tracking-tight text-black dark:text-white mb-4 sm:mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={controls}
                    variants={{
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                >
                    Digital Business Card
                    <Sparkles className="ml-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 animate-pulse" />
                </motion.h3>
                <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Select
                        onValueChange={(value) => {
                            setTheme(value);
                            localStorage.setItem('preferredTheme', value);
                        }}
                        defaultValue={localStorage.getItem('preferredTheme') || theme}
                    >
                        <SelectTrigger className="w-[150px] sm:w-[180px] transition-all duration-300 hover:shadow-md">
                            <Palette className="mr-2 h-4 w-4 animate-pulse" />
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <AnimatePresence>
                                {Object.keys(themes).map((themeName, index) => (
                                    <motion.div
                                        key={themeName}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <SelectItem value={themeName}>
                                            <span className="flex items-center">
                                                <span className={`w-3 h-3 rounded-full mr-2 ${themes[themeName].primary}`}></span>
                                                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                                            </span>
                                        </SelectItem>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </SelectContent>
                    </Select>
                </motion.div>
            </CardHeader>
            <CardContent>
                <motion.div
                    id="name-card"
                    className={`${themes[theme].primary} p-4 sm:p-8 rounded-lg shadow-2xl max-w-md mx-auto text-white relative overflow-hidden`}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.5,
                                when: "beforeChildren",
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <motion.div
                        className="absolute top-4 right-4 text-5xl"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: isHovering ? 1 : 0, rotate: isHovering ? 0 : -180 }}
                        transition={{ duration: 0.3 }}
                    >
                        {randomEmoji}
                    </motion.div>
                    <motion.div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mb-4 sm:mb-0 sm:mr-6 ring-4 ring-white shadow-xl">
                            <AvatarImage src={user?.profile?.profilePhoto || "/placeholder.svg?height=128&width=128"} alt={user?.fullname || "User"} />
                            <AvatarFallback>{user?.fullname?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">{user?.fullname || "User Name"}</h2>
                            <p className="text-base sm:text-lg opacity-90 mb-3 leading-relaxed">{user?.profile?.bio || "Professional Bio"}</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center mt-2 cursor-pointer">
                                            <Briefcase className="h-5 w-5 mr-2" />
                                            <span className="text-lg font-medium">{user?.profile?.jobTitle || "Hiring"}</span>
                                            {user?.profile?.experience && (
                                                <Badge variant="secondary" className="ml-2 text-sm bg-white/20 text-white px-2 py-1 rounded-full shadow-md hover:bg-white/30 transition-colors duration-300">
                                                    {user?.profile?.experience}+ years
                                                </Badge>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{user?.profile?.jobDescription || "No job description available"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {user?.profile?.skills ? (
                                        (Array.isArray(user.profile.skills) 
                                            ? user.profile.skills 
                                            : typeof user.profile.skills === 'string'
                                                ? user.profile.skills.split(',')
                                                : [user.profile.skills]
                                        ).map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-sm px-3 py-1 bg-white/10 text-white rounded-full border border-white/30 hover:bg-white/20 transition-colors duration-300">
                                                {typeof skill === 'string' ? skill.trim() : (skill.name || JSON.stringify(skill))}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm">Skills not specified</span>
                                    )}
                                </div>
                            </div>
                            {user?.profile?.company && (
                                <motion.div 
                                    className="flex items-center mt-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Building2 className="h-5 w-5 mr-2" />
                                    <span className="text-lg">{user.profile.company}</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                    <motion.div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                        <div className="space-y-3 sm:space-y-4 flex-1 w-full sm:w-auto mb-4 sm:mb-0">
                            <motion.p whileHover={{ x: 5 }} className="flex items-center text-base sm:text-lg"><MapPin className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />{Array.isArray(user?.profile?.location) ? user.profile.location.join(", ") : "Location not specified"}</motion.p>
                            <motion.p whileHover={{ x: 5 }} className="flex items-center text-base sm:text-lg"><Phone className="mr-3 h-5 w-5 sm:h-6 sm:w-6" /><a href={`tel:${user?.phoneNumber}`} className="hover:underline">{user?.phoneNumber || "Phone number"}</a></motion.p>
                            <motion.p whileHover={{ x: 5 }} className="flex items-center text-base sm:text-lg"><Mail className="mr-3 h-5 w-5 sm:h-6 sm:w-6" /><a href={`mailto:${user?.email}`} className="hover:underline">{user?.email || "Email address"}</a></motion.p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="mt-4 sm:mt-0 bg-white/10 hover:bg-white/20 text-white border-white/30"
                                    onClick={() => setShowQRCode(true)}
                                >
                                    <QRCodeSVG value={qrValue} size={24} className="mr-2" />
                                    Show QR Code
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <div className="flex flex-col items-center justify-center p-6">
                                    <QRCodeSVG value={qrValue} size={200} level="H" includeMargin={true} />
                                    <p className="mt-4 text-sm text-gray-500">Scan this QR code to view the profile</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                    <motion.div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/30" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                        <AnimatePresence>
                            {Object.entries(socialLinks).map(([platform, link], index) => {
                                const Icon = socialIcons[platform] || ExternalLink
                                return (
                                    <motion.a
                                        key={platform}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-blue-200 transition-colors duration-200 flex items-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
                                        <span className="text-base sm:text-lg">{platform}</span>
                                    </motion.a>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button onClick={exportNameCard} className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 group text-base sm:text-lg py-4 sm:py-6">
                    <Download className="mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                    Export Card
                </Button>
                <Button 
                    className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 group text-base sm:text-lg py-4 sm:py-6"
                    onClick={() => {
                        navigator.share({
                            title: `${user?.fullname}'s Digital Business Card`,
                            text: 'Check out my digital business card!',
                            url: `${window.location.origin}/profile/${user?.id || ''}`,
                        }).catch((error) => console.log('Error sharing', error));
                    }}
                >
                    <Share2 className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Share Card
                </Button>
            </CardFooter>
        </Card>
    );
};

export default React.memo(NameCard);