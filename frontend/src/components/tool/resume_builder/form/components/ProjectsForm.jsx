import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, Wand2 } from 'lucide-react'
import useAIResumeAssistant from '../../hook/Aigen'
import { toast } from "sonner"

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function ProjectsForm({ projects, onChange }) {
  const handleInputChange = (e, index, subfield) => {
    const { value } = e.target;
    const updatedProjects = [...projects];
    if (subfield === 'technologies') {
      updatedProjects[index][subfield] = value.split(',').map(tech => tech.trim());
    } else {
      updatedProjects[index][subfield] = value;
    }
    onChange(updatedProjects);
  };

  const addProject = () => {
    onChange([...projects, { name: '', description: '', technologies: [] }]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const handleAIUpdate = (aiGeneratedContent) => {
    if (aiGeneratedContent && aiGeneratedContent.projects) {
      const updatedProjects = projects.map(project => ({
        ...project,
        description: stripHtmlTags(aiGeneratedContent.projects)
      }));
      onChange(updatedProjects);
      toast.success("Project descriptions updated with AI suggestions");
    }
  };

  const {
    isGenerating,
    error,
    generatedContent,
    generateContent
  } = useAIResumeAssistant({ projects }, handleAIUpdate, { projects: '' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {projects.map((project, index) => (
            <AccordionItem value={`project-${index}`} key={index}>
              <AccordionTrigger>{project.name || `Project ${index + 1}`}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => handleInputChange(e, index, 'name')}
                  />
                  <div className="relative">
                    <Textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => handleInputChange(e, index, 'description')}
                      rows={3}
                      className="pr-10"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      title="Generate with AI"
                      onClick={() => generateContent()}
                      disabled={isGenerating}
                      className="absolute right-2 top-2"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {isGenerating && <p className="text-blue-500 text-sm">Generating project description...</p>}
                  {generatedContent && generatedContent.projects && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">AI-Generated Suggestion:</h4>
                      <p className="text-sm italic">{stripHtmlTags(generatedContent.projects)}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleInputChange({ target: { value: stripHtmlTags(generatedContent.projects) } }, index, 'description')}
                        >
                          Use This Description
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateContent()}
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
                  />
                  <Button type="button" variant="destructive" onClick={() => removeProject(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button type="button" onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
}