import React, { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { CiLocationOn, CiMail, CiPhone } from "react-icons/ci"
import { Clock10, Award, Pickaxe, Edit, Download, ExternalLink, Github, Linkedin, Twitter, Upload, Palette, Copy } from "lucide-react"
import { toast, Toaster } from "sonner"
import Navbar from "./shared/Navbar"
import AppliedJobTable from "./AppliedJobTable"
import UpdateProfileDialog from "./UpdateProfileDialog"
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { setThemeColor } from "@/redux/themeSlice"

const Profile = () => {
  useGetAppliedJobs()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const user = useSelector((store) => store.auth.user)
  // const themeColor = useSelector((store) => store.theme.color)
  const skills = user?.profile?.skills || []
  const [skillProgress, setSkillProgress] = useState({})
  const [activeTab, setActiveTab] = useState("skills")

  useEffect(() => {
    const progress = skills.reduce((acc, skill) => {
      acc[skill] = Math.floor(Math.random() * 100)
      return acc
    }, {})
    setSkillProgress(progress)
  }, [skills])



  const InfoItem = ({ icon, text, copyable = false }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200">
          {icon}
          <span>{text}</span>
          {copyable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(text)} aria-label={`Copy ${text}`}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{text}</h4>
            <p className="text-sm">
              {copyable ? "Click the copy icon to copy this information." : "Edit this information in your profile settings."}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )

  const StatCard = ({ icon, title, value }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="flex-1 bg-gradient-to-br from-primary-100 to-primary-200">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 bg-primary-300 rounded-full">{icon}</div>
          <div>
            <p className="text-sm font-medium text-primary-700">{title}</p>
            <h3 className="text-2xl font-bold text-primary-900">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard", {
      description: `${text} has been copied to your clipboard.`,
    })
  }

  const ColorTheme = ({ color, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 rounded-full p-0 border-2"
            style={{ backgroundColor: color }}
            onClick={() => onClick(color)}
            aria-label={`Set theme color to ${color}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Set theme color</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-primary rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300"></div>
            <CardContent className="relative p-6">
              <Avatar className="h-32 w-32 absolute -top-16 left-6 ring-4 ring-background shadow-xl">
                <AvatarImage src={user.profile?.profilePhoto || "/placeholder.svg?height=128&width=128"} alt={user.fullname || "User"} />
                <AvatarFallback>{user.fullname?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="mt-20">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-primary-900">
                      {user.fullname || "User Name"}
                    </h1>
                    <p className="text-primary-700 mt-2">{user.profile?.bio || "No bio available."}</p>
                  </div>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <InfoItem 
                    icon={<CiLocationOn className="h-5 w-5" />} 
                    text={Array.isArray(user.profile?.location) ? user.profile.location.join(", ") : "Location not specified"} 
                  />
                  <InfoItem icon={<CiPhone className="h-5 w-5" />} text={user.phoneNumber || "N/A"} copyable />
                  <InfoItem icon={<CiMail className="h-5 w-5" />} text={user.email || "N/A"} copyable />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock10 className="h-8 w-8 text-primary-600" />} title="Experience" value={`${user.profile?.experience || "N/A"} Years`} />
          <StatCard icon={<Award className="h-8 w-8 text-primary-600" />} title="Certificates" value="View" />
          <StatCard icon={<Pickaxe className="h-8 w-8 text-primary-600" />} title="Skills" value={skills.length} />
        </div>

        <Tabs defaultValue="skills" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 rounded-full p-1 bg-primary-100">
            <TabsTrigger value="skills" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Skills</TabsTrigger>
            <TabsTrigger value="resume" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resume</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Portfolio</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold text-primary-900">Skills</h3>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {skills.length > 0 ? (
                          skills.map((item, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary-100 text-primary-800">{item}</Badge>
                                <span className="text-sm font-medium text-primary-700">{skillProgress[item]}%</span>
                              </div>
                              <Progress value={skillProgress[item]} className="w-full h-2" indicatorClassName="bg-primary" />
                            </div>
                          ))
                        ) : (
                          <span className="text-primary-700">No skills listed</span>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resume">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold text-primary-900">Resume</h3>
                  </CardHeader>
                  <CardContent>
                    {user.profile?.resume ? (
                      <div className="space-y-4">
                        <Button variant="outline" asChild className="w-full">
                          <a href={user.profile.resume} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </a>
                        </Button>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-primary-800">View Resume Summary</AccordionTrigger>
                            <AccordionContent>
                              {user.profile?.resumeSummary ? (
                                <p className="text-sm text-primary-700">
                                  {user.profile.resumeSummary}
                                </p>
                              ) : (
                                <p className="text-sm text-primary-600 italic">
                                  No resume summary available. Add a summary to highlight your key qualifications and experiences.
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-primary-700 mb-4">No resume uploaded yet.</p>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Resume
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold text-primary-900">Portfolio</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.profile?.portfolio && user.profile.portfolio.length > 0 ? (
                        user.profile.portfolio.map((item, index) => (
                          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <img src={`https://source.unsplash.com/random/400x300?${index}`} alt="Project preview" className="w-full h-48 object-cover" />
                            <CardHeader>
                              <h4 className="text-lg font-semibold text-primary-800">{item.title}</h4>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-primary-600">{item.description}</p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" asChild className="w-full">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Project
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-primary-700 mb-4">No portfolio items available</p>
                          <Button variant="outline" onClick={() => setOpen(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Add Portfolio Item
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <Card>
          <AppliedJobTable />
        </Card>
      </main>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <Toaster />

      {/* Floating Action Button for quick edit */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary-600"
                onClick={() => setOpen(true)}
              >
                <Edit className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  )
}

export default Profile