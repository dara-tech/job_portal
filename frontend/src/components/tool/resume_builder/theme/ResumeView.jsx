import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { layouts } from './theme'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RESUME_API_ENDPOINT } from '@/utils/constant'
import { Download, Share } from 'lucide-react'
import { toast } from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ResumeView({ onResumeChange }) {
  const [selectedTheme, setSelectedTheme] = useState('Classic')
  const [resume, setResume] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [fileName, setFileName] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const { id } = useParams()
  const navigate = useNavigate()
  const resumeRef = useRef(null)

  const fetchResume = useCallback(async () => {
    try {
      const response = await axios.get(`${RESUME_API_ENDPOINT}/${id}`, {
        withCredentials: true
      })
      if (response.data && response.data.resume) {
        setResume(response.data.resume)
        onResumeChange(response.data.resume)
        setFileName(response.data.resume.title || 'resume')
      } else {
        toast.error("Invalid resume data received")
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to fetch resume")
    } finally {
      setIsLoading(false)
    }
  }, [id, onResumeChange])

  useEffect(() => {
    fetchResume()
  }, [fetchResume])

  useEffect(() => {
    if (onResumeChange && resume) {
      onResumeChange(resume)
    }
  }, [resume, onResumeChange])

  const handleThemeChange = (value) => {
    setSelectedTheme(value)
  }

  const handleDownload = async () => {
    setShowDownloadOptions(true)
  }

  const downloadFile = async () => {
    setDownloadProgress(0)
    const intervalId = setInterval(() => {
      setDownloadProgress((prev) => Math.min(prev + 10, 90))
    }, 100)

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY
      })
      const imageDataUrl = canvas.toDataURL('image/png')

      if (downloadFormat === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: 'a4'
        })
        pdf.addImage(imageDataUrl, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight())
        pdf.save(`${fileName}.pdf`)
      } else if (downloadFormat === 'png') {
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = `${fileName}.png`
        link.click()
      }
      setDownloadProgress(100)
      toast.success(`Resume downloaded as ${downloadFormat.toUpperCase()} successfully`)
    } catch (error) {
      console.error("Error downloading file:", error)
      toast.error("Failed to download resume")
    } finally {
      clearInterval(intervalId)
      setShowDownloadOptions(false)
    }
  }

  const handleShare = async () => {
    try {
      const response = await axios.post(`${RESUME_API_ENDPOINT}/${id}/share`, {}, {
        withCredentials: true
      })
      if (response.data && response.data.shareUrl) {
        navigator.clipboard.writeText(response.data.shareUrl)
        toast.success("Share link copied to clipboard")
      }
    } catch (error) {
      console.error("Error sharing resume:", error)
      toast.error("Failed to generate share link")
    }
  }

  const handleEdit = () => {
    navigate(`/resume/${id}/edit`)
  }

  const SelectedLayout = layouts.find(layout => layout.name === selectedTheme)?.component

  const isResumeValid = resume && resume.personalInfo

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">{resume.title || 'Resume Preview'}</h2>
        <div className="flex gap-2">
          <Select onValueChange={handleThemeChange} defaultValue={selectedTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {layouts.map((layout) => (
                <SelectItem key={layout.name} value={layout.name}>
                  {layout.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleEdit} variant="outline">Edit</Button>
          <Button onClick={handleDownload} variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
          <Button onClick={handleShare} variant="outline"><Share className="mr-2 h-4 w-4" /> Share</Button>
        </div>
      </div>
      <Card className="overflow-hidden shadow-lg rounded-none">
        <CardContent className="p-0" id="resume-content" ref={resumeRef}>
          {SelectedLayout && isResumeValid ? (
            <SelectedLayout resume={resume} />
          ) : (
            <div className="p-8 text-center">
              <p className="text-xl text-gray-600">
                {isResumeValid ? "Selected theme not found." : "Resume data is incomplete or invalid."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showDownloadOptions} onOpenChange={setShowDownloadOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">File Name</label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="downloadFormat" className="block text-sm font-medium text-gray-700">Format</label>
              <Select onValueChange={setDownloadFormat} defaultValue={downloadFormat}>
                <SelectTrigger id="downloadFormat" className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDownloadOptions(false)} variant="outline">Cancel</Button>
            <Button onClick={downloadFile} variant="default">Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* {downloadProgress > 0 && (
        <Progress value={downloadProgress} className="w-full mt-4" />
      )} */}
    </div>
  )
}