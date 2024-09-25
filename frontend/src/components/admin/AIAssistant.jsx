'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2, Wand2, FileText, ClipboardList, Undo, Redo, Save, Sparkles } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import debounce from 'lodash/debounce'

const AIAssistant = ({ jobData, onUpdate, initialContent = { description: '', requirements: '' } }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(initialContent)
  const [activeTab, setActiveTab] = useState("description")
  const [autoSave, setAutoSave] = useState(false)
  const [history, setHistory] = useState({ description: [], requirements: [] })
  const [historyIndex, setHistoryIndex] = useState({ description: -1, requirements: -1 })
  const [creativity, setCreativity] = useState(0.5)
  const [wordCount, setWordCount] = useState({ description: 0, requirements: 0 })
  const quillRef = useRef(null)

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  const generateContent = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
      if (!apiKey) throw new Error("API key is not set")

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const prompt = `
        Generate a professional job description and list of requirements for the following position:

        Job Title: ${jobData.title}
        Company: ${jobData.companyId ? "A reputable company in the industry" : "Not specified"}
        Location: ${jobData.location}
        Job Type: ${jobData.jobType}
        Experience Level: ${jobData.experience}
        Number of Positions: ${jobData.position || "Not specified"}
        Salary Range: ${jobData.salary || "Not specified"}
        Application Deadline: ${jobData.expire || "Not specified"}

        Please provide:
        1. A detailed job description (300-400 words)
        2. A comprehensive list of job requirements (200-250 words)

        Format the output as HTML compatible with ReactQuill. Use appropriate tags (e.g., <p>, <ul>, <li>, <h1>, <h2>) for structure.

        Use the following structure:
        <h1>Job Description</h1>
        (Job description content here)

        <h1>Job Requirements</h1>
        (Job requirements content here)

        Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
      `

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      const [descriptionContent, requirementsContent] = text.split('<h1>Job Requirements</h1>')

      if (!descriptionContent || !requirementsContent) {
        throw new Error("Failed to generate complete job content")
      }

      const description = descriptionContent.replace('<h1>Job Description</h1>', '').trim()
      const requirements = requirementsContent.trim()

      setGeneratedContent({ description, requirements })
      addToHistory('description', description)
      addToHistory('requirements', requirements)
      onUpdate({ description, requirements })
      updateWordCount({ description, requirements })
      toast.success("Job content generated successfully!")
    } catch (err) {
      console.error("Error generating content:", err)
      setError(err.message || "An error occurred while generating the job content. Please try again.")
      toast.error("Failed to generate job content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [jobData, onUpdate, creativity])

  const handleContentChange = useCallback((content, field) => {
    setGeneratedContent(prev => {
      const newContent = { ...prev, [field]: content }
      onUpdate(newContent)
      updateWordCount(newContent)
      return newContent
    })
    addToHistory(field, content)
  }, [onUpdate])

  const addToHistory = useCallback((field, content) => {
    setHistory(prev => ({
      ...prev,
      [field]: [...prev[field].slice(0, historyIndex[field] + 1), content]
    }))
    setHistoryIndex(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }))
  }, [historyIndex])

  const undo = useCallback((field) => {
    if (historyIndex[field] > 0) {
      setHistoryIndex(prev => ({
        ...prev,
        [field]: prev[field] - 1
      }))
      const newContent = {
        ...generatedContent,
        [field]: history[field][historyIndex[field] - 1]
      }
      setGeneratedContent(newContent)
      onUpdate(newContent)
      updateWordCount(newContent)
    }
  }, [history, historyIndex, generatedContent, onUpdate])

  const redo = useCallback((field) => {
    if (historyIndex[field] < history[field].length - 1) {
      setHistoryIndex(prev => ({
        ...prev,
        [field]: prev[field] + 1
      }))
      const newContent = {
        ...generatedContent,
        [field]: history[field][historyIndex[field] + 1]
      }
      setGeneratedContent(newContent)
      onUpdate(newContent)
      updateWordCount(newContent)
    }
  }, [history, historyIndex, generatedContent, onUpdate])

  const updateWordCount = useCallback((content) => {
    setWordCount({
      description: content.description.trim().split(/\s+/).length,
      requirements: content.requirements.trim().split(/\s+/).length
    })
  }, [])

  const debouncedUpdate = useMemo(() => debounce(onUpdate, 1000), [onUpdate])

  useEffect(() => {
    if (autoSave) {
      debouncedUpdate(generatedContent)
    }
    return () => debouncedUpdate.cancel()
  }, [generatedContent, autoSave, debouncedUpdate])

  const optimizeContent = useCallback(async (field) => {
    setIsGenerating(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
      if (!apiKey) throw new Error("API key is not set")

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const prompt = `
        Optimize and improve the following ${field} for a job posting:

        ${generatedContent[field]}

        Please enhance the content, making it more engaging and professional. 
        Maintain the same structure and format, but improve the language and clarity.
        Ensure the word count remains similar to the original.
      `

      const result = await model.generateContent(prompt)
      const optimizedContent = result.response.text()

      setGeneratedContent(prev => {
        const newContent = { ...prev, [field]: optimizedContent }
        onUpdate(newContent)
        updateWordCount(newContent)
        return newContent
      })
      addToHistory(field, optimizedContent)
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} optimized successfully!`)
    } catch (err) {
      console.error("Error optimizing content:", err)
      setError(err.message || `An error occurred while optimizing the ${field}. Please try again.`)
      toast.error(`Failed to optimize ${field}. Please try again.`)
    } finally {
      setIsGenerating(false)
    }
  }, [generatedContent, onUpdate, addToHistory, updateWordCount])

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Assistant</CardTitle>
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <div className="flex items-center space-x-2">

                <Switch id="autosave" checked={autoSave} onCheckedChange={setAutoSave} />
                
                <Label htmlFor="autosave" className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Save</Label>
              </div> */}
            </TooltipTrigger>
            <TooltipContent>
              <p>Automatically save changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Sparkles className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Creativity Level</h3>
              <Slider
                defaultValue={[creativity * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => setCreativity(val / 100)}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Conservative</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(creativity * 100)}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Creative</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </CardHeader>

    <CardContent className="space-y-4 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="description" className="text-sm font-medium">Description</TabsTrigger>
          <TabsTrigger value="requirements" className="text-sm font-medium">Requirements</TabsTrigger>
        </TabsList>

        {['description', 'requirements'].map((field) => (
          <TabsContent key={field} value={field} className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner p-2">
              <ReactQuill
                ref={quillRef}
                value={generatedContent[field]}
                onChange={(content) => handleContentChange(content, field)}
                modules={modules}
                className="min-h-[300px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => undo(field)} disabled={historyIndex[field] <= 0}>
                  <Undo className="w-4 h-4 mr-1" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => redo(field)} disabled={historyIndex[field] >= history[field].length - 1}>
                  <Redo className="w-4 h-4 mr-1" />
                </Button>
              </div>
              <div className="space-x-2">
                {/* <Button variant="secondary" size="sm" onClick={() => optimizeContent(field)}>
                  <FileText className="w-4 h-4 mr-1" />Optimize
                </Button> */}
                <Button variant="primary" size="sm" onClick={generateContent} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Wand2 className="w-4 h-4 mr-1" />}
                  Generate
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Word count: {wordCount[field]}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
)
}

export default AIAssistant
