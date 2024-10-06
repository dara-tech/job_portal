'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { toast } from "sonner"

const useAIResumeAssistant = (resumeData, onUpdate, initialContent = { summary: '', skills: '', experience: '', education: '', projects: '' }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(initialContent)
  const [activeTab, setActiveTab] = useState("summary")
  const [history, setHistory] = useState({ summary: [], skills: [], experience: [], education: [], projects: [] })
  const [historyIndex, setHistoryIndex] = useState({ summary: -1, skills: -1, experience: -1, education: -1, projects: -1 })
  const [creativity, setCreativity] = useState(0.5)
  const [wordCount, setWordCount] = useState({ summary: 0, skills: 0, experience: 0, education: 0, projects: 0 })
  const quillRef = useRef(null)

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
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
        Generate a professional resume content for the following person:

        Name: ${resumeData.personalInfo?.name || 'Not specified'}
        Current Position: ${resumeData.currentPosition || 'Not specified'}
        Years of Experience: ${resumeData.yearsOfExperience || 'Not specified'}
        Skills: ${resumeData.skills ? resumeData.skills.join(', ') : 'Not specified'}

        Please provide:
        1. A professional summary (100-150 words)
        2. A list of key skills (50-75 words)
        3. Work experience highlights (200-250 words)
        4. Education summary (50-75 words)
        5. Project highlights (100-150 words)

        Format the output as HTML compatible with ReactQuill. Use appropriate tags (e.g., <p>, <ul>, <li>, <h3>) for structure.

        Use the following structure:
        <h3>Professional Summary</h3>
        (Summary content here)

        <h3>Key Skills</h3>
        (Skills content here)

        <h3>Work Experience</h3>
        (Experience content here)

        <h3>Education</h3>
        (Education content here)

        <h3>Projects</h3>
        (Projects content here)

        Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
      `

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      const [summaryContent, skillsContent, experienceContent, educationContent, projectsContent] = text.split('<h3>')
        .slice(1)
        .map(section => '<h3>' + section.trim())

      const newContent = { 
        summary: summaryContent, 
        skills: skillsContent, 
        experience: experienceContent, 
        education: educationContent,
        projects: projectsContent
      }

      setGeneratedContent(newContent)
      Object.keys(initialContent).forEach(field => {
        addToHistory(field, newContent[field])
      })
      onUpdate(newContent)
      updateWordCount(newContent)
      toast.success("Resume content generated successfully!")
    } catch (err) {
      console.error("Error generating content:", err)
      setError(err.message || "An error occurred while generating the resume content. Please try again.")
      toast.error("Failed to generate resume content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [resumeData, onUpdate, creativity, initialContent])

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
    const stripHtml = (html) => html.replace(/<[^>]*>/g, '')
    setWordCount({
      summary: stripHtml(content.summary).trim().split(/\s+/).length,
      skills: stripHtml(content.skills).trim().split(/\s+/).length,
      experience: stripHtml(content.experience).trim().split(/\s+/).length,
      education: stripHtml(content.education).trim().split(/\s+/).length,
      projects: stripHtml(content.projects).trim().split(/\s+/).length
    })
  }, [])

  return {
    isGenerating,
    error,
    generatedContent,
    activeTab,
    setActiveTab,
    history,
    historyIndex,
    creativity,
    setCreativity,
    wordCount,
    quillRef,
    modules,
    generateContent,
    handleContentChange,
    undo,
    redo
  }
}

export default useAIResumeAssistant
