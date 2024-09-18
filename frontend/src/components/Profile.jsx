import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { CiLocationOn, CiMail, CiPhone } from "react-icons/ci"
import { Clock10, Award, Pickaxe, Edit, Download, ExternalLink, Github, Linkedin, Twitter } from "lucide-react"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false)
  const user = useSelector((store) => store.auth.user)
  const skills = user?.profile?.skills || []
  const [skillProgress, setSkillProgress] = useState({})

  useEffect(() => {
    const progress = skills.reduce((acc, skill) => {
      acc[skill] = Math.floor(Math.random() * 100)
      return acc
    }, {})
    setSkillProgress(progress)
  }, [skills])

  const InfoItem = ({ icon, text }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          {icon}
          <span>{text}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{text}</h4>
            <p className="text-sm">
              Click to copy or edit this information in your profile settings.
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
      <Card className="flex-1">
        <CardContent className="flex items-center gap-4 p-4">
          {icon}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 rounded-md">
                  <AvatarImage src={user.profile?.profilePhoto || "https://i.mydramalist.com/XdvgoJ_5c.jpg"} alt={user.fullname || "User"} />
                  <AvatarFallback>{user.fullname?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">{user.fullname || "User Name"}</h1>
                      <p className="text-muted-foreground">{user.profile?.bio || "No bio available."}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem 
                      icon={<CiLocationOn className="h-5 w-5" />} 
                      text={Array.isArray(user.profile?.location) ? user.profile.location.join(", ") : "Location not specified"} 
                    />
                    <InfoItem icon={<CiPhone className="h-5 w-5" />} text={user.phoneNumber || "N/A"} />
                    <InfoItem icon={<CiMail className="h-5 w-5" />} text={user.email || "N/A"} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock10 className="h-8 w-8 text-primary" />} title="Experience" value={`${user.profile?.experience || "N/A"} Years`} />
          <StatCard icon={<Award className="h-8 w-8 text-primary" />} title="Certificates" value="View" />
          <StatCard icon={<Pickaxe className="h-8 w-8 text-primary" />} title="Skills" value={skills.length} />
        </div>

        <Tabs defaultValue="skills" className="mb-8">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Skills</h3>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {skills.length > 0 ? (
                      skills.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <Badge variant="secondary">{item}</Badge>
                            <span className="text-sm text-muted-foreground">{skillProgress[item]}%</span>
                          </div>
                          <Progress value={skillProgress[item]} className="w-full" />
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No skills listed</span>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resume</h3>
              </CardHeader>
              <CardContent>
                {user.profile?.resume ? (
                  <div className="space-y-4">
                    <Button variant="outline" asChild>
                      <a href={user.profile.resume} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>View Resume Summary</AccordionTrigger>
                        <AccordionContent>
                          {user.profile?.resumeSummary ? (
                            <p className="text-sm text-muted-foreground">
                              {user.profile.resumeSummary}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No resume summary available. Add a summary to highlight your key qualifications and experiences.
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No resume uploaded yet.</p>
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
                <h3 className="text-lg font-semibold">Portfolio</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.profile?.portfolio && user.profile.portfolio.length > 0 ? (
                    user.profile.portfolio.map((item, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <h4 className="text-md font-semibold">{item.title}</h4>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" asChild>
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
                      <p className="text-muted-foreground mb-4">No portfolio items available</p>
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
        </Tabs>

        <Card>
         
            <AppliedJobTable />
      
        </Card>
      </main>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <Toaster />
    </div>
  )
}

export default Profile