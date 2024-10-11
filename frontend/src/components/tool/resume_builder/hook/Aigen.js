import { useState, useCallback, useMemo, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const useAIResumeAssistant = (resumeData, onUpdate, initialContent = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState("summary");
  const [history, setHistory] = useState({});
  const [historyIndex, setHistoryIndex] = useState({});
  const [creativity, setCreativity] = useState(0.5);
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  }), []);

  const generateContent = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API key is not set");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Use resumeData to generate the prompt dynamically
      const prompt = `
        Generate a professional resume content for the following person:
        Name: ${resumeData.personalInfo?.name || 'Not specified'}
        Title: ${resumeData.title || 'Not specified'}
        Summary: ${resumeData.summary || 'Not specified'}
        Skills: ${resumeData.skills ? resumeData.skills.join(', ') : 'Not specified'}
        Experience: ${resumeData.experience ? resumeData.experience.map(exp => `${exp.position} at ${exp.company}`).join(', ') : 'Not specified'}

        Please provide:
        1. A professional summary (100-150 words)
        2. A list of key skills (50-75 words)
        3. Work experience highlights (200-250 words)
        4. Education summary (50-75 words)
        5. Project highlights (100-150 words)

        Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse the AI-generated text into sections
      const sections = parseAIResponse(text);

      const newContent = {
        summary: sections.summary,
        skills: sections.skills,
        experience: sections.experience,
        education: sections.education,
        projects: sections.projects
      };

      setGeneratedContent(newContent);
      onUpdate(newContent); // Update the parent component with the new content
      toast.success("Resume content generated successfully!");
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate resume content. Please try again.");
      toast.error("Failed to generate resume content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [resumeData, onUpdate, creativity]);

  // Helper function to parse AI response into structured sections
  const parseAIResponse = (text) => {
    const sections = { summary: '', skills: '', experience: '', education: '', projects: '' };
    const sectionTitles = ['Summary', 'Skills', 'Experience', 'Education', 'Projects'];
    
    let currentSection = null;

    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();

      if (sectionTitles.some(title => trimmedLine.includes(title))) {
        currentSection = trimmedLine.match(/Summary|Skills|Experience|Education|Projects/)[0].toLowerCase();
      } else if (currentSection) {
        sections[currentSection] += trimmedLine + ' ';
      }
    });

    return sections;
  };

  return {
    isGenerating,
    error,
    generatedContent,
    activeTab,
    setActiveTab,
    creativity,
    setCreativity,
    quillRef,
    modules,
    generateContent
  };
};

export default useAIResumeAssistant;
