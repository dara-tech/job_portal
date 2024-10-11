import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, Wand2 } from 'lucide-react'
import { generateProjects } from '../../hook/Project';
import { toast, Toaster } from "sonner"

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function ProjectsForm({ projects, onChange }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);

  const handleInputChange = useCallback((e, index, subfield) => {
    const { value } = e.target;
    const updatedProjects = [...projects];
    if (subfield === 'technologies') {
      updatedProjects[index][subfield] = value.split(',').map(tech => tech.trim());
    } else {
      updatedProjects[index][subfield] = value;
    }
    onChange(updatedProjects);
  }, [projects, onChange]);

  const addProject = useCallback(() => {
    onChange([...projects, { name: '', description: '', technologies: [] }]);
  }, [projects, onChange]);

  const removeProject = useCallback((index) => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      onChange(updatedProjects);
    }
  }, [projects, onChange]);

  const handleAIUpdate = useCallback((aiGeneratedContent) => {
    if (aiGeneratedContent && activeProjectIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[activeProjectIndex].description = stripHtmlTags(aiGeneratedContent);
      onChange(updatedProjects);
      toast.success("Project description updated with AI suggestions");
    }
  }, [projects, onChange, activeProjectIndex]);

  const generateContent = useCallback(async (index) => {
    setActiveProjectIndex(index);
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateProjects({ project: projects[index] }, 0.5);
      setGeneratedContent(content);
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate project description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [projects]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <Toaster position="top-right" />
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {projects.map((project, index) => (
            <AccordionItem value={`project-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold">
                {project.name || `Project ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => handleInputChange(e, index, 'name')}
                    className="w-full"
                  />
                  <div className="relative">
                    <Textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => handleInputChange(e, index, 'description')}
                      rows={3}
                      className="w-full pr-10 min-h-[100px]"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      title="Generate with AI"
                      onClick={() => generateContent(index)}
                      disabled={isGenerating}
                      className="absolute right-2 top-2"
                      aria-label="Generate project description with AI"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
                  {isGenerating && index === activeProjectIndex && (
                    <p className="text-blue-500 text-sm">Generating project description...</p>
                  )}
                  {generatedContent && index === activeProjectIndex && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">AI-Generated Suggestion:</h4>
                      <p className="text-sm italic">{stripHtmlTags(generatedContent)}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAIUpdate(generatedContent)}
                        >
                          Use This Description
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateContent(index)}
                          disabled={isGenerating}
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                  <Input
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                    onChange={(e) => handleInputChange(e, index, 'technologies')}
                    className="w-full"
                  />
                  <Button type="button" variant="destructive" onClick={() => removeProject(index)} className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Project
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button type="button" onClick={addProject} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
}