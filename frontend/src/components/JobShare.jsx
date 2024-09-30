import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Link, QrCode, Smile } from 'lucide-react'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'

const JobShare = ({ jobId, jobTitle, jobDescription }) => {
  const [activeTab, setActiveTab] = useState('qr')
  const [copied, setCopied] = useState(false)
  
  const shareUrl = `${JOB_API_END_POINT}/description/${jobId}`
  const qrContent = `Job: ${jobTitle}\nID: ${jobId}\nDescription: ${jobDescription}\n${shareUrl}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Great! The link is copied and ready to share.", {
      icon: <Smile className="w-5 h-5 text-green-500" />
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-80 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-center">Share This Awesome Job!</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="qr" className="text-sm">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="link" className="text-sm">
              <Link className="w-4 h-4 mr-2" />
              Quick Link
            </TabsTrigger>
          </TabsList>
          <TabsContent value="qr" className="mt-0">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-white rounded-xl shadow-inner">
                <QRCodeSVG value={qrContent} size={180} />
              </div>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Scan this code to instantly share the job details with a friend!
              </p>
            </div>
          </TabsContent>
          <TabsContent value="link" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Here's a quick link to share this amazing opportunity:
              </p>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-800 dark:text-gray-200 break-all">{shareUrl}</p>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCopyLink}
              >
                {copied ? "Copied! 🎉" : "Copy Link to Share"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default JobShare