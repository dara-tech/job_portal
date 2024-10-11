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
import { Download, ExternalLink, Share } from 'lucide-react'
import { toast } from 'react-hot-toast'
import html2canvas from 'html2canvas'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { useMediaQuery } from '@/components/tool/resume_builder/hook/useMediaQuery'

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function ResumeView({ onResumeChange }) {
  const [selectedTheme, setSelectedTheme] = useState('Classic')
  const [resume, setResume] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [fileName, setFileName] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [scale, setScale] = useState(1)
  const { id } = useParams()
  const navigate = useNavigate()
  const resumeRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 640px)')

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

  useEffect(() => {
    const updateScale = () => {
      if (resumeRef.current) {
        const containerWidth = resumeRef.current.offsetWidth
        const contentWidth = 800 // Assuming a standard resume width
        const newScale = containerWidth / contentWidth
        setScale(Math.min(newScale, 1)) // Ensure scale is not greater than 1
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const handleThemeChange = (value) => {
    setSelectedTheme(value)
  }

  const handleDownload = () => {
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
        const pdfWidth = 595.28;  // A4 width in points
        const pdfHeight = 841.89; // A4 height in points
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;
        const aspectRatio = imageWidth / imageHeight;

        let fitWidth = pdfWidth - 40; // Subtracting margins
        let fitHeight = fitWidth / aspectRatio;

        if (fitHeight > pdfHeight - 40) { // Check if it exceeds page height
          fitHeight = pdfHeight - 40;
          fitWidth = fitHeight * aspectRatio;
        }

        const docDefinition = {
          pageSize: 'A4',
          pageMargins: [20, 20, 20, 20],
          content: [
            {
              image: imageDataUrl,
              width: fitWidth,
              height: fitHeight,
              alignment: 'center'
            }
          ]
        };
        pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
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
      setDownloadProgress(0)
    }
  }

  const handleShare = async () => {
    try {
      const response = await axios.post(`${RESUME_API_ENDPOINT}/${id}/share`, {}, {
        withCredentials: true
      })
      if (response.data && response.data.shareUrl) {
        await navigator.clipboard.writeText(response.data.shareUrl)
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
    <div className="space-y-4 max-w-4xl mx-auto mt-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold">{resume?.title || 'Resume Preview'}</h2>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Select onValueChange={handleThemeChange} value={selectedTheme}>
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
          <Button onClick={handleShare} variant="outline"><Share className="h-4 w-4" /></Button>
        </div>
      </div>
      <Card className="overflow-hidden rounded-none border-none shadow-none">
        <CardContent className="p-0" id="resume-content" ref={resumeRef}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%` }}>
            {SelectedLayout && isResumeValid ? (
              <SelectedLayout resume={resume} />
            ) : (
              <div className="p-2 text-center">
                <p>
                  {isResumeValid ? "Selected theme not found." : "Resume data is incomplete or invalid."}
                </p>
              </div>
            )}
          </div>
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
              <Select onValueChange={setDownloadFormat} value={downloadFormat}>
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
      {downloadProgress > 0 && (
        <Progress value={downloadProgress} className="w-full mt-4" />
      )}
    </div>
  )
}